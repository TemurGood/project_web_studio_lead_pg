'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Code2, Rocket, Star } from 'lucide-react';
import AiChat from '@/components/AiChat';
import Quiz from '@/components/Quiz';
import { Features, FAQ, LeadForm } from '@/components/Sections';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      {/* Фоновые неоновые световые пятна (Параллакс свечение) */}
      <div className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[65%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Навигация (Header) */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-neutral-950/60 border-b border-neutral-800/60">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Code2 className="w-5 h-5" />
            </span>
            <span>NOVA<span className="text-cyan-400">STUDIO</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
            <a href="#features" className="hover:text-white transition">Преимущества</a>
            <a href="#quiz" className="hover:text-white transition">Калькулятор стоимости</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
            <a href="#contact" className="hover:text-white transition">Контакты</a>
          </nav>

          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700/80 hover:border-cyan-500/80 text-white text-xs sm:text-sm font-medium transition shadow-sm"
          >
            Оставить заявку
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 text-center max-w-5xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4" /> Веб-разработка нового поколения с ИИ
          </div>

          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
            Создаем сайты, которые{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              влюбляют и продают
            </span>
          </h1>

          <p className="text-neutral-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Разрабатываем сайты на Next.js с вау-анимациями, встроенными ИИ-консультантами и моментальной отправкой лидов прямо в ваш Telegram.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#quiz"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-xl shadow-cyan-500/25 transition flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4" /> Рассчитать стоимость проекта
            </a>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition flex items-center justify-center gap-2 text-sm"
            >
              Узнать преимущества <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Доказательства / Метрики */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-neutral-800/60 max-w-4xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">4–7 дней</div>
              <div className="text-xs text-neutral-400 mt-1">Срок запуска лендинга</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">95+</div>
              <div className="text-xs text-neutral-400 mt-1">Оценка Google PageSpeed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">x2.4</div>
              <div className="text-xs text-neutral-400 mt-1">Средний рост конверсии</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-1">
                5.0 <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 inline" />
              </div>
              <div className="text-xs text-neutral-400 mt-1">Рейтинг отзывов</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Секция Bento преимуществ */}
      <Features />

      {/* Интерактивный Квиз */}
      <Quiz />

      {/* FAQ */}
      <FAQ />

      {/* Финальная форма */}
      <LeadForm />

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-10 px-4 text-center text-xs text-neutral-500 relative z-10">
        <p>© 2026 NOVA STUDIO. Все права защищены. Разработано с использованием Next.js, Turso & Gemini AI.</p>
      </footer>

      {/* Плавающий ИИ Чат-ассистент */}
      <AiChat />
    </div>
  );
}