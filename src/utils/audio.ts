/**
 * Procedural Web Audio API sound synthesis.
 * Zero external audio files (no 404s).
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sweet, warm chime when clicking or accepting the apology
   */
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.4);
    });
  }

  /**
   * Heartbeat thud sound effect
   */
  public playHeartbeat() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Double beat lub-dub
    [0, 0.16].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(i === 0 ? 82 : 70, now + offset);
      osc.frequency.exponentialRampToValueAtTime(32, now + offset + 0.15);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.18, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.25);
    });
  }
}

export const soundFx = new SoundController();
