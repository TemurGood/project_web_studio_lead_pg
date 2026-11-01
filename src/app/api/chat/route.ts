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
Ты — опытный IT-архитектор и ведущий консультант студии веб-разработки "NOVA STUDIO".
Твоя задача — профессионально, уверенно и емко консультировать клиентов по созданию сайтов для их бизнеса и подводить к заявке.

ПРАВИЛА ОТВЕТА:
1. Отвечай кратко, структурированно (2-3 емких абзаца или маркированный список). Не пиши водянистых вступлений.
2. ОБЯЗАТЕЛЬНО дописывай все предложения до конца, логически завершая мысль.
3. Если спросили про нишу (например, продажа кирпича / автосервис / одежда) — дай 2-3 конкретных совета именно под эту сферу (например: каталог с фильтрацией по маркам, онлайн-калькулятор доставки/объема, блок доверия с сертификатами ГОСТ).
4. В конце ответа всегда задавай вовлекающий вопрос или предлагай оставить Telegram/телефон для получения персонального концепта и расчета сметы.
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

    // Оставляем последние 6 сообщений для быстродействия и чистоты диалога
    const recentMessages = messages.slice(-6);

    const formattedContents = recentMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Список скоростных моделей без зависаний
    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-latest',
    ];

    let output = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.65,
            maxOutputTokens: 1200, // Достаточно для полноценного русского ответа
            // Отключаем скрытый режим долгих размышлений (thinking) для мгновенного ответа
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        });

        output = response.text?.trim() || '';
        if (output) {
          console.log(`[Gemini Fast] Ответ сгенерирован моделью: ${model}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini] Модель ${model} вернула ошибку:`, err?.message || err);
        // Если модель не поддерживает thinkingBudget: 0 или вернула ошибку, пробуем без него
        try {
          const fallbackResp = await ai.models.generateContent({
            model: model,
            contents: formattedContents,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              temperature: 0.65,
              maxOutputTokens: 1000,
            },
          });
          output = fallbackResp.text?.trim() || '';
          if (output) break;
        } catch {
          // Идем к следующей модели
          continue;
        }
      }
    }

    if (!output) {
      return NextResponse.json({
        reply:
          'Для вашей ниши мы рекомендуем сайт с интерактивным каталогом, калькулятором стоимости и быстрым заказом в 1 клик. Оставьте ваш Telegram (@username) или номер телефона прямо здесь, и наш архитектор бесплатно подготовит персональную структуру проекта!',
      });
    }

    // Автоматический перехват контактов клиента в Telegram и Turso
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const contactMatch = lastUserMessage.match(/(@[\w\d_]+|\+?[\d\s-]{9,})/);

    if (contactMatch) {
      const contact = contactMatch[0].trim();

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
            details: `Сообщение: "${lastUserMessage}"`,
          });
          console.log('[Auto-Lead] Контакт успешно сохранен!');
        } catch (e) {
          console.error('[Auto-Lead Error]:', e);
        }
      })();
    }

    return NextResponse.json({ reply: output });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        reply:
          'Отличная ниша! Для точного расчета оставьте ваш контакт в форме заявки на сайте, и мы пришлем готовую смету в течение 15 минут.',
      },
      { status: 200 }
    );
  }
}