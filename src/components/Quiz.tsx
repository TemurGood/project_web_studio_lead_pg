'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Sparkles,
  Calculator,
  Gift,
  RotateCcw,
} from 'lucide-react';

const quizSteps = [
  {
    stepNumber: 1,
    title: 'Какой тип сайта вам необходим?',
    subtitle: 'Выберите формат, наилучшим образом решающий вашу задачу',
    options: [
      { label: 'Продающий Landing Page', price: 500, desc: 'Для рекламы конкретного товара или услуги (высокая конверсия)' },
      { label: 'Корпоративный сайт компании', price: 1200, desc: 'Многостраничный сайт для доверия клиентов и партнеров' },
      { label: 'Интернет-магазин (E-commerce)', price: 2200, desc: 'Каталог, фильтры, корзина и прием платежей' },
      { label: 'Веб-сервис / Платформа', price: 3000, desc: 'Личные кабинеты, дашборды, кастомный функционал' },
    ],
  },
  {
    stepNumber: 2,
    title: 'В какой сфере работает ваш бизнес?',
    subtitle: 'Это поможет нам подобрать правильную структуру и референсы',
    options: [
      { label: 'Услуги и B2B сектор', price: 0, desc: 'Консалтинг, юриспруденция, опт, логистика, аутсорс' },
      { label: 'E-commerce и розничная торговля', price: 0, desc: 'Одежда, косметика, электроника, товары для дома' },
      { label: 'Недвижимость, строительство, авто', price: 0, desc: 'Высокий средний чек, важен премиальный визуал' },
      { label: 'IT, финтех и стартапы', price: 0, desc: 'Инновационные продукты, SaaS, мобильные приложения' },
    ],
  },
  {
    stepNumber: 3,
    title: 'Какова главная цель запуска сайта?',
    subtitle: 'На чем сделать основной акцент при проектировании архитектуры',
    options: [
      { label: 'Максимум целевых лидов и звонков', price: 100, desc: 'Агрессивный маркетинг, фокус на конверсию форм' },
      { label: 'Формирование премиального имиджа', price: 150, desc: 'Подчеркнуть статус, надежность и уровень бренда' },
      { label: 'Прямые онлайн-продажи 24/7', price: 200, desc: 'Оплата на сайте, авто-уведомления менеджерам' },
      { label: 'Автоматизация рутины и процессов', price: 250, desc: 'Интеграция баз данных, учет клиентов и заказов' },
    ],
  },
  {
    stepNumber: 4,
    title: 'На какой стадии исходные материалы?',
    subtitle: 'Есть ли у вас фирменный стиль, тексты и фото',
    options: [
      { label: 'Есть всё: брендбук, тексты и фото', price: 0, desc: 'Готовые материалы ускорят запуск проекта' },
      { label: 'Есть только логотип и базовое понимание', price: 150, desc: 'Мы поможем написать продающие тексты' },
      { label: 'Нужно разработать всё «под ключ» с нуля', price: 300, desc: 'Создадим логотип, фирменный стиль, тексты и графику' },
      { label: 'Это редизайн текущего сайта', price: 100, desc: 'Перенесем контент со старого ресурса на новый движок' },
    ],
  },
  {
    stepNumber: 5,
    title: 'Какой визуальный стиль вам ближе?',
    subtitle: 'Эстетика создает первое впечатление о вашей компании',
    options: [
      { label: 'Минимализм (Apple / Stripe style)', price: 150, desc: 'Чистый воздух, акцент на типографику и детали' },
      { label: 'Премиум Dark с неоновым свечением', price: 200, desc: 'Глубокий темный фон, стеклянные карточки, футуризм' },
      { label: 'Строгий корпоративный стиль', price: 100, desc: 'Классическая сетка, надежность, деловые тона' },
      { label: 'Креативный с кинематографичным 3D', price: 350, desc: 'Интерактивные анимации, параллакс, вау-эффект' },
    ],
  },
  {
    stepNumber: 6,
    title: 'Нужна ли интеграция со сторонними сервисами?',
    subtitle: 'Автоматическая синхронизация сайта с рабочими инструментами',
    options: [
      { label: 'CRM (amoCRM / Битрикс24)', price: 150, desc: 'Мгновенное создание сделок при отправке формы' },
      { label: 'Прием платежей (Click, Payme, Stripe и др.)', price: 200, desc: 'Оплата картами прямо на сайте' },
      { label: 'Telegram-уведомления для команды', price: 50, desc: 'Лиды приходят менеджерам в закрытый чат' },
      { label: 'Пока интеграции не требуются', price: 0, desc: 'Только стандартная отправка на почту или в TG' },
    ],
  },
  {
    stepNumber: 7,
    title: 'Внедряем ИИ-ассистента на базе Gemini?',
    subtitle: 'Умный ИИ-помощник увеличивает конверсию на 30–40%',
    options: [
      { label: 'Да! Нужен умный ИИ-продавец 24/7', price: 300, desc: 'Отвечает на вопросы, консультирует и собирает контакты' },
      { label: 'ИИ для генерации рекомендаций', price: 250, desc: 'Подбор товаров или расчет стоимости на лету' },
      { label: 'Обычный онлайн-чат без ИИ', price: 50, desc: 'Классический виджет для живого оператора' },
      { label: 'Пока без чата', price: 0, desc: 'Оставляем только стандартные формы захвата' },
    ],
  },
  {
    stepNumber: 8,
    title: 'Требуется ли SEO-оптимизация и аналитика?',
    subtitle: 'Для привлечения бесплатного органического трафика из Google и Яндекса',
    options: [
      { label: 'Полный комплекс: SEO + Аналитика', price: 250, desc: 'Метатеги, микроразметка, Google Analytics, Яндекс Метрика' },
      { label: 'Только базовая оптимизация скорости', price: 50, desc: 'Настройка Core Web Vitals и PageSpeed 95+' },
      { label: 'Настройка пикселей рекламы (Meta, TikTok)', price: 100, desc: 'Для запуска таргетированной рекламы' },
      { label: 'Не нужно, есть штатный маркетолог', price: 0, desc: 'Подготовим сайт под требования вашего специалиста' },
    ],
  },
  {
    stepNumber: 9,
    title: 'В какие сроки планируете запуск?',
    subtitle: 'Мы распределяем загрузку команды для соблюдения дедлайнов',
    options: [
      { label: '🔥 Экспресс: срочно до 7–10 дней', price: 250, desc: 'Выделяем отдельный спринт и приоритетный фокус' },
      { label: '⚡ Оптимально: 2–3 недели', price: 0, desc: 'Комфортный темп для качественной реализации' },
      { label: '📅 Плановый запуск: в течение месяца', price: 0, desc: 'Поэтапное согласование каждого блока' },
      { label: '☕ Главное — высочайшее качество', price: 0, desc: 'Без спешки, с глубоким тестированием' },
    ],
  },
  {
    stepNumber: 10,
    title: 'Какой ориентировочный бюджет проекта?',
    subtitle: 'Позволит предложить наилучшее решение в рамках ваших возможностей',
    options: [
      { label: 'До $800 (Стартовый бюджет)', price: 0, desc: 'Быстрый запуск базовой версии для теста гипотезы' },
      { label: '$1000 – $2000 (Оптимальный для бизнеса)', price: 0, desc: 'Сбалансированное решение с полным функционалом' },
      { label: '$2500 – $4000 (Премиум разработка)', price: 0, desc: 'Индивидуальный дизайн, сложные анимации, ИИ' },
      { label: 'Более $4000 (Масштабный проект)', price: 0, desc: 'Highload-архитектура, нестандартная разработка' },
    ],
  },
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [bonus, setBonus] = useState('Прототип первого экрана');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Полный сброс квиза без перезагрузки страницы
  const handleResetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setName('');
    setContact('');
    setBonus('Прототип первого экрана');
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const calculateEstimate = () => {
    let total = 0;
    answers.forEach((optionIdx, stepIdx) => {
      if (optionIdx !== undefined && quizSteps[stepIdx]?.options[optionIdx]) {
        total += quizSteps[stepIdx].options[optionIdx].price;
      }
    });
    return total;
  };

  const handleSelectOption = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = index;
    setAnswers(newAnswers);
    if (currentStep < quizSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setIsSubmitting(true);

    const summary = quizSteps.map((step, idx) => ({
      question: step.title,
      answer: step.options[answers[idx]]?.label || 'Не выбрано',
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
            selectedBonus: bonus,
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

  const progressPercent = Math.min(
    ((currentStep + 1) / (quizSteps.length + 1)) * 100,
    100
  );

  return (
    <section id="quiz" className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" /> Интерактивный бриф (10 вопросов)
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Рассчитайте стоимость и сроки вашего сайта
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
            Пройдите 10 шагов, чтобы мы сформировали детальное техническое предложение и закрепили за вами подарок.
          </p>
        </div>

        <div className="bg-neutral-900/85 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Индикатор прогресса + кнопка быстрого сброса */}
          {!isSubmitted && (
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                <span className="flex items-center gap-3">
                  <span>Шаг {Math.min(currentStep + 1, 11)} из 11</span>
                  {currentStep > 0 && (
                    <button
                      onClick={handleResetQuiz}
                      className="text-neutral-500 hover:text-cyan-400 flex items-center gap-1 transition"
                      title="Начать сначала"
                    >
                      <RotateCcw className="w-3 h-3" /> сбросить
                    </button>
                  )}
                </span>
                <span className="text-cyan-400 font-semibold font-mono">
                  Предварительный расчет: ~${calculateEstimate()}
                </span>
              </div>
              <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Шаги с 1 по 10 */}
            {!isSubmitted && currentStep < quizSteps.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                    Вопрос {currentStep + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {quizSteps[currentStep].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                    {quizSteps[currentStep].subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quizSteps[currentStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-5 rounded-2xl border text-left transition-all relative group flex flex-col justify-between ${
                        answers[currentStep] === idx
                          ? 'border-cyan-500 bg-cyan-950/40 shadow-lg shadow-cyan-500/10'
                          : 'border-neutral-800/80 bg-neutral-800/40 hover:border-neutral-700 hover:bg-neutral-800/70'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-white text-sm sm:text-base group-hover:text-cyan-300 transition">
                          {opt.label}
                        </div>
                        <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-2 border-t border-neutral-800/60">
                        <span className="text-xs font-mono font-medium text-cyan-400">
                          {opt.price > 0 ? `+ от $${opt.price}` : 'Базовая опция'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 group-hover:text-cyan-400 transition" />
                      </div>
                    </button>
                  ))}
                </div>

                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition pt-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Назад к предыдущему вопросу
                  </button>
                )}
              </motion.div>
            )}

            {/* Финальный 11-й шаг: Получение сметы и подарка */}
            {!isSubmitted && currentStep === quizSteps.length && (
              <motion.form
                key="final-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-cyan-500/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Бриф успешно заполнен!
                  </h3>
                  <p className="text-sm text-neutral-400 max-w-lg mx-auto">
                    Ориентировочная смета вашего проекта составила:{' '}
                    <span className="text-cyan-400 font-bold text-lg font-mono">
                      от ${calculateEstimate()}
                    </span>
                    . Выберите приветственный бонус и укажите, куда выслать КП:
                  </p>
                </div>

                {/* Выбор бонуса */}
                <div className="bg-neutral-800/40 border border-neutral-700/60 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                    <Gift className="w-4 h-4 text-cyan-400" /> Выберите ваш подарок к заказу:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      'Бесплатный прототип',
                      'SEO-аудит ниши',
                      'Скидка 10% на разработку',
                    ].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBonus(b)}
                        className={`p-2.5 rounded-xl border text-center transition ${
                          bonus === b
                            ? 'bg-cyan-500 text-black font-semibold border-cyan-400'
                            : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Поля контактов */}
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
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 font-semibold text-white shadow-xl shadow-cyan-500/25 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Отправляем бриф...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Получить детальную смету и забрать подарок
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(quizSteps.length - 1)}
                      className="hover:text-white transition"
                    >
                      ← Назад к вопросам
                    </button>
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="hover:text-cyan-400 flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" /> Начать сначала
                    </button>
                  </div>
                </div>
              </motion.form>
            )}

            {/* Экран успеха с кнопкой повторного прохождения */}
            {isSubmitted && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-5"
              >
                <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">
                    Отлично! Бриф передан арт-директору
                  </h3>
                  <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
                    Мы получили ваши ответы на все 10 вопросов и выбранный подарок ({bonus}). В течение 15 минут свяжемся с вами в Telegram с готовой сметой!
                  </p>
                </div>

                {/* Кнопка "Пройти квиз заново" */}
                <div className="pt-2">
                  <button
                    onClick={handleResetQuiz}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700/80 text-xs sm:text-sm font-medium transition shadow-lg shadow-black/40"
                  >
                    <RotateCcw className="w-4 h-4 text-cyan-400" />
                    Рассчитать еще один проект (пройти заново)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}