'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowLeft, Send, Sparkles, Calculator } from 'lucide-react';

const steps = [
  {
    title: 'Какой тип сайта вам нужен?',
    options: [
      { label: 'Landing Page (Одностраничник)', price: 500, desc: 'Для запуска рекламы и быстрого теста ниши' },
      { label: 'Корпоративный сайт компании', price: 1200, desc: 'Для формирования доверия и презентации услуг' },
      { label: 'Интернет-магазин / E-commerce', price: 2000, desc: 'Каталог, корзина, онлайн-оплата и склад' },
      { label: 'Веб-сервис с интеграцией ИИ', price: 2500, desc: 'Личные кабинеты, ИИ-ассистенты, автоматизация' },
    ],
  },
  {
    title: 'Какие функции критически важны?',
    options: [
      { label: 'Анимации & 3D параллакс', price: 200, desc: 'Вау-эффект и удержание внимания' },
      { label: 'Встроенный ИИ-чат консультант', price: 300, desc: 'Авто-сбор лидов и ответы 24/7' },
      { label: 'Интеграция с Telegram / CRM', price: 150, desc: 'Мгновенные уведомления о заявках' },
      { label: 'SEO-оптимизация и суперскорость', price: 200, desc: 'Топ-1 в Google и загрузка до 1 сек' },
    ],
  },
  {
    title: 'В какие сроки планируете запуск?',
    options: [
      { label: '🔥 Горит! До 7 дней', price: 200, desc: 'Экспресс-разработка' },
      { label: '⚡ Стандарт: 2-3 недели', price: 0, desc: 'Оптимальный срок разработки' },
      { label: '☕ Не спешим: 1-2 месяца', price: 0, desc: 'Глубокая проработка и проектирование' },
    ],
  },
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateEstimate = () => {
    let total = 0;
    answers.forEach((optionIdx, stepIdx) => {
      if (optionIdx !== undefined && steps[stepIdx].options[optionIdx]) {
        total += steps[stepIdx].options[optionIdx].price;
      }
    });
    return total;
  };

  const handleSelectOption = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = index;
    setAnswers(newAnswers);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || !name.trim()) return;

    setIsSubmitting(true);
    const summary = steps.map((s, idx) => ({
      question: s.title,
      answer: s.options[answers[idx]]?.label || 'Не выбрано',
    }));

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          source: 'quiz',
          details: {
            estimatedPrice: `$${calculateEstimate()}`,
            answers: summary,
          },
        }),
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quiz" className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" /> Онлайн-калькулятор
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Рассчитайте стоимость вашего проекта за 1 минуту
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
            Ответьте на 3 вопроса — получите ориентировочную смету и персональную скидку 10%
          </p>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Индикатор прогресса */}
          {!isSubmitted && (
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                <span>Шаг {Math.min(currentStep + 1, 4)} из 4</span>
                <span className="text-cyan-400 font-semibold">
                  Предварительная смета: ~${calculateEstimate()}
                </span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!isSubmitted && currentStep < steps.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                  {steps[currentStep].title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {steps[currentStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-5 rounded-2xl border text-left transition-all relative group flex flex-col justify-between ${
                        answers[currentStep] === idx
                          ? 'border-cyan-500 bg-cyan-950/30'
                          : 'border-neutral-800 bg-neutral-800/40 hover:border-neutral-700 hover:bg-neutral-800/70'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-white text-base group-hover:text-cyan-300 transition">
                          {opt.label}
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">{opt.desc}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-cyan-400">
                          {opt.price > 0 ? `+ от $${opt.price}` : 'Включено'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 group-hover:text-cyan-400 transition" />
                      </div>
                    </button>
                  ))}
                </div>

                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition pt-4"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Назад
                  </button>
                )}
              </motion.div>
            )}

            {!isSubmitted && currentStep === steps.length && (
              <motion.form
                key="final-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-2">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Расчет почти готов!</h3>
                  <p className="text-sm text-neutral-400">
                    Ориентировочная смета вашего проекта:{' '}
                    <span className="text-cyan-400 font-bold text-lg">
                      от ${calculateEstimate()}
                    </span>
                    . Укажите, куда выслать подробное коммерческое предложение:
                  </p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Telegram (@username) или Телефон"
                    className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 text-sm"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-semibold text-white shadow-xl shadow-cyan-500/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Отправка...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Получить детальную смету в Telegram
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {isSubmitted && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Заявка успешно принята!</h3>
                <p className="text-neutral-400 text-sm max-w-md mx-auto">
                  Мы уже передали ответы квиза нашему арт-директору. В течение 15 минут свяжемся с
                  вами в Telegram для обсуждения деталей.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}