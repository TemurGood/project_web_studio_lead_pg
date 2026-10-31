'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  User,
  Loader2,
  Square,
  Copy,
  Check,
  RotateCcw,
  Pencil,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isAborted?: boolean;
}

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Здравствуйте! Я ИИ-консультант студии. Расскажите, какой сайт или сервис вы планируете создать? Подскажу по срокам, технологиям и бюджету 🚀',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Копирование текста сообщения
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Прерывание генерации
  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⏹️ Ответ был прерван пользователем.',
          isAborted: true,
        },
      ]);
    }
  };

  // Отправка сообщения
  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    setLastUserPrompt(text);

    // Удаляем предыдущую системную плашку обрыва, если делаем повтор
    const filteredMessages = messages.filter((m) => !m.isAborted);
    const newMessages: Message[] = [...filteredMessages, { role: 'user', content: text }];
    
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Не удалось получить ответ сервера.',
          isAborted: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Исправить оборванный вопрос (вернуть в input для редактирования)
  const handleEditAborted = () => {
    setInput(lastUserPrompt);
    // Удаляем статус обрыва из истории
    setMessages((prev) => prev.filter((m) => !m.isAborted));
    inputRef.current?.focus();
  };

  // Повторить оборванный вопрос в 1 клик
  const handleRetryAborted = () => {
    if (lastUserPrompt) {
      handleSend(lastUserPrompt);
    }
  };

  const quickQuestions = [
    'Сколько стоит лендинг?',
    'Сроки разработки?',
    'Делаете ли вы интеграцию ИИ?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-[92vw] sm:w-[420px] h-[580px] bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Шапка чата */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                    ИИ-Консультант <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h3>
                  <p className="text-xs text-neutral-400">Онлайн • Gemini AI Fast</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleAbort();
                  setIsOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex gap-2.5 max-w-[85%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="w-7 h-7 rounded-full bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 text-cyan-300">
                        <Bot className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center shrink-0 mt-0.5 text-neutral-300">
                        <User className="w-4 h-4" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div
                        className={`rounded-2xl px-4 py-2.5 whitespace-pre-wrap leading-relaxed relative group ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : msg.isAborted
                            ? 'bg-neutral-800/60 border border-neutral-700/80 text-neutral-300 rounded-bl-sm'
                            : 'bg-neutral-800 text-neutral-200 border border-neutral-700/60 rounded-bl-sm'
                        }`}
                      >
                        {msg.content}

                        {/* Кнопка копирования на сообщении */}
                        {!msg.isAborted && (
                          <button
                            onClick={() => handleCopy(msg.content, i)}
                            title="Скопировать"
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 border border-neutral-700 rounded-lg p-1 text-neutral-400 hover:text-white shadow-md"
                          >
                            {copiedIndex === i ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Панель действий при обрыве или ошибке */}
                      {msg.isAborted && lastUserPrompt && (
                        <div className="flex items-center gap-2 pt-1 pl-1">
                          <button
                            onClick={handleEditAborted}
                            className="flex items-center gap-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-2.5 py-1 rounded-lg text-cyan-300 transition"
                          >
                            <Pencil className="w-3 h-3" /> Исправить вопрос
                          </button>
                          <button
                            onClick={handleRetryAborted}
                            className="flex items-center gap-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-2.5 py-1 rounded-lg text-neutral-300 transition"
                          >
                            <RotateCcw className="w-3 h-3" /> Повторить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center justify-between bg-neutral-800/60 border border-neutral-700/50 rounded-xl px-3 py-2 text-xs">
                  <span className="flex items-center gap-2 text-neutral-300">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    ИИ формулирует ответ...
                  </span>
                  <button
                    onClick={handleAbort}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium hover:underline"
                  >
                    <Square className="w-3 h-3 fill-current" /> Прервать
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Быстрые вопросы */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-full border border-neutral-700/50 transition text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Поле ввода */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isLoading) {
                  handleAbort();
                } else {
                  handleSend();
                }
              }}
              className="p-3 border-t border-neutral-800 bg-neutral-900/80 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                disabled={isLoading}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isLoading
                    ? 'ИИ отвечает... нажмите «Стоп» для отмены'
                    : 'Задайте вопрос или оставьте Telegram...'
                }
                className="flex-1 bg-neutral-800/80 border border-neutral-700/70 rounded-xl px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 disabled:opacity-60 transition"
              />

              {isLoading ? (
                <button
                  type="button"
                  onClick={handleAbort}
                  title="Остановить генерацию"
                  className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition shadow-lg shadow-red-500/20"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white flex items-center justify-center transition shadow-lg shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Круглая кнопка открытия чата */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 flex items-center justify-center relative group"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-neutral-900"></span>
        </span>
        <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
      </motion.button>
    </div>
  );
}