import React, { useState } from 'react';
import { Send, Bot, Sparkles, User, HelpCircle, ArrowRight, ShieldCheck, BookOpen, Clock } from 'lucide-react';
import { ProgramTrack, LanguageMode } from '../types';
import { soundEngine } from '../utils/sound-engine';

interface DedicatedInstructorViewProps {
  track: ProgramTrack;
  language: LanguageMode;
  userApiKey: string;
  userName: string;
  onOpenSettings: () => void;
  presetPrompt?: string;
  nightMode?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const DedicatedInstructorView: React.FC<DedicatedInstructorViewProps> = ({
  track,
  language,
  userApiKey,
  userName,
  onOpenSettings,
  presetPrompt,
  nightMode = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: language === 'ru'
        ? `Приветствую, ${userName || 'кандидат'}. Я ведущий экзаменатор и летный инструктор комиссии Air Astana & EPST.\n\nЗадайте любой вопрос по этапам отбора: Rooftop Projection, линейное позиционирование, силлогизмы, симулятор Boeing 737 или регламенты EASA Part-66.`
        : `Welcome, ${userName || 'Candidate'}. I am your Senior Flight & Technical Assessor for the Air Astana & EPST selection board.\n\nAsk me anything regarding Rooftop Projection, Linear Positioning, Syllogisms, Boeing 737 simulator checks, or EASA Part-66 systems.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState(presetPrompt || '');
  const [isLoading, setIsLoading] = useState(false);

  const quickChips = [
    {
      label: '🏠 Rooftop Projection',
      prompt: 'Разбери алгоритм решения задач с проекцией крыши (Rooftop Projection) и частые ловушки',
    },
    {
      label: '🚗 Linear Positioning',
      prompt: 'Как решать позиционные задачи с автомобилями и самолетами (Linear Positioning)?',
    },
    {
      label: '⚖️ Силлогизмы (T/F/CS)',
      prompt: 'Объясни метод транзитивных силлогизмов (True / False / Insufficient Information)',
    },
    {
      label: '✈️ Boeing 737 Sim Check',
      prompt: 'Как подготовиться к скринингу на симуляторе Boeing 737 (Day 2 EPST assessment)?',
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': userApiKey || '',
        },
        body: JSON.stringify({
          questionText: query,
          options: ['Direct Analysis'],
          track,
          category: 'EPST / Air Astana Selection Advisory',
          language,
        }),
      });

      const data = await res.json();
      const replyText = data.hint || (language === 'ru' 
        ? 'Ответ подготовлен по официальным регламентам Air Astana & EPST. Обратите внимание на дисциплину расчета и технику сканирования приборов.' 
        : 'Assessment note prepared based on official Air Astana & EPST guidelines.');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: language === 'ru'
          ? 'Для задач Rooftop Projection: всегда сначала находите главный конек крыши, затем проверяйте сторону бокового крыла (L или R). Для Boeing 737: удерживайте базовый T-скан (Speed -> Attitude -> Altitude).'
          : 'For Rooftop Projection: identify the main ridge line first, then determine the lateral wing side. For Boeing 737: maintain the basic T-scan instrument pattern.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in flex flex-col h-[78vh] max-h-[720px]">
      {/* Header Bar */}
      <div className="liquid-glass p-3.5 border border-white/95 shadow-sm text-slate-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="font-cockpit text-sm font-bold text-slate-950 flex items-center gap-1.5">
              <span>ИИ-Инструктор Air Astana & EPST</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-[10px] font-mono-avionics text-slate-500">
              Chief Flight Assessor • Socratic Guidance Mode
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className={`text-[10px] font-mono-avionics font-bold px-2.5 py-1 rounded-full border transition-colors ${
            nightMode
              ? 'bg-[#0B132B] text-emerald-400 border-emerald-700/80 hover:bg-[#1C2541]'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          }`}
        >
          {userApiKey ? '🟢 Ключ подключен' : '⚪ Настроить ключ'}
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 px-0.5">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.prompt)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono-avionics font-semibold shrink-0 active:scale-95 transition-all text-left border shadow-2xs ${
              nightMode
                ? 'bg-[#0F172A]/90 hover:bg-[#1E293B] text-slate-200 border-slate-700/80'
                : 'bg-white/90 hover:bg-white text-slate-800 border-slate-200/90'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 liquid-glass border border-white/95 rounded-2xl shadow-inner text-slate-900 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-blue-600 text-amber-300 flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                ✈️
              </div>
            )}

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-tr-xs shadow-xs'
                  : 'bg-white/95 text-slate-900 border border-slate-200/90 rounded-tl-xs shadow-2xs font-medium'
              }`}
            >
              <div className="text-[11px] leading-relaxed">{m.text}</div>
              <div
                className={`text-[9px] mt-1 text-right font-mono-avionics ${
                  m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-blue-700 font-mono-avionics p-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
            <span>Инструктор формирует разбор полета...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="relative shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={language === 'ru' ? 'Спросить инструктора о тесте или формуле...' : 'Ask instructor about tests or formulas...'}
          className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white/95 border border-slate-300 text-xs font-semibold text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs disabled:opacity-40 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
