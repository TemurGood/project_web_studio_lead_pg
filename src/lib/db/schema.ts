import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  contact: text('contact').notNull(), // Телефон, Telegram или Email
  source: text('source').notNull().default('form'), // 'form' | 'quiz' | 'ai_chat'
  details: text('details'), // JSON строка с деталями (ответы квиза или саммари от ИИ)
  status: text('status').notNull().default('new'), // 'new' | 'contacted' | 'closed'
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;