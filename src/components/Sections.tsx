'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Cpu,
  Layers,
  ChevronDown,
  Send,
  CheckCircle2,
} from 'lucide-react';

// Bento Grid Преимущества
export function Features() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: 'Ультраскорость (PageSpeed 95+)',
      desc: 'Next.js App Router и server components обеспечивают моментальную загрузку сайта.',
      colSpan: 'sm:col-span-2',
    },
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: 'Встроенный Gemini AI',
      desc: 'Автоматические ИИ-консультанты квалифицируют клиентов и собирают лиды даже ночью.',
      colSpan: 'sm:col-span-1',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      title: 'Конверсионный UX/UI',
      desc: 'Каждая кнопка и блок спроектированы по проверенным законам продуктового маркетинга.',
      colSpan: 'sm:col-span-1',
    },
    {
      icon: <Layers className="w-6 h-6 text-blue-400" />,
      title: '3D & Плавный параллакс',
      desc: 'Framer Motion создает кинематографичный экспириенс, который выделяет вас на фоне конкурентов.',
      colSpan: 'sm:col-span-2',
    },
  ];

  return (
    <section id="features" className="py-24 px-4 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16 space-y-3">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Почему наши сайты продают лучше других
        </h2>
        <p className="text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
          Мы объединяем передовой технологический стек, психологию продаж и искусственный интеллект.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700/80 rounded-3xl p-8 backdrop-blur-lg relative overflow-hidden transition-all group ${f.colSpan}`}
          >
            <div className="p-3 w-fit rounded-2xl bg-neutral-800/80 mb-5 border border-neutral-700/40">
              {f.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Аккордеон FAQ
export function FAQ() {
  const faqs = [
    {
      q: 'Сколько времени занимает разработка сайта под ключ?',
      a: 'Landing Page мы сдаем за 4–7 рабочих дней. Многостраничные корпоративные сайты и интернет-магазины занимают в среднем от 2 до 3 недель.',
    },
    {
      q: 'Как ИИ-помощник собирает заявки?',
      a: 'Мы обучаем Gemini специфике вашего бизнеса. Когда клиент задает вопрос в чате и оставляет свои контакты, система мгновенно сохраняет лид в базу и присылает уведомление в ваш Telegram.',
    },
    {
      q: 'Нужно ли мне платить ежемесячно за хостинг?',
      a: 'Благодаря Vercel и Turso базовая инфраструктура для большинства проектов обходится абсолютно бесплатно. Вы платите только за домен раз в год.',
    },
    {
      q: 'Смогу ли я сам редактировать текст и товары?',
      a: 'Да, мы подключаем удобную админ-панель или систему управления контентом, чтобы вы могли менять текст, цены и фото без участия программиста.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-16 space-y-3">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Часто задаваемые вопросы
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base">Отвечаем честно на главные вопросы клиентов</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-neutral-800 rounded-2xl bg-neutral-900/50 backdrop-blur-md overflow-hidden transition"
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full p-6 text-left flex items-center justify-between text-white font-medium text-base sm:text-lg"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${
                  openIdx === i ? 'rotate-180 text-cyan-400' : ''
                }`}
              />
            </button>
            {openIdx === i && (
              <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/40 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Финальная форма заявки
export function LeadForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, details, source: 'form' }),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-3xl mx-auto relative z-10">
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 p-8 sm:p-12 rounded-3xl shadow-2xl relative">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Готовы обсудить ваш проект?
          </h2>
          <p className="text-neutral-400 text-sm">
            Оставьте заявку, и мы бесплатно сделаем аудит вашей ниши и предложим решение.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto" />
            <h4 className="text-xl font-semibold text-white">Спасибо за заявку!</h4>
            <p className="text-neutral-400 text-sm">Мы уже получили уведомление и скоро вам напишем.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full bg-neutral-800/70 border border-neutral-700/80 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Telegram (@username) или Телефон"
                className="w-full bg-neutral-800/70 border border-neutral-700/80 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Расскажите пару слов о задаче (необязательно)..."
              className="w-full bg-neutral-800/70 border border-neutral-700/80 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 text-sm resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-semibold text-white shadow-xl shadow-cyan-500/20 transition text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Отправляем...' : 'Отправить заявку в Telegram'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}