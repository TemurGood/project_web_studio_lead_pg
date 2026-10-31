import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, source = 'form', details = '' } = body;

    // Базовая валидация
    if (!name || !contact) {
      return NextResponse.json(
        { error: 'Имя и контакт обязательны для заполнения' },
        { status: 400 }
      );
    }

    // 1. Сохраняем в базу данных Turso
    const [newLead] = await db
      .insert(leads)
      .values({
        name,
        contact,
        source,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
      })
      .returning();

    // 2. Отправляем уведомление в Telegram (фоново, не ломая ответ пользователю)
    sendTelegramNotification({
      name,
      contact,
      source,
      details: typeof details === 'object' ? JSON.stringify(details, null, 2) : details,
    }).catch((err) => console.error('Telegram background send error:', err));

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error('Lead processing error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера при отправке заявки' },
      { status: 500 }
    );
  }
}