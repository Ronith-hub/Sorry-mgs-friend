import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { ApologyConfig } from '../types/apology';
import { soundFx } from '../utils/audio';

interface ForgiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApologyConfig;
}

export const ForgiveModal: React.FC<ForgiveModalProps> = ({ isOpen, onClose, config }) => {
  useEffect(() => {
    if (!isOpen) return;

    soundFx.playChime();

    // Trigger celebratory heart and pink confetti bursts
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#ff4d8d', '#f472b6', '#ec4899', '#ffffff', '#ffd1dc', '#10b981'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-pink-950/95 via-[#1a0515]/95 to-[#0d020a]/95 border-2 border-pink-400/50 shadow-2xl shadow-pink-500/30 text-center animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-lg shadow-pink-500/40 mb-5">
          <div className="w-full h-full rounded-full bg-pink-950/90 flex items-center justify-center">
            <Heart className="w-10 h-10 text-pink-400 fill-pink-400 animate-pulse" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-3">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Forgiveness Received</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Thank You, {config.friendName || 'My Best Friend'}! 💖
        </h3>

        <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed font-light mb-6">
          Your kindness and grace mean more than words could ever describe. I promise to protect
          our friendship, cherish every memory, and always be the friend you deserve.
        </p>

        <div className="p-4 rounded-2xl bg-black/40 border border-pink-500/20 text-xs sm:text-sm text-pink-200/80 italic mb-6">
          "Best friends don't let hard moments define their story. They grow stronger through them."
        </div>

        <button
          type="button"
          onClick={() => {
            soundFx.playChime();
            onClose();
          }}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 transition-all"
        >
          Return to 3D Heart Experience ✨
        </button>
      </div>
    </div>
  );
};
