import React, { useState } from 'react';
import { BookOpen, Sparkles, ChevronRight, FileText, Wrench, Plane, CheckCircle2, ArrowRight } from 'lucide-react';
import { AVIATION_THEORY_LIBRARY, TheoryArticle } from '../data/aviation-theory';
import { LanguageMode, ProgramTrack } from '../types';

interface AviationTheoryHubProps {
  track: ProgramTrack;
  language: LanguageMode;
  onOpenAIQuestion?: (promptText: string) => void;
}

export const AviationTheoryHub: React.FC<AviationTheoryHubProps> = ({
  track,
  language,
  onOpenAIQuestion,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<TheoryArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'flight' | 'systems' | 'fleet' | 'easa'>('all');

  const filtered = activeCategory === 'all' 
    ? AVIATION_THEORY_LIBRARY 
    : AVIATION_THEORY_LIBRARY.filter((a) => a.category === activeCategory);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Banner */}
      <div className="liquid-glass p-5 border border-white/95 shadow-md text-slate-900 space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-mono-avionics font-bold uppercase tracking-wider border border-blue-200">
            📚 Авиационная База Знаний / Theory Core
          </span>
          <span className="text-[11px] font-mono-avionics text-slate-500 font-semibold">
            {AVIATION_THEORY_LIBRARY.length} {language === 'ru' ? 'статей' : 'articles'}
          </span>
        </div>
        <h2 className="text-xl font-bold font-cockpit text-slate-950 tracking-tight">
          {language === 'ru' ? 'Теория и Регламенты Air Astana' : 'Air Astana & EASA Technical Library'}
        </h2>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {language === 'ru'
            ? 'Фундаментальные законы физики, аэродинамики, гидравлики Skydrol, силовые установки LEAP-1A и специфика флота A321LR.'
            : 'Core principles of aerodynamics, Skydrol fluid power, LEAP-1A turbofans, and Air Astana operational fleet standards.'}
        </p>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 pt-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: language === 'ru' ? 'Все разделы' : 'All Topics' },
            { id: 'flight', label: '✈️ Аэродинамика' },
            { id: 'systems', label: '🔧 Бортсистемы' },
            { id: 'fleet', label: '🇰🇿 Флот Air Astana' },
            { id: 'easa', label: '🔩 EASA Part-66' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-cockpit font-bold uppercase tracking-wider shrink-0 transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-3">
        {filtered.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="liquid-glass p-4 border border-white/95 shadow-xs hover:shadow-md cursor-pointer transition-all active:scale-[0.99] group text-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-avionics text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {art.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-avionics">
                    • {art.readingTime}
                  </span>
                </div>
                <h3 className="font-cockpit text-sm sm:text-base font-bold text-slate-950 group-hover:text-blue-700 transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors shrink-0 mt-1">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg liquid-glass p-6 text-slate-900 relative shadow-2xl max-h-[88vh] overflow-y-auto space-y-4 border border-white/95">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 gap-3">
              <div>
                <span className="text-[10px] font-mono-avionics text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {selectedArticle.badge}
                </span>
                <h2 className="text-base sm:text-lg font-bold font-cockpit text-slate-950 mt-1 leading-snug">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Summary */}
            <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs text-blue-950 font-medium leading-relaxed">
              {selectedArticle.summary}
            </div>

            {/* Mathematical Formulas */}
            {selectedArticle.formulas && selectedArticle.formulas.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono-avionics text-[10px] uppercase font-bold text-slate-600 block">
                  {language === 'ru' ? 'Ключевые формулы и расчетные правила:' : 'Core Formulas & Calculation Rules:'}
                </span>
                <div className="space-y-2">
                  {selectedArticle.formulas.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/95 border border-amber-300 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 font-mono-avionics">
                        <span>{f.label}</span>
                      </div>
                      <div className="text-xs sm:text-sm font-mono-avionics font-bold text-amber-950 bg-white/80 p-2 rounded-lg border border-amber-200">
                        {f.formula}
                      </div>
                      <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                        {f.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bullet Points */}
            <div className="space-y-2">
              <span className="font-mono-avionics text-[10px] uppercase font-bold text-slate-600 block">
                {language === 'ru' ? 'Технические тезисы для отбора:' : 'Screening Principles:'}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-800">
                {selectedArticle.bulletPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Air Astana Context */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-mono-avionics text-[10px] uppercase font-bold text-blue-700 block">
                🇰🇿 Стандарт Air Astana:
              </span>
              <p className="leading-relaxed font-medium">
                {selectedArticle.airAstanaContext}
              </p>
            </div>

            {/* Action with AI */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onOpenAIQuestion) {
                    onOpenAIQuestion(`Разбери подробно тему «${selectedArticle.title}» в контексте экзамена Air Astana`);
                  }
                  setSelectedArticle(null);
                }}
                className="w-full min-h-[46px] py-2.5 px-4 rounded-xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {language === 'ru'
                    ? 'Разложить по полочкам с ИИ-Инструктором ➔'
                    : 'Analyze with AI Flight Instructor ➔'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
