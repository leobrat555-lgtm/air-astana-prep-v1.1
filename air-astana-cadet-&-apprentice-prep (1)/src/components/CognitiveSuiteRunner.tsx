import React, { useState } from 'react';
import { Brain, Sparkles, Clock, CheckCircle2, Award, ArrowRight, Play } from 'lucide-react';
import { LanguageMode, ProgramTrack } from '../types';
import {
  generateAbstractQuestions,
  generateSpatialQuestions,
  generateNumericalQuestions,
  generateVerbalQuestions,
  CognitiveQuestion,
} from '../utils/cognitive-battery-engine';
import { triggerHaptic } from '../utils/sound-engine';

interface CognitiveSuiteRunnerProps {
  track: ProgramTrack;
  language: LanguageMode;
  nightMode?: boolean;
  onOpenKneeboard: () => void;
  onFinishPart: (part: number, score: number, total: number) => void;
}

export const CognitiveSuiteRunner: React.FC<CognitiveSuiteRunnerProps> = ({
  track,
  language,
  nightMode = false,
  onOpenKneeboard,
  onFinishPart,
}) => {
  const [activePart, setActivePart] = useState<1 | 2 | 3 | 4>(1);
  const [questions, setQuestions] = useState<CognitiveQuestion[]>(() => generateAbstractQuestions(8));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [partScore, setPartScore] = useState(0);
  const [partCompleted, setPartCompleted] = useState(false);

  const partsMeta = [
    {
      part: 1,
      title: language === 'ru' ? 'Part 1: Abstract Reasoning' : 'Part 1: Abstract Reasoning',
      subtitle: language === 'ru' ? '3x3 Матрицы & Серии (6 вариантов)' : '3x3 Matrices & Series (6 Options)',
      time: '60s / Q',
      generator: () => generateAbstractQuestions(8),
    },
    {
      part: 2,
      title: language === 'ru' ? 'Part 2: Spatial Reasoning' : 'Part 2: Spatial Reasoning',
      subtitle: language === 'ru' ? 'Развертки куба & 3D воксели (4 варианта)' : 'Cube Nets & 3D Voxels (4 Options)',
      time: '60s / Q',
      generator: () => generateSpatialQuestions(8),
    },
    {
      part: 3,
      title: language === 'ru' ? 'Part 3: Numerical Reasoning' : 'Part 3: Numerical Reasoning',
      subtitle: language === 'ru' ? 'Числовые ряды & прогрессии (6 вариантов)' : 'Number Series Sequences (6 Options)',
      time: '60s / Q',
      generator: () => generateNumericalQuestions(8),
    },
    {
      part: 4,
      title: language === 'ru' ? 'Part 4: Verbal Reasoning' : 'Part 4: Verbal Reasoning',
      subtitle: language === 'ru' ? 'Вербальные аналогии & силлогизмы (4 варианта)' : 'Analogies & Deductions (4 Options)',
      time: '50s / Q',
      generator: () => generateVerbalQuestions(8),
    },
  ];

  const handleStartPart = (pNum: 1 | 2 | 3 | 4) => {
    setActivePart(pNum);
    const meta = partsMeta.find((m) => m.part === pNum)!;
    setQuestions(meta.generator());
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setPartScore(0);
    setPartCompleted(false);
  };

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    triggerHaptic('select');
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswerIndex;
    if (isCorrect) {
      setPartScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setPartCompleted(true);
      triggerHaptic('success');
      onFinishPart(activePart, partScore, questions.length);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 4-Part Tab Switcher */}
      <div className="liquid-glass p-2 border border-white/95 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {partsMeta.map((pm) => (
          <button
            key={pm.part}
            onClick={() => handleStartPart(pm.part as any)}
            className={`p-2 rounded-xl text-left transition-all ${
              activePart === pm.part
                ? 'bg-blue-600 text-white shadow-xs font-bold ring-1 ring-white/40'
                : nightMode
                ? 'bg-[#0F172A]/90 hover:bg-[#1E293B] text-slate-300 border border-slate-700/80'
                : 'bg-white/90 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <div className={`font-cockpit text-[11px] uppercase tracking-wider font-bold ${
              activePart === pm.part ? 'text-white' : nightMode ? 'text-emerald-400' : 'text-slate-900'
            }`}>
              {pm.title}
            </div>
            <div className={`text-[9px] font-mono-avionics ${
              activePart === pm.part ? 'text-blue-100' : nightMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {pm.time}
            </div>
          </button>
        ))}
      </div>

      {partCompleted ? (
        <div className="liquid-glass p-6 text-center text-slate-900 border border-white/95 shadow-lg space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="font-cockpit text-lg font-bold">
            Part {activePart} Completed!
          </h3>
          <p className="text-xs text-slate-600">
            Результат: {partScore} из {questions.length} ({Math.round((partScore / questions.length) * 100)}%)
          </p>
          <div className="flex justify-center gap-2 pt-2">
            {activePart < 4 ? (
              <button
                onClick={() => handleStartPart((activePart + 1) as any)}
                className="px-5 py-2.5 rounded-xl liquid-glass-pill-active font-cockpit text-xs font-bold uppercase text-white shadow-md flex items-center gap-1.5"
              >
                <span>Перейти к Part {activePart + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleStartPart(1)}
                className="px-5 py-2.5 rounded-xl liquid-glass-pill-active font-cockpit text-xs font-bold uppercase text-white shadow-md"
              >
                Пройти батарею заново
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="liquid-glass p-5 border border-white/95 shadow-md space-y-4 text-slate-900">
          <div className="flex items-center justify-between text-xs font-mono-avionics text-slate-500 pb-2 border-b border-slate-200">
            <span className="font-bold text-blue-700 uppercase">
              Part {activePart} • Q {currentIndex + 1} / {questions.length}
            </span>
            <button
              onClick={onOpenKneeboard}
              className="px-2 py-1 rounded-lg bg-amber-500 text-white font-cockpit text-[10px] font-bold"
            >
              📝 KNEEBOARD
            </button>
          </div>

          <h3 className="font-cockpit text-sm sm:text-base font-bold text-slate-950 leading-relaxed whitespace-pre-wrap">
            {currentQ.question}
          </h3>

          {/* SVG Diagram Visual */}
          {currentQ.svgVisual && (
            <div
              className="p-3 bg-white/95 rounded-2xl border border-slate-200 shadow-2xs flex justify-center max-w-xs mx-auto"
              dangerouslySetInnerHTML={{ __html: currentQ.svgVisual }}
            />
          )}

          {/* Options Grid (4 or 6 options depending on part) */}
          <div className="space-y-2">
            {currentQ.options.map((optText, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrect = optIdx === currentQ.correctAnswerIndex;

              let btnStyle = 'bg-white/90 hover:bg-white text-slate-900 border-slate-200/90 shadow-2xs';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600 text-white border-rose-600 font-bold shadow-md';
                } else {
                  btnStyle = 'opacity-40 bg-white/60 text-slate-500 border-slate-200';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(optIdx)}
                  className={`w-full p-3 rounded-2xl border text-left font-mono-avionics text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                        isAnswered && isCorrect
                          ? 'bg-white text-emerald-900'
                          : isAnswered && isSelected
                          ? 'bg-white text-rose-900'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-medium leading-snug">{optText}</span>
                  </div>

                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Feedback */}
          {isAnswered && (
            <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs text-slate-800 space-y-2 animate-fade-in">
              <div className="font-bold text-blue-950 font-cockpit">
                {selectedOption === currentQ.correctAnswerIndex ? '✓ Верно!' : '✗ Ошибка в анализе:'}
              </div>
              <p className="leading-relaxed font-mono-avionics text-[11px]">
                {language === 'ru' ? currentQ.explanationRu : currentQ.explanationEn}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-xl liquid-glass-pill-active font-cockpit text-xs font-bold uppercase text-white shadow-xs mt-1"
              >
                {currentIndex < questions.length - 1 ? 'Следующий вопрос →' : 'Завершить Part ' + activePart}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
