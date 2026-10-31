import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

// Получение списка всех заявок
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pass = searchParams.get('pass');

    // Проверка пароля администратора
    if (pass !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
    }

    const allLeads = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.id));

    return NextResponse.json({ leads: allLeads });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// Обновление статуса заявки
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, pass } = body;

    if (pass !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
    }

    await db
      .update(leads)
      .set({ status })
      .where(eq(leads.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin update status error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}