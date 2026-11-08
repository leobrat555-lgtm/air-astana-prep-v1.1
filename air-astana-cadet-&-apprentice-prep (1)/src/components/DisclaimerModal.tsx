import React from 'react';
import { AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { LanguageMode } from '../types';

interface DisclaimerModalProps {
  isOpen: boolean;
  language: LanguageMode;
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, language, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md liquid-glass p-6 sm:p-7 relative overflow-hidden text-slate-900 shadow-2xl border border-white/95 space-y-4">
        {/* Warning Badge */}
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
          </div>
          <div>
            <h3 className="font-cockpit text-sm sm:text-base font-bold text-slate-950 leading-tight">
              ⚠️ Официальное уведомление / Legal Disclaimer
            </h3>
            <span className="text-[10px] font-mono-avionics text-slate-500 font-semibold">
              Independent Educational Preparation Suite
            </span>
          </div>
        </div>

        {/* Bilingual Legal Content */}
        <div className="space-y-3 text-xs leading-relaxed max-h-[50vh] overflow-y-auto pr-1">
          {/* RU Notice */}
          <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 text-slate-800 space-y-1.5 shadow-2xs">
            <div className="font-bold text-slate-950 text-[11px] flex items-center gap-1.5">
              <span>🇷🇺</span> Русский:
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Данный тренажер является <strong>независимым образовательным проектом</strong> для самостоятельной подготовки кандидатов к тестам Cognitive Ability, Mixed Aptitude, CPQ и симуляторному скринингу EPST.
            </p>
            <p className="text-[11px] text-slate-700 leading-relaxed font-semibold text-rose-800">
              Приложение <strong>НЕ является официальным сервисом АО «Эйр Астана»</strong> и компании EPST. Разработчики не являются аффилированными лицами авиакомпании и не несут ответственности за результаты официального отбора.
            </p>
          </div>

          {/* EN Notice */}
          <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 text-slate-800 space-y-1.5 shadow-2xs">
            <div className="font-bold text-slate-950 text-[11px] flex items-center gap-1.5">
              <span>🇬🇧</span> English:
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              This interactive training tool is an <strong>independent educational resource</strong> designed solely for candidate self-study and preparation for Cognitive Ability, Mixed Aptitude, CPQ, and EPST assessments.
            </p>
            <p className="text-[11px] text-slate-700 leading-relaxed font-semibold text-rose-800">
              This application is <strong>NOT an official service of JSC Air Astana or EPST</strong>. The creators are not affiliated with the airline and assume no liability for the outcome of official company screening.
            </p>
          </div>
        </div>

        {/* Consent Action */}
        <div className="pt-2">
          <button
            onClick={onAccept}
            className="w-full min-h-[48px] py-3 px-4 rounded-2xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>
              {language === 'ru' 
                ? 'Я ознакомлен и согласен / I Agree' 
                : 'I Understand & Agree'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
