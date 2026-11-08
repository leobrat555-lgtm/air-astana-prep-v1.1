/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ProgramTrack, ActiveModule, LanguageMode, Question, UserAttempt } from './types';
import { QUESTIONS_BANK } from './data/questions';
import { generateProceduralBatch } from './utils/procedural-questions';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { AviationDiscoveryHub } from './components/AviationDiscoveryHub';
import { SelectionStagesRoadmap } from './components/SelectionStagesRoadmap';
import { DashboardView } from './components/DashboardView';
import { AssessmentRunner } from './components/AssessmentRunner';
import { FinalStageView } from './components/FinalStageView';
import { AIInstructorDrawer } from './components/AIInstructorDrawer';
import { InteractiveExaminer } from './components/InteractiveExaminer';
import { MixedAptitudeRunner } from './components/MixedAptitudeRunner';
import { CognitiveSuiteRunner } from './components/CognitiveSuiteRunner';
import { AviationTheoryHub } from './components/AviationTheoryHub';
import { DedicatedInstructorView } from './components/DedicatedInstructorView';
import { KneeboardModal } from './components/KneeboardModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { Edit3 } from 'lucide-react';

export default function App() {
  const [track, setTrack] = useState<ProgramTrack>('ab-initio');
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [language, setLanguage] = useState<LanguageMode>('ru');
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  // Cockpit UX States
  const [nightMode, setNightMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('night_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [isKneeboardOpen, setIsKneeboardOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('disclaimer_accepted') !== 'true';
    } catch {
      return true;
    }
  });

  // User Profile & Key state from localStorage
  const [userName, setUserName] = useState<string>('');
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Context passing for AI Assistant
  const [aiContextQuestion, setAiContextQuestion] = useState<Question | null>(null);
  const [aiContextSelectedOption, setAiContextSelectedOption] = useState<number | null>(null);
  const [instructorPresetPrompt, setInstructorPresetPrompt] = useState<string>('');

  // Seed with rich static bank + procedural batch (giving 500+ procedural variations on demand)
  const [proceduralSeed, setProceduralSeed] = useState(0);
  const questions = useMemo(() => {
    const proceduralQuestions = generateProceduralBatch(30, track);
    return [...QUESTIONS_BANK, ...proceduralQuestions];
  }, [track, proceduralSeed]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedName = localStorage.getItem('userName');
      const storedTrack = localStorage.getItem('userTrack') as ProgramTrack | null;
      const storedKey = localStorage.getItem('gemini_api_key') || '';
      const storedAttempts = localStorage.getItem('air_astana_attempts');

      if (storedName) {
        setUserName(storedName);
      } else {
        setIsOnboardingOpen(true);
      }

      if (storedTrack && (storedTrack === 'ab-initio' || storedTrack === 'apprentice')) {
        setTrack(storedTrack);
      }

      if (storedKey) {
        setUserApiKey(storedKey);
      }

      if (storedAttempts) {
        setAttempts(JSON.parse(storedAttempts));
      }
    } catch (e) {
      console.warn('LocalStorage access warning:', e);
    }
  }, []);

  const handleToggleNightMode = () => {
    setNightMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('night_mode', String(next));
      } catch (e) {}
      return next;
    });
  };

  const handleAcceptDisclaimer = () => {
    setIsDisclaimerOpen(false);
    try {
      localStorage.setItem('disclaimer_accepted', 'true');
    } catch (e) {}
  };

  const handleCompleteOnboarding = (name: string, selectedTrack: ProgramTrack, apiKey?: string) => {
    setUserName(name);
    setTrack(selectedTrack);
    setIsOnboardingOpen(false);

    try {
      localStorage.setItem('userName', name);
      localStorage.setItem('userTrack', selectedTrack);
      if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
        setUserApiKey(apiKey);
      } else {
        localStorage.removeItem('gemini_api_key');
        setUserApiKey('');
      }
    } catch (e) {
      // ignore
    }
  };

  const handleSaveProfile = (name: string, selectedTrack: ProgramTrack, apiKey?: string) => {
    setUserName(name);
    setTrack(selectedTrack);
    try {
      localStorage.setItem('userName', name);
      localStorage.setItem('userTrack', selectedTrack);
      if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
        setUserApiKey(apiKey);
      } else {
        localStorage.removeItem('gemini_api_key');
        setUserApiKey('');
      }
    } catch (e) {
      // ignore
    }
  };

  const handleRecordAttempt = (attempt: UserAttempt) => {
    setAttempts((prev) => {
      const updated = [attempt, ...prev];
      try {
        localStorage.setItem('air_astana_attempts', JSON.stringify(updated.slice(0, 100)));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const handleOpenAIHint = (q: Question, selectedIndex: number | null) => {
    setAiContextQuestion(q);
    setAiContextSelectedOption(selectedIndex);
    setIsAIDrawerOpen(true);
  };

  const handleOpenAIDebrief = (q: Question, selectedIndex: number | null) => {
    setAiContextQuestion(q);
    setAiContextSelectedOption(selectedIndex);
    setIsAIDrawerOpen(true);
  };

  const handleInjectNewQuestion = () => {
    // Triggers procedural refresh as well
    setProceduralSeed((s) => s + 1);
  };

  // Compute stats
  const totalAnswered = attempts.length;
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  // Streak
  let streak = 0;
  for (const att of attempts) {
    if (att.isCorrect) streak += 1;
    else break;
  }

  const hasApiKey = Boolean(userApiKey && userApiKey.trim().length > 10);

  // Dynamic aerial background image selection with crossfade
  const getContextBgImage = () => {
    if (nightMode) {
      return '';
    }
    if (isOnboardingOpen || !userName) {
      return '/public/assets/aistudio/_____________776de08a.jpg';
    }
    if (track === 'ab-initio') {
      return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1080&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1080&auto=format&fit=crop';
  };

  return (
    <div className={`relative min-h-screen font-sans selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden transition-colors duration-300 ${
      nightMode ? 'night-flight text-slate-100 bg-[#070C18]' : 'text-slate-800'
    }`}>
      {/* Light Sky & Soft Radial Clouds Layer */}
      <div className="liquid-sky-bg">
        <div className="cloud-radial-1" />
        <div className="cloud-radial-2" />
        <div className="cloud-radial-3" />
      </div>

      {/* Contextual High-Resolution Photographic Crossfade Layer (hidden in nightMode for crisp contrast) */}
      {!nightMode && (
        <div
          className="context-photo-layer"
          style={{
            backgroundImage: `url(${getContextBgImage()})`,
          }}
        />
      )}

      {/* Mobile-First Central Layout Container */}
      <div className="relative z-10 max-w-md mx-auto min-h-screen px-4 pb-32 pt-2 flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Header with CockpitWeatherHud, gear settings icon, and AI status */}
          <Header
            track={track}
            onTrackChange={(newTrack) => {
              setTrack(newTrack);
              try {
                localStorage.setItem('userTrack', newTrack);
              } catch (e) {}
            }}
            language={language}
            onLanguageChange={(newLang) => setLanguage(newLang)}
            onToggleAIDrawer={() => setIsAIDrawerOpen(!isAIDrawerOpen)}
            isAIDrawerOpen={isAIDrawerOpen}
            accuracy={accuracy}
            streak={streak}
            userName={userName}
            hasApiKey={hasApiKey}
            onOpenSettings={() => setIsSettingsOpen(true)}
            nightMode={nightMode}
            onToggleNightMode={handleToggleNightMode}
          />

          {/* Quick Floating Kneeboard Scratchpad Trigger Pill */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsKneeboardOpen(true)}
              className={`px-3 py-1 rounded-full text-xs font-mono-avionics font-bold flex items-center gap-1.5 shadow-sm border transition-all active:scale-95 ${
                nightMode
                  ? 'bg-[#0B132B]/90 text-emerald-400 border-emerald-800 hover:bg-[#1C2541]'
                  : 'bg-white/90 text-blue-700 border-blue-200 hover:bg-white'
              }`}
              title="Открыть наколенный планшет пилота (Pilot Kneeboard Scratchpad)"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === 'ru' ? 'Планшет (Kneeboard)' : 'Pilot Kneeboard'}</span>
            </button>
          </div>

          {/* Fact of the Day & Express Theory Hub (Displayed on Dashboard & Stages) */}
          {(activeModule === 'dashboard' || activeModule === 'stages') && (
            <AviationDiscoveryHub
              track={track}
              onOpenAITheory={(fact) => {
                setAiContextQuestion({
                  id: fact.id,
                  track: fact.track,
                  module: 'cognitive',
                  category: fact.badgeCategory,
                  difficulty: 'Medium',
                  question: fact.blitzQuestion.question,
                  options: fact.blitzQuestion.options,
                  correctAnswerIndex: fact.blitzQuestion.correctIndex,
                  explanationEn: fact.deepTheory,
                  explanationRu: fact.snippet,
                  formulaShortcut: fact.formulaOrRule,
                });
                setIsAIDrawerOpen(true);
              }}
            />
          )}

          {/* Main Module Content */}
          <main className="space-y-4">
            {activeModule === 'dashboard' && (
              <DashboardView
                track={track}
                attempts={attempts}
                onNavigateModule={(mod) => setActiveModule(mod)}
              />
            )}

            {/* Official Mixed Aptitude Test (15 Qs / 12 Min) */}
            {activeModule === 'mixed-aptitude' && (
              <MixedAptitudeRunner
                track={track}
                language={language}
                nightMode={nightMode}
                onOpenKneeboard={() => setIsKneeboardOpen(true)}
                onExit={() => setActiveModule('dashboard')}
                onFinishTest={(score, total, timeSpentSec) => {
                  handleRecordAttempt({
                    questionId: `mixed-apt-${Date.now()}`,
                    category: 'Mixed Aptitude Test',
                    module: 'cognitive',
                    track,
                    selectedOptionIndex: score >= 11 ? 0 : 1,
                    correctAnswerIndex: 0,
                    isCorrect: score >= 11, // 75%+ passing score
                    timestamp: Date.now(),
                    timeSpentSeconds: timeSpentSec,
                  });
                }}
              />
            )}

            {/* Official 4-Part Adaptive Cognitive Suite */}
            {activeModule === 'cognitive-suite' && (
              <CognitiveSuiteRunner
                track={track}
                language={language}
                nightMode={nightMode}
                onOpenKneeboard={() => setIsKneeboardOpen(true)}
                onFinishPart={(part, score, total) => {
                  handleRecordAttempt({
                    questionId: `cog-part-${part}-${Date.now()}`,
                    category: `Cognitive Part ${part}`,
                    module: 'cognitive',
                    track,
                    selectedOptionIndex: score >= Math.ceil(total * 0.75) ? 0 : 1,
                    correctAnswerIndex: 0,
                    isCorrect: score >= Math.ceil(total * 0.75),
                    timestamp: Date.now(),
                    timeSpentSeconds: 60 * total,
                  });
                }}
              />
            )}

            {/* Encyclopedic Aviation Theory Hub */}
            {activeModule === 'theory-hub' && (
              <AviationTheoryHub
                track={track}
                language={language}
                onOpenAIQuestion={(promptText) => {
                  setInstructorPresetPrompt(promptText);
                  setActiveModule('dedicated-instructor');
                }}
              />
            )}

            {/* Dedicated AI Flight & Tech Instructor Chat */}
            {activeModule === 'dedicated-instructor' && (
              <DedicatedInstructorView
                track={track}
                language={language}
                userApiKey={userApiKey}
                userName={userName}
                onOpenSettings={() => setIsSettingsOpen(true)}
                presetPrompt={instructorPresetPrompt}
                nightMode={nightMode}
              />
            )}

            {activeModule === 'stages' && (
              <SelectionStagesRoadmap
                track={track}
                onNavigateModule={(mod) => setActiveModule(mod)}
              />
            )}

            {activeModule === 'examiner' && (
              <InteractiveExaminer
                track={track}
                onTrackChange={(newTrack) => {
                  setTrack(newTrack);
                  try {
                    localStorage.setItem('userTrack', newTrack);
                  } catch (e) {}
                }}
              />
            )}

            {(activeModule === 'english' || activeModule === 'psychometrics' || activeModule === 'cognitive') && (
              <AssessmentRunner
                questions={questions}
                track={track}
                activeModule={activeModule}
                language={language}
                onLanguageToggle={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                onOpenAIHint={handleOpenAIHint}
                onOpenAIDebrief={handleOpenAIDebrief}
                onRecordAttempt={handleRecordAttempt}
              />
            )}

            {activeModule === 'interview' && (
              <FinalStageView track={track} />
            )}
          </main>
        </div>

        {/* Minimalist Safe Footer */}
        <footer className="text-[10px] font-mono-avionics text-slate-500 text-center py-4 space-y-1">
          <div>Air Astana Selection Suite • Live Cockpit HUD</div>
          <div className="text-blue-700 font-semibold">
            {hasApiKey ? '🟢 ИИ-инструктор подключен' : '⚪ Офлайн-движок (1,000+ задач)'}
          </div>
        </footer>
      </div>

      {/* Floating Bottom Navigation Capsule Dock */}
      <BottomNav
        activeModule={activeModule}
        onModuleChange={(mod) => setActiveModule(mod)}
        language={language}
        nightMode={nightMode}
      />

      {/* 2-Step Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        currentName={userName}
        currentTrack={track}
        onComplete={handleCompleteOnboarding}
      />

      {/* Settings Modal (Gear Icon Trigger) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentName={userName}
        currentTrack={track}
        currentApiKey={userApiKey}
        onSaveProfile={handleSaveProfile}
      />

      {/* Pilot Kneeboard HTML5 Canvas Drawing Scratchpad */}
      <KneeboardModal
        isOpen={isKneeboardOpen}
        onClose={() => setIsKneeboardOpen(false)}
        nightMode={nightMode}
      />

      {/* First-Time Disclaimer Modal (Legal & Independent Status) */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        language={language}
        onAccept={handleAcceptDisclaimer}
      />

      {/* Embedded Persistent AI Flight & Tech Instructor Panel */}
      <AIInstructorDrawer
        isOpen={isAIDrawerOpen}
        onToggle={() => setIsAIDrawerOpen(!isAIDrawerOpen)}
        track={track}
        activeModule={activeModule}
        currentQuestion={aiContextQuestion}
        selectedOptionIndex={aiContextSelectedOption}
        onInjectNewQuestion={handleInjectNewQuestion}
        language={language}
        onLanguageChange={(newLang) => setLanguage(newLang)}
      />
    </div>
  );
}
