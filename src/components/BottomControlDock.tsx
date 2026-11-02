import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Palette, Sliders, Volume2, VolumeX, Sparkles, User, Lock, Unlock, Download } from 'lucide-react';
import { ApologyConfig, HEART_THEMES } from '../types/apology';
import { soundFx } from '../utils/audio';

interface BottomControlDockProps {
  config: ApologyConfig;
  onChangeConfig: (newConfig: Partial<ApologyConfig>) => void;
  onForgive: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isAdminUnlocked: boolean;
  onOpenAdminModal: () => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  config,
  onChangeConfig,
  onForgive,
  isOpen,
  onToggleOpen,
  isAdminUnlocked,
  onOpenAdminModal,
}) => {
  const [activeTab, setActiveTab] = useState<'names' | 'themes' | 'tempo'>('names');
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playChime();
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95vw] max-w-2xl transition-transform duration-300 ease-out select-none ${
        isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-40px)]'
      }`}
    >
      {/* Collapse / Expand Tab */}
      <div className="flex justify-center -mb-px">
        <button
          type="button"
          onClick={() => {
            soundFx.playChime();
            onToggleOpen();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-t-xl bg-[#160412] border-t border-x border-pink-500/40 text-pink-300 hover:text-white text-xs font-semibold shadow-lg transition-colors"
        >
          {isOpen ? (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide Controls</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Settings & Themes</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      <div className="p-4 rounded-2xl bg-[#140310]/95 backdrop-blur-xl border border-pink-500/40 shadow-2xl text-white">
        {/* Top dock bar: tab switches + audio + forgive */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-pink-500/20">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-pink-500/20">
            <button
              type="button"
              onClick={() => setActiveTab('names')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'names'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-pink-300/80 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Bestie Name</span>
              {!isAdminUnlocked && <Lock className="w-3 h-3 text-pink-400/80" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('themes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'themes'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-pink-300/80 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Color</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tempo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tempo'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-pink-300/80 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Pulse</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSound}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-xl bg-black/40 border border-pink-500/20 text-pink-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onOpenAdminModal}
              title={isAdminUnlocked ? 'Admin Mode (Active)' : 'Unlock Admin Mode'}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isAdminUnlocked
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-black/40 border-pink-500/20 text-pink-300 hover:text-white'
              }`}
            >
              {isAdminUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>

            {!config.forgiven ? (
              <button
                type="button"
                onClick={() => {
                  soundFx.playChime();
                  onForgive();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-pink-500/30 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>I Forgive You</span>
              </button>
            ) : (
              <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold">
                Forgiven ❤️
              </span>
            )}
          </div>
        </div>

        {/* Tab 1: Names (Admin Protected) */}
        {activeTab === 'names' && (
          <div>
            {!isAdminUnlocked ? (
              <div className="p-4 rounded-xl bg-black/50 border border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-950 flex items-center justify-center text-pink-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Names Are Protected</h4>
                    <p className="text-[11px] text-pink-300/70">
                      Only verified admins can change bestie names and notes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-600/30 transition-transform active:scale-95"
                >
                  Enter Admin Password
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-pink-300">
                        Best Friend's Name:
                      </label>
                      <span className="text-[10px] text-emerald-400 font-medium">Admin Unlocked</span>
                    </div>
                    <input
                      type="text"
                      value={config.friendName}
                      onChange={(e) => onChangeConfig({ friendName: e.target.value })}
                      placeholder="Enter best friend's name"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-pink-500/40 text-white text-xs focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-pink-300 mb-1">
                      Your Name:
                    </label>
                    <input
                      type="text"
                      value={config.senderName}
                      onChange={(e) => onChangeConfig({ senderName: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-pink-500/40 text-white text-xs focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-pink-300 mb-1">
                      Apology Note:
                    </label>
                    <input
                      type="text"
                      value={config.customMessage}
                      onChange={(e) => onChangeConfig({ customMessage: e.target.value })}
                      placeholder="Short apology text"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-pink-500/40 text-white text-xs focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-pink-500/20 text-[11px] text-pink-300/70">
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    ✓ Saved permanently (persists after reload)
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href="/apology-3d-heart.zip"
                      download="apology-3d-heart.zip"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-900/60 hover:bg-pink-800/80 border border-pink-500/40 text-pink-200 text-xs font-semibold transition-colors"
                      title="Download clean code zip for GitHub"
                    >
                      <Download className="w-3.5 h-3.5 text-pink-400" />
                      <span>Download Code ZIP</span>
                    </a>
                    <button
                      type="button"
                      onClick={onOpenAdminModal}
                      className="text-pink-400 hover:text-white underline text-[10px]"
                    >
                      Lock
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Heart Color */}
        {activeTab === 'themes' && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {HEART_THEMES.map((theme) => {
              const isSelected = config.heartColor === theme.accentHex;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    soundFx.playChime();
                    onChangeConfig({
                      heartColor: theme.accentHex,
                      heartEmissive: `#${theme.emissive.toString(16).padStart(6, '0')}`,
                    });
                  }}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                    isSelected
                      ? 'bg-pink-900/60 border-pink-400'
                      : 'bg-black/40 border-pink-500/20 hover:border-pink-400/50'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-white/40"
                    style={{ backgroundColor: theme.accentHex }}
                  />
                  <span className="text-[11px] font-semibold text-white">{theme.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 3: Pulse Tempo */}
        {activeTab === 'tempo' && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'gentle', label: 'Gentle' },
              { id: 'normal', label: 'Heartbeat' },
              { id: 'fast', label: 'Flutter' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  soundFx.playChime();
                  onChangeConfig({ tempo: t.id as 'gentle' | 'normal' | 'fast' });
                }}
                className={`p-2.5 rounded-xl text-center border transition-all text-xs font-semibold ${
                  config.tempo === t.id
                    ? 'bg-pink-600/40 border-pink-400 text-white'
                    : 'bg-black/40 border-pink-500/20 text-pink-300 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
