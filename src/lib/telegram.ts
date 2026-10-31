interface SendLeadNotificationParams {
  name: string;
  contact: string;
  source: string;
  details?: string | null;
}

export async function sendTelegramNotification({
  name,
  contact,
  source,
  details,
}: SendLeadNotificationParams) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Telegram credentials are not set in environment variables');
    return false;
  }

  // Человекопонятное отображение источника
  const sourceEmoji: Record<string, string> = {
    form: '📝 Форма на сайте',
    quiz: '🎯 Квиз-калькулятор',
    ai_chat: '🤖 ИИ-консультант Gemini',
  };

  const readableSource = sourceEmoji[source] || source;

  // Форматируем текст с HTML-разметкой
  let message = `🔥 <b>Новая заявка на разработку сайта!</b>\n\n`;
  message += `👤 <b>Имя:</b> ${escapeHtml(name)}\n`;
  message += `📞 <b>Контакт:</b> ${escapeHtml(contact)}\n`;
  message += `📍 <b>Источник:</b> ${readableSource}\n`;

  if (details) {
    message += `📋 <b>Детали/Запрос:</b>\n<i>${escapeHtml(details)}</i>\n`;
  }

  message += `\n⏰ <i>${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)</i>`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram API error:', data);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}