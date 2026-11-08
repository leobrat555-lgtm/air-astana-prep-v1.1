import React from 'react';
import {
  Home,
  CheckSquare,
  Zap,
  BookOpen,
  Bot,
  Layers,
  Award,
} from 'lucide-react';
import { ActiveModule, LanguageMode } from '../types';

interface BottomNavProps {
  activeModule: ActiveModule;
  onModuleChange: (mod: ActiveModule) => void;
  language?: LanguageMode;
  nightMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onModuleChange,
  language = 'ru',
  nightMode = false,
}) => {
  return (
    <div className="fixed bottom-4 inset-x-3 max-w-md mx-auto z-40">
      <nav className={`liquid-glass-dock px-2 py-1.5 flex items-center justify-around shadow-2xl border transition-colors ${
        nightMode 
          ? 'bg-[#0B132B]/95 border-emerald-900/60 shadow-black' 
          : 'bg-white/95 border-white/95 shadow-slate-900/10'
      }`}>
        {/* Tab 1: Dashboard / Home */}
        <button
          onClick={() => onModuleChange('dashboard')}
          className={`flex-1 min-h-[46px] py-1 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeModule === 'dashboard'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Главная / Логбук"
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-cockpit font-bold uppercase tracking-tight">
            {language === 'ru' ? 'Логбук' : 'Logbook'}
          </span>
        </button>

        {/* Tab 2: Mixed Aptitude (15 Qs / 12 Min) */}
        <button
          onClick={() => onModuleChange('mixed-aptitude')}
          className={`flex-1 min-h-[46px] py-1 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeModule === 'mixed-aptitude'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Mixed Aptitude Test"
        >
          <Layers className="w-4 h-4 text-sky-500" />
          <span className="text-[9px] font-cockpit font-bold uppercase tracking-tight">
            Mixed Apt
          </span>
        </button>

        {/* Tab 3: Cognitive 4-Part Battery */}
        <button
          onClick={() => onModuleChange('cognitive-suite')}
          className={`flex-1 min-h-[46px] py-1 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeModule === 'cognitive-suite'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Cognitive Ability Battery"
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-[9px] font-cockpit font-bold uppercase tracking-tight">
            Cognitive
          </span>
        </button>

        {/* Tab 4: Encyclopedic Theory Library */}
        <button
          onClick={() => onModuleChange('theory-hub')}
          className={`flex-1 min-h-[46px] py-1 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeModule === 'theory-hub'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="База Знаний / Теория"
        >
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span className="text-[9px] font-cockpit font-bold uppercase tracking-tight">
            {language === 'ru' ? 'Теория' : 'Theory'}
          </span>
        </button>

        {/* Tab 5: Dedicated AI Instructor */}
        <button
          onClick={() => onModuleChange('dedicated-instructor')}
          className={`flex-1 min-h-[46px] py-1 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeModule === 'dedicated-instructor'
              ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-xs font-bold'
              : 'text-amber-700 hover:text-amber-900'
          }`}
          title="ИИ-Инструктор"
        >
          <Bot className="w-4 h-4" />
          <span className="text-[9px] font-cockpit font-bold uppercase tracking-tight">
            {language === 'ru' ? 'Инструктор' : 'Assessor'}
          </span>
        </button>

        {/* Tab 6: Stages Roadmap & Sim Check */}
        <button
          onClick={() => onModuleChange('stages')}
          className={`flex-1 min-h-[46px] py-1 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
            activeModule === 'stages'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Этапы отбора и EPST"
        >
          <CheckSquare className="w-4 h-4" />
          <span className="text-[9px] font-cockpit font-bold uppercase tracking-tight">
            {language === 'ru' ? 'Этапы' : 'Stages'}
          </span>
        </button>
      </nav>
    </div>
  );
};
