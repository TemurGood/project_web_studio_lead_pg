import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { sendTelegramNotification } from '@/lib/telegram';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `
Ты — опытный IT-архитектор и ведущий консультант премиальной студии веб-разработки "NOVA STUDIO".
Твоя цель — консультировать потенциальных клиентов, отвечать на вопросы по созданию сайтов и мягко подводить их к передаче контактов (Telegram или телефон) для точного расчета сметы.

Наши услуги и ориентиры:
- Лендинги с высокой конверсией (Framer Motion, 3D, параллакс) — от $500, срок от 4 до 7 дней.
- Корпоративные сайты и платформы на Next.js / React — от $1200, срок 2-3 недели.
- Интернет-магазины с интеграцией платежей, CRM и ИИ — от $2000.
- Внедрение ИИ (ассистенты, чат-боты, автоматизация лидогенерации) в любой бизнес.

Правила общения:
1. Будь вежливым, уверенным, пиши лаконично, емко, без шаблонной "воды".
2. Если клиент спрашивает цену или сроки — назови диапазон и объясни, от чего зависит стоимость.
3. В конце каждого ответа задавай вовлекающий вопрос или предложи оставить Telegram / телефон, чтобы наш арт-директор подготовил персональный концепт.
4. Отвечай на том языке, на котором пишет клиент (русский, узбекский, английский).
`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API-ключ GEMINI_API_KEY не найден в .env.local' },
      { status: 500 }
    );
  }

  try {
    const { messages }: { messages: Message[] } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Некорректный формат сообщений' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Форматируем историю сообщений для Gemini
    const formattedContents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Список актуальных моделей: проверенная и быстрая стоит первой
    const priorityModels = [
      'gemini-flash-latest',
      'gemini-2.0-flash',
      'gemini-3.1-pro-preview',
    ];

    let output = '';
    let lastError: any = null;

    // Перебор моделей с защитой от 503 и 404
    for (const model of priorityModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: model,
            contents: formattedContents,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              temperature: 0.7,
              maxOutputTokens: 450, // Быстрый ответ без лишних задержек
            },
          });

          output = response.text?.trim() || '';
          if (output) break;
        } catch (err: any) {
          lastError = err;

          // Если модели нет в API (404), сразу переходим к следующей модели
          if (err?.status === 404 || err?.message?.includes('404')) {
            break;
          }

          // Если сервера временно заняты (503), делаем короткую паузу и пробуем снова
          if (err?.status === 503 && attempt === 1) {
            console.log(`[503] Модель ${model} занята, ждем 1.5 сек...`);
            await new Promise((r) => setTimeout(r, 1500));
          }
        }
      }

      if (output) {
        console.log(`[Gemini] Успешно сгенерировано моделью: ${model}`);
        break;
      }
    }

    // Если все модели перегружены — возвращаем вежливый фоллбэк вместо ошибки 500
    if (!output) {
      return NextResponse.json({
        reply:
          'Сервера ИИ сейчас испытывают повышенную нагрузку. Оставьте ваш Telegram (@username) или номер телефона прямо здесь, и наш ведущий специалист свяжется с вами в течение 15 минут для детального расчета!',
      });
    }

    // Автоматический перехват контактов клиента (Telegram никнейм или телефон)
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const contactMatch = lastUserMessage.match(/(@[\w\d_]+|\+?[\d\s-]{9,})/);

    if (contactMatch) {
      const contact = contactMatch[0].trim();

      // Фоновое сохранение лида в Turso + отправка в Telegram
      (async () => {
        try {
          await db.insert(leads).values({
            name: 'Лид из ИИ-чата',
            contact,
            source: 'ai_chat',
            details: `Диалог:\n${messages.map((m) => `${m.role}: ${m.content}`).join('\n')}`,
          });

          await sendTelegramNotification({
            name: 'Горячий лид из ИИ-чата',
            contact,
            source: 'ai_chat',
            details: `Клиент написал: "${lastUserMessage}"`,
          });

          console.log('[Auto-Lead] Контакт из чата успешно отправлен в TG и Turso!');
        } catch (e) {
          console.error('[Auto-Lead Error]:', e);
        }
      })();
    }

    return NextResponse.json({ reply: output });
  } catch (error: any) {
    console.error('Chat API general error:', error);
    return NextResponse.json(
      {
        reply:
          'Произошла временная заминка при связи с ИИ. Оставьте ваш контакт в форме на сайте, и мы рассчитаем смету вручную!',
      },
      { status: 200 }
    );
  }
}