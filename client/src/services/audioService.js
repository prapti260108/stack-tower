/**
 * Procedural Web Audio API Synthesizer & Haptics Service for Stack Tower
 * 100% offline, zero external sound asset dependencies.
 */

class AudioService {
  constructor() {
    this.ctx = null;
    this.bgmOscillator = null;
    this.bgmGain = null;
    this.bgmInterval = null;
    this.bgmStep = 0;
    this.settings = {
      music: true,
      sfx: true,
      haptics: true
    };

    // Pentatonic scale frequencies for combo chimes (starts warm, rises gracefully)
    this.pentatonicScale = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      1046.50 // C6
    ];

    this.isGameplayActive = false;
    this.setupLifecycleListeners();
  }

  setupLifecycleListeners() {
    if (typeof document === 'undefined') return;

    // Immediately stop audio when app is minimized, screen locked, or switched to another app
    const handleHidden = () => {
      if (document.hidden) {
        this.stopBGM();
        if (this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleHidden);
    window.addEventListener('pagehide', handleHidden);
    window.addEventListener('beforeunload', () => this.stopBGM());
  }

  // Safe AudioContext initializer on user gesture
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    } catch (e) {
      console.warn('AudioContext not supported:', e);
    }
  }

  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    if (!this.settings.music) {
      this.stopBGM();
    } else if (this.isGameplayActive) {
      this.startBGM();
    }
  }

  // Play Drop Whoosh SFX
  playDrop() {
    if (!this.settings.sfx) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch (e) {
      // Audio safety
    }
  }

  // Play Landing Thud SFX
  playLand() {
    if (!this.settings.sfx) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);

      this.triggerHaptic([15]);
    } catch (e) {
      // Audio safety
    }
  }

  // Play Harmonic Ascending Combo / Perfect Placement Chime
  playPerfect(comboStreak = 1) {
    if (!this.settings.sfx) return;
    this.init();
    if (!this.ctx) return;

    try {
      const noteIndex = (comboStreak - 1) % this.pentatonicScale.length;
      const baseFreq = this.pentatonicScale[noteIndex];

      // Primary tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);

      // Bell overtone harmonic
      const overtone = this.ctx.createOscillator();
      const otGain = this.ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(baseFreq * 2, this.ctx.currentTime);

      otGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      otGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      overtone.connect(otGain);
      otGain.connect(this.ctx.destination);

      overtone.start();
      overtone.stop(this.ctx.currentTime + 0.26);

      this.triggerHaptic([20, 40, 20]);
    } catch (e) {
      // Audio safety
    }
  }

  // Play Miss / Game Over SFX
  playMiss() {
    if (!this.settings.sfx) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.46);

      this.triggerHaptic([60, 30, 80]);
    } catch (e) {
      // Audio safety
    }
  }

  // Play UI Button Click
  playClick() {
    if (!this.settings.sfx) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);

      this.triggerHaptic([10]);
    } catch (e) {
      // Audio safety
    }
  }

  // Ambient Procedural Synthesizer Background Music (Lo-fi Arpeggiated Pad)
  startBGM() {
    this.isGameplayActive = true;
    if (!this.settings.music) return;
    this.init();
    if (!this.ctx || this.bgmInterval) return;

    const chords = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [196.00, 246.94, 293.66], // G
      [164.81, 196.00, 246.94]  // Em
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.settings.music || !this.ctx || this.ctx.state !== 'running') return;

      const chord = chords[chordIdx];
      const freq = chord[noteIdx];

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.48);
      } catch (e) {
        // Audio safety
      }

      noteIdx = (noteIdx + 1) % chord.length;
      if (noteIdx === 0) {
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, 420);
  }

  stopBGM(preserveIntent = false) {
    if (!preserveIntent) {
      this.isGameplayActive = false;
    }
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // Device Haptics
  triggerHaptic(pattern = [20]) {
    if (!this.settings.haptics) return;
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // Haptics safety
    }
  }
}

export const audioService = new AudioService();
