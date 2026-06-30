class AudioEngine {
  constructor() {
    this.muted = storage.getSetting('muted', false);
    this.audioContext = null;
  }

  playCorrect() {
    if (this.muted) return;
    this.playTone(800, 200);
  }

  playWrong() {
    if (this.muted) return;
    this.playTone(300, 200);
  }

  playCombo() {
    if (this.muted) return;
    this.playTone(600, 150);
  }

  playHover() {
    if (this.muted) return;
    this.playTone(400, 50);
  }

  playClick() {
    if (this.muted) return;
    this.playTone(500, 100);
  }

  playTone(frequency, duration) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  }

  toggleMute() {
    this.muted = !this.muted;
    storage.saveSetting('muted', this.muted);
    return this.muted;
  }

  setMute(value) {
    this.muted = value;
    storage.saveSetting('muted', this.muted);
  }
}

const audioEngine = new AudioEngine();
