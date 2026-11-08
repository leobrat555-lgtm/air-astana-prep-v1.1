import React, { useState, useEffect } from 'react';
import {
  Plane,
  Wrench,
  Bot,
  Settings,
  Languages,
  User,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Radio,
  Moon,
  Sun,
} from 'lucide-react';
import { ProgramTrack, LanguageMode } from '../types';
import { CockpitWeatherHud } from './CockpitWeatherHud';
import { translations, getGreeting } from '../utils/i18n';
import { soundEngine } from '../utils/sound-engine';

interface HeaderProps {
  track: ProgramTrack;
  onTrackChange: (t: ProgramTrack) => void;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  onToggleAIDrawer: () => void;
  isAIDrawerOpen: boolean;
  accuracy: number;
  streak: number;
  userName: string;
  hasApiKey: boolean;
  onOpenSettings: () => void;
  nightMode?: boolean;
  onToggleNightMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  track,
  onTrackChange,
  language,
  onLanguageChange,
  onToggleAIDrawer,
  isAIDrawerOpen,
  accuracy,
  streak,
  userName,
  hasApiKey,
  onOpenSettings,
  nightMode = false,
  onToggleNightMode,
}) => {
  const [greeting, setGreeting] = useState(() => getGreeting(language));
  const [audioMode, setAudioMode] = useState<'off' | 'hum' | 'atc'>('off');
  const t = translations[language];

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting(language));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [language]);

  const cycleAudioMode = () => {
    let next: 'off' | 'hum' | 'atc' = 'off';
    if (audioMode === 'off') next = 'hum';
    else if (audioMode === 'hum') next = 'atc';
    else next = 'off';

    setAudioMode(next);
    soundEngine.setMode(next);
  };

  return (
    <header className="space-y-2.5 pt-2">
      {/* 1. Live Cockpit HUD: Device System Time & Open-Meteo Aviation Weather for Almaty */}
      <CockpitWeatherHud language={language} />

      {/* 2. Secondary Utility Bar: Brand, Audio, Night Flight, Telemetry & Settings */}
      <div className={`liquid-glass-dock px-3 py-1.5 flex items-center justify-between text-xs font-mono-avionics shadow-sm border transition-colors ${
        nightMode 
          ? 'bg-[#0B132B]/95 text-slate-100 border-emerald-900/60' 
          : 'bg-white/95 text-slate-800 border-white/95'
      }`}>
        {/* Brand & AI Mode Status */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs font-bold shrink-0">
            {track === 'ab-initio' ? (
              <Plane className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Wrench className="w-3.5 h-3.5 text-sky-200" />
            )}
          </div>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 hover:opacity-85 transition-opacity text-left"
            title={t.settingsTitle}
          >
            {hasApiKey ? (
              <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1.5 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.aiActiveBadgeShort}
              </span>
            ) : (
              <span className="text-[10px] text-slate-700 font-semibold flex items-center gap-1.5 bg-slate-100/90 px-2.5 py-0.5 rounded-full border border-slate-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {t.offlineBadgeShort}
              </span>
            )}
          </button>
        </div>

        {/* Right Controls: Audio Ambient, Night Mode, RU/EN & Settings Gear */}
        <div className="flex items-center gap-1.5">
          {/* Cockpit Audio Generator Toggle */}
          <button
            onClick={cycleAudioMode}
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono-avionics font-bold border flex items-center gap-1 transition-all ${
              audioMode === 'hum'
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : audioMode === 'atc'
                ? 'bg-blue-100 text-blue-900 border-blue-300 shadow-xs'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800'
            }`}
            title="Cockpit Audio Ambiance"
          >
            {audioMode === 'off' && <VolumeX className="w-3 h-3" />}
            {audioMode === 'hum' && <Volume2 className="w-3 h-3 text-amber-600 animate-pulse" />}
            {audioMode === 'atc' && <Radio className="w-3 h-3 text-blue-600 animate-pulse" />}
            <span>{audioMode === 'off' ? 'Mute' : audioMode === 'hum' ? 'Hum' : 'ATC'}</span>
          </button>

          {/* Day / Night Vision Toggle */}
          {onToggleNightMode && (
            <button
              onClick={onToggleNightMode}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border ${
                nightMode
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
              title={nightMode ? 'Day Vision' : 'Night Flight Mode'}
            >
              {nightMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Bilingual Toggle Capsule: RU ⟷ EN */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-full border border-white/90 text-[10px] font-mono-avionics shadow-inner">
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                language === 'ru'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
              title="Переключить на русский язык"
            >
              RU
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Settings Gear ⚙️ */}
          <button
            onClick={onOpenSettings}
            className="w-7 h-7 rounded-full liquid-glass-nested hover:bg-white/90 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all border border-white/90 shadow-xs"
            title={t.settingsTitle}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Dynamic Greeting & Candidate Profile Card */}
      <div className={`liquid-glass p-3.5 relative overflow-hidden shadow-sm border transition-colors ${
        nightMode 
          ? 'bg-[#0B132B]/90 text-slate-100 border-slate-800' 
          : 'bg-white/95 text-slate-800 border-white/95'
      }`}>
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="space-y-0.5">
            <div className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold font-cockpit tracking-tight ${
              nightMode ? 'text-emerald-400' : 'text-slate-950'
            }`}>
              <span>{greeting.text}, {userName || t.candidate}</span>
              <span>{greeting.emoji}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              {track === 'ab-initio' ? t.academySubtitlePilot : t.academySubtitleEng}
            </p>
          </div>

          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl liquid-glass-nested border border-white/90 flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all shrink-0 shadow-xs"
            title={t.editProfile}
          >
            <User className="w-4 h-4 text-blue-700" />
          </button>
        </div>

        {/* Dual Track Switcher Pill */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 grid grid-cols-2 gap-2">
          <button
            onClick={() => onTrackChange('ab-initio')}
            className={`min-h-[40px] py-1.5 px-3 rounded-xl font-cockpit font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              track === 'ab-initio'
                ? 'liquid-glass-pill-active shadow-sm text-white'
                : 'liquid-glass-nested text-slate-700 hover:text-slate-950 hover:bg-white/90'
            }`}
          >
            <Plane className={`w-3.5 h-3.5 ${track === 'ab-initio' ? 'text-amber-300' : 'text-blue-600'}`} />
            <span>{t.trackAShort}</span>
          </button>

          <button
            onClick={() => onTrackChange('apprentice')}
            className={`min-h-[40px] py-1.5 px-3 rounded-xl font-cockpit font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              track === 'apprentice'
                ? 'liquid-glass-pill-gold shadow-sm text-white'
                : 'liquid-glass-nested text-slate-700 hover:text-slate-950 hover:bg-white/90'
            }`}
          >
            <Wrench className={`w-3.5 h-3.5 ${track === 'apprentice' ? 'text-amber-200' : 'text-amber-600'}`} />
            <span>{t.trackBShort}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
