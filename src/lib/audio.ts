export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled = false;

  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new Ctx();
    }
  }

  public async toggle() {
    this.initCtx();
    if (this.ctx!.state === 'suspended') {
      await this.ctx!.resume();
    }

    this.isEnabled = !this.isEnabled;

    if (this.isEnabled) {
      this.startAmbient();
      this.playPowerOn();
    } else {
      this.stopAmbient();
    }
    return this.isEnabled;
  }

  private startAmbient() {
    if (!this.ctx) return;
    
    if (!this.ambientGain) {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0;
      this.ambientGain.connect(this.ctx.destination);

      // Create a binaural beat / low throb effect (55Hz and 56Hz)
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.value = 55;
      
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.value = 56.5; 

      this.ambientOsc1.connect(this.ambientGain);
      this.ambientOsc2.connect(this.ambientGain);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
    }

    // Swell in slowly
    this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 3);
  }

  private stopAmbient() {
    if (!this.ctx || !this.ambientGain) return;
    this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
  }

  public playHover() {
    if (!this.isEnabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // High-pitched short tick
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  public playClick() {
    if (!this.isEnabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Solid mechanical click
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public playMenuToggle(isOpen: boolean) {
    if (!this.isEnabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    if (isOpen) {
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.3);
    }

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  private playPowerOn() {
    if (!this.isEnabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1);
  }
}

export const sound = new AudioEngine();
