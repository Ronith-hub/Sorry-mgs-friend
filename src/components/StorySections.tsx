import React, { useState } from 'react';
import { ApologyConfig, MemoryItem, PromiseItem } from '../types/apology';
import { Heart, Sparkles, Check, Lock, Unlock, ArrowDown } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface StorySectionsProps {
  config: ApologyConfig;
  onForgive: () => void;
  isAdminUnlocked: boolean;
  onOpenAdminModal: () => void;
}

const MEMORIES: MemoryItem[] = [
  {
    id: '1',
    title: 'Late Night Talks',
    description: 'Conversations where we could be 100% ourselves.',
    tag: 'Connection',
  },
  {
    id: '2',
    title: 'Unconditional Support',
    description: 'Standing by each other when life got tough.',
    tag: 'Loyalty',
  },
  {
    id: '3',
    title: 'Endless Laughs',
    description: 'Inside jokes and memories that brighten every day.',
    tag: 'Joy',
  },
];

const INITIAL_PROMISES: PromiseItem[] = [
  { id: 'p1', title: 'I will listen before reacting', checked: true },
  { id: 'p2', title: 'I will value your feelings over my pride', checked: true },
  { id: 'p3', title: 'I will always be honest and communicate', checked: true },
];

export const StorySections: React.FC<StorySectionsProps> = ({
  config,
  onForgive,
  isAdminUnlocked,
  onOpenAdminModal,
}) => {
  const [promises, setPromises] = useState<PromiseItem[]>(INITIAL_PROMISES);

  const togglePromise = (id: string) => {
    soundFx.playChime();
    setPromises((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  };

  return (
    <div className="relative z-10 w-full pointer-events-none">
      {/* SECTION 1: HERO */}
      <section className="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto">
        <div className="max-w-lg pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span>To My Best Friend</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Hi,{' '}
            <span className="text-pink-400 font-handwriting text-5xl sm:text-6xl">
              {config.friendName || 'Bestie'}
            </span>
          </h1>

          <p className="text-base text-pink-100/90 leading-relaxed mb-6 font-normal">
            I know I made a mistake, and I am truly sorry. I built this 3D heart for you because our friendship means the world to me.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {!config.forgiven ? (
              <button
                type="button"
                onClick={() => {
                  soundFx.playChime();
                  onForgive();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>I Forgive You</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-sm font-semibold">
                <Check className="w-4 h-4" />
                <span>Forgiven & Cherished</span>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenAdminModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-black/60 hover:bg-pink-950/60 text-pink-300 border border-pink-500/30 text-xs font-medium transition-all"
            >
              {isAdminUnlocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Mode (Unlocked)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-pink-400" />
                  <span>Admin Edit</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto text-pink-300/60 text-xs flex flex-col items-center gap-1">
          <span>Scroll down</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* SECTION 2: BRIEF SINCERE NOTE */}
      <section className="min-h-screen flex flex-col justify-center items-end px-6 sm:px-12 md:px-20 max-w-6xl mx-auto py-16">
        <div className="glass-panel p-6 sm:p-8 max-w-md text-left pointer-events-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block mb-2">
            My Sincerity
          </span>
          <h2 className="text-2xl font-bold text-white mb-3">
            I Take Full Responsibility
          </h2>
          <p className="text-sm text-pink-100/90 leading-relaxed mb-3">
            I was wrong, and seeing you upset hurts me deeply. You deserve my patience, respect, and kindness every single day.
          </p>
          <div className="text-xs text-pink-300/80 italic pt-3 border-t border-pink-500/20">
            From {config.senderName || 'Your Best Friend'}
          </div>
        </div>
      </section>

      {/* SECTION 3: MEMORIES */}
      <section className="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto py-16">
        <div className="glass-panel p-6 sm:p-8 max-w-xl pointer-events-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block mb-1">
            Our Bond
          </span>
          <h2 className="text-2xl font-bold text-white mb-4">
            Moments I Cherish Most
          </h2>

          <div className="space-y-2.5">
            {MEMORIES.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-black/40 border border-pink-500/20 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                  <p className="text-xs text-pink-200/70">{m.description}</p>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                  {m.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: MY PROMISES */}
      <section className="min-h-screen flex flex-col justify-center items-end px-6 sm:px-12 md:px-20 max-w-6xl mx-auto py-16">
        <div className="glass-panel p-6 sm:p-8 max-w-md text-left pointer-events-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block mb-1">
            Promises
          </span>
          <h2 className="text-2xl font-bold text-white mb-4">
            To Be a Better Friend
          </h2>

          <div className="space-y-2.5">
            {promises.map((p) => (
              <div
                key={p.id}
                onClick={() => togglePromise(p.id)}
                className="p-3 rounded-xl bg-black/40 border border-pink-500/25 flex items-center gap-3 cursor-pointer hover:border-pink-400 transition-colors"
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border text-xs ${
                    p.checked
                      ? 'bg-pink-500 border-pink-400 text-white'
                      : 'border-pink-500/40'
                  }`}
                >
                  {p.checked && <Check className="w-3 h-3" />}
                </div>
                <span className="text-xs font-medium text-pink-100">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: FORGIVENESS FINALE */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 max-w-2xl mx-auto py-16">
        <div className="glass-panel p-8 sm:p-10 w-full pointer-events-auto">
          <Heart className="w-12 h-12 text-pink-400 fill-pink-400 mx-auto mb-4 animate-pulse" />

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Can We Start Fresh, {config.friendName || 'My Friend'}?
          </h2>

          <p className="text-sm text-pink-200/90 mb-6 font-light">
            Our friendship means too much to let a mistake stand between us.
          </p>

          <button
            type="button"
            onClick={() => {
              soundFx.playChime();
              onForgive();
            }}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/40 transition-transform active:scale-95"
          >
            ❤️ I Forgive You
          </button>
        </div>
      </section>
    </div>
  );
};
