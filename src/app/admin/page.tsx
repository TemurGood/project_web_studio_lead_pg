'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Search,
  CheckCircle,
  Clock,
  Archive,
  Eye,
  RefreshCw,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  contact: string;
  source: string;
  details: string | null;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState('all');

  // Авторизация
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/leads?pass=${encodeURIComponent(password)}`);
      const data = await res.json();

      if (res.ok) {
        setLeads(data.leads);
        setIsAuth(true);
        sessionStorage.setItem('admin_pass', password);
      } else {
        setError(data.error || 'Неверный пароль');
      }
    } catch {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  // Повторная загрузка лидов
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?pass=${encodeURIComponent(password)}`);
      const data = await res.json();
      if (res.ok) setLeads(data.leads);
    } finally {
      setLoading(false);
    }
  };

  // Смена статуса заявки
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, pass: password }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
      if (selectedLead?.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Восстановление сессии при обновлении страницы
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pass');
    if (saved) {
      setPassword(saved);
      fetch(`/api/admin/leads?pass=${encodeURIComponent(saved)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.leads) {
            setLeads(data.leads);
            setIsAuth(true);
          }
        });
    }
  }, []);

  // Если не авторизован — показываем окно входа
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl w-full max-w-sm space-y-6 text-center shadow-2xl"
        >
          <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Вход в Админ-панель</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Введите пароль администратора из .env.local
            </p>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 text-sm"
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-semibold text-white text-sm transition"
          >
            {loading ? 'Проверка...' : 'Войти'}
          </button>
        </form>
      </div>
    );
  }

  const filteredLeads = leads.filter((l) => (filter === 'all' ? true : l.status === filter));

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 max-w-7xl mx-auto">
      {/* Шапка админки */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold">Панель управления лидами</h1>
          <p className="text-xs text-neutral-400">База данных: Turso (Edge SQLite)</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition flex items-center gap-2 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Обновить
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem('admin_pass');
              setIsAuth(false);
            }}
            className="p-2.5 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 hover:bg-red-900/40 transition flex items-center gap-2 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Выйти
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 my-6">
        {[
          { key: 'all', label: 'Все заявки', count: leads.length },
          { key: 'new', label: 'Новые', count: leads.filter((l) => l.status === 'new').length },
          { key: 'in_progress', label: 'В работе', count: leads.filter((l) => l.status === 'in_progress').length },
          { key: 'closed', label: 'Завершенные', count: leads.filter((l) => l.status === 'closed').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 ${
              filter === tab.key
                ? 'bg-cyan-500 text-black font-semibold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {tab.label}
            <span className="opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Таблица лидов */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-800/50 text-neutral-400 text-xs uppercase border-b border-neutral-800">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Клиент</th>
                <th className="p-4">Контакт</th>
                <th className="p-4">Источник</th>
                <th className="p-4">Статус</th>
                <th className="p-4">Дата</th>
                <th className="p-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-800/40 transition">
                  <td className="p-4 font-mono text-neutral-500">#{lead.id}</td>
                  <td className="p-4 font-medium text-white">{lead.name}</td>
                  <td className="p-4">
                    <span className="text-cyan-400 font-mono">{lead.contact}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] bg-neutral-800 border border-neutral-700 text-neutral-300">
                      {lead.source === 'ai_chat'
                        ? '🤖 ИИ-чат'
                        : lead.source === 'quiz'
                        ? '🎯 Квиз'
                        : '📝 Форма'}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="bg-neutral-800 border border-neutral-700 text-xs rounded-lg px-2.5 py-1 text-white focus:outline-none"
                    >
                      <option value="new">🟡 Новая</option>
                      <option value="in_progress">🔵 В работе</option>
                      <option value="closed">🟢 Закрыта</option>
                    </select>
                  </td>
                  <td className="p-4 text-xs text-neutral-400 font-mono">
                    {lead.createdAt || 'Не указана'}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-cyan-300 flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> Детали
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500 text-sm">
                    Заявок с таким статусом пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно просмотра деталей */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Заявка #{selectedLead.id}</h3>
                <p className="text-xs text-neutral-400">{selectedLead.name}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-neutral-500 block">Контакт:</span>
                <span className="text-cyan-400 font-mono text-base">{selectedLead.contact}</span>
              </div>

              <div>
                <span className="text-xs text-neutral-500 block">Источник:</span>
                <span className="text-white capitalize">{selectedLead.source}</span>
              </div>

              <div>
                <span className="text-xs text-neutral-500 block mb-1">Детали и диалог:</span>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 max-h-60 overflow-y-auto text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed">
                  {selectedLead.details || 'Детали отсутствуют'}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-800">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}