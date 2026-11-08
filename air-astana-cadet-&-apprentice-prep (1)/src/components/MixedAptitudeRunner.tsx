import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Maximize2, X, Sparkles, AlertTriangle } from 'lucide-react';
import { generateOfficialMixedAptitudeBatch, MixedAptitudeQuestion } from '../utils/mixed-aptitude-engine';
import { LanguageMode, ProgramTrack } from '../types';
import { triggerHaptic } from '../utils/sound-engine';

interface MixedAptitudeRunnerProps {
  track: ProgramTrack;
  language: LanguageMode;
  nightMode?: boolean;
  onOpenKneeboard: () => void;
  onFinishTest: (score: number, total: number, timeSpentSec: number) => void;
  onExit: () => void;
}

export const MixedAptitudeRunner: React.FC<MixedAptitudeRunnerProps> = ({
  track,
  language,
  nightMode = false,
  onOpenKneeboard,
  onFinishTest,
  onExit,
}) => {
  const [questions, setQuestions] = useState<MixedAptitudeQuestion[]>(() => generateOfficialMixedAptitudeBatch());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(12 * 60); // 12:00 countdown
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enlargedSvg, setEnlargedSvg] = useState<string | null>(null);

  // 12-Minute Global Countdown Timer
  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        if (prev === 15) {
          triggerHaptic('warning');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const activeQ = questions[currentIndex];

  const handleSelect = (optionIdx: number) => {
    if (isSubmitted) return;
    triggerHaptic('select');
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    triggerHaptic('success');
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) correct++;
    });
    const timeSpent = 12 * 60 - timeLeft;
    onFinishTest(correct, questions.length, timeSpent);
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Test Header HUD */}
      <div className="liquid-glass p-3.5 border border-white/95 shadow-md flex items-center justify-between flex-wrap gap-2 text-slate-900">
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cockpit text-xs font-bold uppercase tracking-wider text-blue-700">
                Official Mixed Aptitude Test
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-mono-avionics font-bold">
                15 Qs
              </span>
            </div>
            <p className="text-[10px] font-mono-avionics text-slate-500">
              Answered: {answeredCount} / {questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Kneeboard Scratchpad Trigger */}
          <button
            onClick={onOpenKneeboard}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-cockpit text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
          >
            <span>📝 KNEEBOARD</span>
          </button>

          {/* 12:00 Countdown */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono-avionics text-xs font-bold border ${
              timeLeft <= 60
                ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                : 'bg-white/90 text-blue-800 border-slate-200 shadow-xs'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
              {String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Question Navigation Palette (1 to 15) */}
      <div className="liquid-glass p-2.5 border border-white/95 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnsweredItem = userAnswers[idx] !== undefined;

          let btnClass = 'bg-white/80 text-slate-700 border-slate-200';
          if (isCurrent) {
            btnClass = 'bg-blue-600 text-white font-bold ring-2 ring-blue-400 shadow-xs';
          } else if (isAnsweredItem) {
            btnClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
          }

          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-xl font-mono-avionics text-xs font-semibold shrink-0 border transition-all ${btnClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Body Card */}
      <div className="liquid-glass p-5 border border-white/95 shadow-md space-y-4 text-slate-900">
        <div className="flex items-center justify-between text-xs font-mono-avionics text-slate-500 pb-2 border-b border-slate-200">
          <span className="font-bold text-blue-700 uppercase">
            Question {currentIndex + 1} of {questions.length} • {activeQ.category}
          </span>
          <span>{userAnswers[currentIndex] !== undefined ? '✓ Saved' : 'Pending'}</span>
        </div>

        {/* Question Prompt */}
        <h3 className="font-cockpit text-sm sm:text-base font-bold text-slate-950 leading-relaxed whitespace-pre-wrap">
          {activeQ.question}
        </h3>

        {/* SVG Diagram / Visual Illustration */}
        {activeQ.svgIllustration && (
          <div className="p-3 bg-white/90 rounded-2xl border border-slate-200 shadow-2xs relative group">
            <div
              className="w-full flex justify-center cursor-pointer"
              onClick={() => setEnlargedSvg(activeQ.svgIllustration || null)}
              dangerouslySetInnerHTML={{ __html: activeQ.svgIllustration }}
            />
            <button
              onClick={() => setEnlargedSvg(activeQ.svgIllustration || null)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 shadow-xs text-[10px] font-mono-avionics flex items-center gap-1 opacity-80 group-hover:opacity-100"
            >
              <Maximize2 className="w-3 h-3" /> Увеличить
            </button>
          </div>
        )}

        {/* Option Selection Grid */}
        <div className="space-y-2.5">
          {activeQ.options.map((optText, optIdx) => {
            const isSelected = userAnswers[currentIndex] === optIdx;
            const optSvg = activeQ.optionsSvg ? activeQ.optionsSvg[optIdx] : null;

            return (
              <button
                key={optIdx}
                disabled={isSubmitted}
                onClick={() => handleSelect(optIdx)}
                className={`w-full p-3.5 rounded-2xl border text-left font-mono-avionics transition-all flex items-center justify-between group active:scale-[0.99] ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md ring-2 ring-blue-400/40'
                    : 'bg-white/90 hover:bg-white text-slate-900 border-slate-200/90 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                      isSelected ? 'bg-white text-blue-900' : 'bg-slate-900 text-white'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>

                  {optSvg ? (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 bg-white rounded-lg p-1 border shrink-0"
                        dangerouslySetInnerHTML={{ __html: optSvg }}
                      />
                      <span className="text-xs sm:text-sm font-semibold leading-snug">{optText}</span>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold leading-snug">{optText}</span>
                  )}
                </div>

                {isSelected && <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Bottom Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cockpit text-xs font-bold disabled:opacity-30"
          >
            ← Предыдущий
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
              className="px-5 py-2.5 rounded-xl liquid-glass-pill-active font-cockpit text-xs font-bold uppercase tracking-wider text-white shadow-xs"
            >
              Следующий →
            </button>
          ) : (
            <button
              onClick={handleSubmitTest}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-cockpit text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Завершить тест
            </button>
          )}
        </div>
      </div>

      {/* Image Zoom Modal */}
      {enlargedSvg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md liquid-glass p-6 text-slate-900 relative shadow-2xl border border-white/95 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-cockpit text-xs font-bold uppercase text-blue-700">
                Чертеж / Orthographic Projection View
              </span>
              <button
                onClick={() => setEnlargedSvg(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className="w-full max-h-[60vh] flex justify-center p-4 bg-white rounded-2xl"
              dangerouslySetInnerHTML={{ __html: enlargedSvg }}
            />
            <button
              onClick={() => setEnlargedSvg(null)}
              className="w-full py-2 bg-blue-600 text-white font-cockpit font-bold text-xs uppercase rounded-xl"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
