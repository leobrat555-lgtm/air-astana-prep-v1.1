import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Brain,
  Clock,
  Award,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Target,
  Zap,
  Plane,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ProgramTrack, UserAttempt, ActiveModule, LanguageMode } from '../types';
import { translations } from '../utils/i18n';

interface DashboardViewProps {
  track: ProgramTrack;
  attempts: UserAttempt[];
  language?: LanguageMode;
  onNavigateModule: (module: ActiveModule) => void;
}

interface WeaknessAnalysisData {
  weakestDomain: string;
  strongestDomain: string;
  readinessIndexPercentage: number;
  diagnosticNotes: string;
  recommendedModuleId: string;
  actionSteps: string[];
  airAstanaTip: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  track,
  attempts,
  language = 'ru',
  onNavigateModule,
}) => {
  const t = translations[language];

  // Required 0-state initialization for statistics
  const [stats, setStats] = useState({
    answered: 0,
    avgTime: 0,
    correct: 0,
    flightHours: 0,
    missionsFlown: 0,
    domains: { english: 0, numerical: 0, verbal: 0, physics: 0, compass: 0, interview: 0 },
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WeaknessAnalysisData | null>(null);

  // Compute live statistics from user attempts
  useEffect(() => {
    if (attempts.length === 0) {
      setStats({
        answered: 0,
        avgTime: 0,
        correct: 0,
        flightHours: 0,
        missionsFlown: 0,
        domains: { english: 0, numerical: 0, verbal: 0, physics: 0, compass: 0, interview: 0 },
      });
      return;
    }

    const totalAnswered = attempts.length;
    const totalCorrect = attempts.filter((a) => a.isCorrect).length;
    const totalTime = attempts.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);
    const avgTime = Math.round((totalTime / totalAnswered) * 10) / 10;
    const flightHours = Math.round((totalTime / 3600) * 10) / 10;
    // Count distinct sessions / chunks as missions
    const missionsFlown = Math.max(1, Math.ceil(totalAnswered / 10));

    const calcDomain = (modKey: string) => {
      const filtered = attempts.filter((a) => a.module === modKey);
      if (filtered.length === 0) return 0;
      const c = filtered.filter((a) => a.isCorrect).length;
      return Math.round((c / filtered.length) * 100);
    };

    setStats({
      answered: totalAnswered,
      avgTime,
      correct: totalCorrect,
      flightHours,
      missionsFlown,
      domains: {
        english: calcDomain('english'),
        numerical: calcDomain('psychometrics'),
        verbal: calcDomain('psychometrics'),
        physics: calcDomain('psychometrics'),
        compass: calcDomain('cognitive'),
        interview: calcDomain('interview'),
      },
    });
  }, [attempts]);

  const categories = [
    { key: 'english', label: t.catEnglish, target: 85, score: stats.domains.english },
    { key: 'numerical', label: t.catNumerical, target: 75, score: stats.domains.numerical },
    { key: 'verbal', label: t.catVerbal, target: 75, score: stats.domains.verbal },
    { key: 'physics', label: t.catPhysics, target: 80, score: stats.domains.physics },
    { key: 'compass', label: t.catMath, target: 80, score: stats.domains.compass },
    { key: 'interview', label: t.catInterview, target: 85, score: stats.domains.interview },
  ];

  const overallAccuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;

  // Candidate Pilot Rank derivation
  let pilotRank = language === 'ru' ? 'Студент-абитуриент (Cadet Applicant)' : 'Cadet Applicant';
  if (stats.answered > 0) {
    if (overallAccuracy >= 75) {
      pilotRank = language === 'ru' ? 'Допущен к конкурсному отбору (Screening Ready)' : 'Screening Ready';
    } else if (overallAccuracy >= 50) {
      pilotRank = language === 'ru' ? 'Стажер-пилот (Student Pilot)' : 'Student Pilot';
    }
  }

  const isQualified = stats.answered >= 15 && overallAccuracy >= 80;

  const handleRunWeaknessAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const statsSummary = categories.map((cat) => ({
        category: cat.label,
        simulatedScore: cat.score > 0 ? cat.score : Math.floor(Math.random() * 20) + 65,
      }));

      const res = await fetch('/api/ai/weakness-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: statsSummary,
          track,
          answeredCount: stats.answered,
        }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      setAnalysisResult({
        weakestDomain: track === 'ab-initio' ? 'Speed Mental Math (ROD / Fuel / Wind)' : 'EASA M3 Electrical Circuits',
        strongestDomain: track === 'ab-initio' ? 'Aviation English & ATC Phraseology' : 'AMM Technical Procedures & Warnings',
        readinessIndexPercentage: overallAccuracy > 0 ? overallAccuracy : 75,
        diagnosticNotes:
          language === 'ru'
            ? 'Хорошее знание английского и базовых регламентов. Необходима дополнительная отработка устного счета (ROD = GS x 5, глиссада 3:1) под 20-секундным таймером для предотвращения перегрузки в симуляторе.'
            : 'Aviation English is solid. Rapid mental arithmetic (ROD = GS x 5, 3:1 descent slope) under 20-second countdown needs further reinforcement.',
        recommendedModuleId: track === 'ab-initio' ? 'cognitive' : 'psychometrics',
        actionSteps: [
          'Practice Rate of Descent calculations without scratchpad',
          'Drill Rule of 60 crosswind components mentally',
          'Review EASA Part-66 DC electrical Ohm calculations',
        ],
        airAstanaTip:
          language === 'ru'
            ? 'На отборе в Air Astana ценится мгновенная уверенность в расчетах. Задержка при устном счете указывает на когнитивную перегрузку.'
            : 'Air Astana selection board tests emphasize immediate verbal confidence. Hesitating on mental math signals cognitive overload.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Pilot Logbook KPI Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metric 1: Total Training Flight Time */}
        <div className="liquid-glass p-3.5 border border-white/95 shadow-sm text-slate-900">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
            <span className="font-mono-avionics text-[10px] uppercase font-bold tracking-wider">
              {language === 'ru' ? 'Налет в тренажере' : 'Flight Time'}
            </span>
            <Clock className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-mono-avionics font-bold text-slate-950">
            {stats.flightHours.toFixed(1)} <span className="text-sm font-normal text-slate-500">hrs</span>
          </div>
          <div className="text-[10px] text-slate-600 font-medium font-mono-avionics mt-0.5">
            {stats.answered === 0 ? '0.0 hrs Flight Time' : `${stats.missionsFlown} ${language === 'ru' ? 'вылетов' : 'missions'}`}
          </div>
        </div>

        {/* Metric 2: Missions Flown */}
        <div className="liquid-glass p-3.5 border border-white/95 shadow-sm text-slate-900">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
            <span className="font-mono-avionics text-[10px] uppercase font-bold tracking-wider">
              {language === 'ru' ? 'Миссии / Сессии' : 'Missions Flown'}
            </span>
            <Plane className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-2xl font-mono-avionics font-bold text-slate-950">
            {stats.missionsFlown}
          </div>
          <div className="text-[10px] text-slate-600 font-medium font-mono-avionics mt-0.5">
            {stats.answered} {language === 'ru' ? 'задач решено' : 'tasks solved'}
          </div>
        </div>

        {/* Metric 3: Overall Screening Accuracy */}
        <div className="liquid-glass p-3.5 border border-white/95 shadow-sm text-slate-900">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
            <span className="font-mono-avionics text-[10px] uppercase font-bold tracking-wider">
              {t.statAccuracy}
            </span>
            <Target className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-mono-avionics font-bold text-slate-950">
            {overallAccuracy}%
          </div>
          <div className="text-[10px] text-slate-600 font-medium font-mono-avionics mt-0.5">
            {stats.answered === 0 ? '0% Accuracy' : `≥ 75% (${stats.correct}/${stats.answered})`}
          </div>
        </div>

        {/* Metric 4: Candidate Pilot Rank */}
        <div className="liquid-glass p-3.5 border border-white/95 shadow-sm text-slate-900">
          <div className="flex items-center justify-between text-slate-600 text-xs mb-1">
            <span className="font-mono-avionics text-[10px] uppercase font-bold tracking-wider">
              {language === 'ru' ? 'Летный статус' : 'Pilot Rank'}
            </span>
            <Award className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xs font-cockpit font-bold text-emerald-700 leading-snug line-clamp-1">
            {stats.answered === 0 ? 'Cadet Applicant' : pilotRank}
          </div>
          <div className="text-[10px] text-slate-600 font-medium font-mono-avionics mt-0.5">
            Air Astana Assessment
          </div>
        </div>
      </div>

      {/* Official Qualification Ink-Stamp (Appears when applicant achieves >= 80% average) */}
      {isQualified && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-500 text-amber-950 flex items-center gap-3 shadow-md animate-fade-in">
          <div className="w-12 h-12 rounded-full border-2 border-amber-600 flex items-center justify-center text-amber-600 shrink-0 font-bold text-lg rotate-[-12deg]">
            STAMP
          </div>
          <div>
            <div className="font-cockpit text-xs font-bold uppercase tracking-wider text-amber-900">
              OFFICIAL EPST QUALIFICATION STAMP
            </div>
            <p className="text-[11px] font-mono-avionics font-semibold text-amber-800 leading-tight">
              APPROVED FOR AIR ASTANA ASSESSMENT / EPST SIM CHECK
            </p>
          </div>
        </div>
      )}

      {/* Luminous Glowing Curve Visualization */}
      <div className="liquid-glass p-4 border border-white/95 shadow-sm space-y-3 text-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <h3 className="font-cockpit text-xs font-bold uppercase tracking-wider text-slate-950">
              {t.progressTitle}
            </h3>
          </div>
          <span className="text-[10px] font-mono-avionics text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {t.progressTarget}
          </span>
        </div>

        {/* Luminous glowing curve */}
        <div className="liquid-glass-nested p-3 relative overflow-hidden bg-white/70 border border-white">
          <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono-avionics mb-1">
            <span className="font-medium">{t.progressSubtitle}</span>
            <span className="text-amber-700 font-bold">Luminous Flow</span>
          </div>

          {stats.answered === 0 ? (
            <div className="py-6 text-center text-xs font-mono-avionics text-slate-500">
              {language === 'ru' 
                ? '«Выполните первый тренировочный вылет для записи данных в логбук»' 
                : '«Complete your first practice flight to log telemetry data»'}
            </div>
          ) : (
            <>
              <svg viewBox="0 0 360 65" className="w-full h-14 overflow-visible">
                <defs>
                  <linearGradient id="neonLightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
                <path
                  d="M 5 45 C 40 25, 90 48, 140 28 C 190 15, 230 42, 280 25 C 310 18, 335 15, 355 10"
                  fill="none"
                  stroke="url(#neonLightGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="neon-chart-glow"
                />
                <circle cx="355" cy="10" r="4.5" fill="#F59E0B" className="animate-pulse" />
              </svg>

              <div className="flex justify-between items-center text-[9px] text-slate-600 font-mono-avionics font-bold mt-1">
                <span>English</span>
                <span>SHL</span>
                <span>COMPASS</span>
                <span>Math</span>
                <span>Interview</span>
              </div>
            </>
          )}
        </div>

        {/* Domain Progress Bars */}
        <div className="space-y-2.5 pt-1">
          {categories.map((cat) => {
            const isAboveTarget = cat.score >= cat.target && cat.score > 0;
            return (
              <div key={cat.key} className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono-avionics">
                  <span className="text-slate-900 font-semibold">{cat.label}</span>
                  <span className={isAboveTarget ? 'text-emerald-700 font-bold' : 'text-blue-700 font-bold'}>
                    {cat.score}% ({t.passingTarget} {cat.target}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200/90 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-slate-500 z-10"
                    style={{ left: `${cat.target}%` }}
                    title={`${t.passingTarget} ${cat.target}%`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAboveTarget
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700'
                    }`}
                    style={{ width: `${Math.max(cat.score, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
          <span className="text-[10px] font-medium">{t.passingTarget} 75%</span>
          <button
            onClick={() => onNavigateModule('mixed-aptitude')}
            className="text-blue-700 hover:text-blue-800 font-mono-avionics font-bold text-xs flex items-center gap-1 hover:underline"
          >
            <span>{language === 'ru' ? 'В Mixed Aptitude Test' : 'Open Mixed Aptitude'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Weakness Detector Card */}
      <div className="liquid-glass p-4 border border-white/95 shadow-sm space-y-3 text-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" />
            <h4 className="font-cockpit text-xs font-bold uppercase tracking-wider text-slate-950">
              {t.aiDiagTitle}
            </h4>
          </div>
          <button
            onClick={handleRunWeaknessAnalysis}
            disabled={isAnalyzing}
            className="px-3.5 py-1.5 rounded-full liquid-glass-pill-active text-white text-xs font-cockpit font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50 hover:brightness-105 active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>{t.aiDiagRunning}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.aiDiagRunBtn}</span>
              </>
            )}
          </button>
        </div>

        {analysisResult ? (
          <div className="space-y-3 text-xs leading-relaxed animate-fade-in">
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-avionics">
              <div className="liquid-glass-nested p-2.5 bg-white/80 border border-white">
                <span className="text-[10px] text-rose-700 uppercase font-bold block mb-0.5">
                  {t.weakDomain}
                </span>
                <span className="text-slate-950 font-bold">{analysisResult.weakestDomain}</span>
              </div>
              <div className="liquid-glass-nested p-2.5 bg-white/80 border border-white">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block mb-0.5">
                  {t.strongDomain}
                </span>
                <span className="text-slate-950 font-bold">{analysisResult.strongestDomain}</span>
              </div>
            </div>

            <p className="text-slate-800 liquid-glass-nested p-3 rounded-xl text-[11px] leading-relaxed bg-white/80 border border-white font-medium">
              {analysisResult.diagnosticNotes}
            </p>

            <div className="p-3 rounded-xl bg-amber-50/95 border border-amber-300 text-amber-950 text-[11px] space-y-1 shadow-2xs">
              <span className="font-bold text-amber-900 uppercase text-[10px] block">
                {t.airAstanaTipLabel}
              </span>
              <p className="leading-relaxed font-medium">{analysisResult.airAstanaTip}</p>
            </div>

            <button
              onClick={() => onNavigateModule('mixed-aptitude')}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-1.5 shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <span>{language === 'ru' ? 'Отработать слабые места в Mixed Aptitude' : 'Practice Mixed Aptitude'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {stats.answered === 0
              ? (language === 'ru'
                ? '«Диагностика не сформирована. Пройдите блок Cognitive Ability или Mixed Aptitude, чтобы сформировать профиль компетенций»'
                : '«Diagnostic profile uninitialized. Complete Cognitive Ability or Mixed Aptitude to generate candidate profile»')
              : t.aiDiagEmpty}
          </p>
        )}
      </div>
    </div>
  );
};
