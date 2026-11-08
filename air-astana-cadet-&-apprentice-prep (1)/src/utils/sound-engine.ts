/**
 * Audio Synthesis & Haptic Feedback Engine
 * Ambient Cockpit Turbine Hum, ATC Static & Tactile Vibrations
 */

class CockpitSoundEngine {
  private ctx: AudioContext | null = null;
  private humGain: GainNode | null = null;
  private radioGain: GainNode | null = null;
  private humOsc1: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  public mode: 'off' | 'hum' | 'atc' = 'off';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMode(newMode: 'off' | 'hum' | 'atc') {
    this.mode = newMode;
    this.stopAll();

    if (newMode === 'off') return;

    this.initCtx();
    if (!this.ctx) return;

    if (newMode === 'hum') {
      this.startTurbineHum();
    } else if (newMode === 'atc') {
      this.startAtcRadio();
    }
  }

  private startTurbineHum() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    this.humGain = this.ctx.createGain();
    this.humGain.gain.setValueAtTime(0, now);
    this.humGain.gain.linearRampToValueAtTime(0.08, now + 1.2);

    // Deep CFM LEAP-1A low frequency rumble (55Hz and 110Hz harmonics)
    this.humOsc1 = this.ctx.createOscillator();
    this.humOsc1.type = 'sine';
    this.humOsc1.frequency.setValueAtTime(54, now);

    this.humOsc2 = this.ctx.createOscillator();
    this.humOsc2.type = 'triangle';
    this.humOsc2.frequency.setValueAtTime(108, now);

    // Subtle lowpass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);

    this.humOsc1.connect(filter);
    this.humOsc2.connect(filter);
    filter.connect(this.humGain);
    this.humGain.connect(this.ctx.destination);

    this.humOsc1.start();
    this.humOsc2.start();
  }

  private startAtcRadio() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Generate 3 seconds of pink/bandpass static loop
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    // Aircraft VHF 124.7 MHz radio bandpass filter (300Hz - 3400Hz)
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1400, now);
    bandpass.Q.setValueAtTime(1.8, now);

    this.radioGain = this.ctx.createGain();
    this.radioGain.gain.setValueAtTime(0, now);
    this.radioGain.gain.linearRampToValueAtTime(0.04, now + 0.5);

    this.noiseNode.connect(bandpass);
    bandpass.connect(this.radioGain);
    this.radioGain.connect(this.ctx.destination);

    this.noiseNode.start();
  }

  private stopAll() {
    if (this.humGain && this.ctx) {
      try {
        this.humGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch (e) {}
    }
    if (this.radioGain && this.ctx) {
      try {
        this.radioGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch (e) {}
    }
    setTimeout(() => {
      try {
        if (this.humOsc1) { this.humOsc1.stop(); this.humOsc1.disconnect(); this.humOsc1 = null; }
        if (this.humOsc2) { this.humOsc2.stop(); this.humOsc2.disconnect(); this.humOsc2 = null; }
        if (this.noiseNode) { this.noiseNode.stop(); this.noiseNode.disconnect(); this.noiseNode = null; }
      } catch (e) {}
    }, 350);
  }
}

export const soundEngine = new CockpitSoundEngine();

/**
 * Tactile Haptic Vibration Trigger
 */
export function triggerHaptic(type: 'select' | 'success' | 'warning' | 'error' = 'select') {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    switch (type) {
      case 'select':
        navigator.vibrate(12);
        break;
      case 'success':
        navigator.vibrate([15, 50, 20]);
        break;
      case 'warning':
        navigator.vibrate([35, 40, 35]);
        break;
      case 'error':
        navigator.vibrate([45, 60, 45, 60]);
        break;
    }
  } catch (e) {
    // ignore on devices without vibration support
  }
}
