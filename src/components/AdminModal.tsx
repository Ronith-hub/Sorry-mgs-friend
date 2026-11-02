import React, { useState } from 'react';
import { Lock, Unlock, X, KeyRound, Check } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdminUnlocked,
  onUnlock,
  onLock,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '4505') {
      soundFx.playChime();
      setError(false);
      setPassword('');
      onUnlock();
      onClose();
    } else {
      setError(true);
      soundFx.playHeartbeat();
    }
  };

  const handleRelock = () => {
    soundFx.playChime();
    onLock();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm p-6 rounded-2xl bg-[#170412] border border-pink-500/40 shadow-2xl text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-pink-300 hover:text-white hover:bg-pink-900/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-full bg-pink-950 border border-pink-500/40 flex items-center justify-center mb-4">
          {isAdminUnlocked ? (
            <Unlock className="w-6 h-6 text-emerald-400" />
          ) : (
            <Lock className="w-6 h-6 text-pink-400" />
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          {isAdminUnlocked ? 'Admin Mode Unlocked' : 'Admin Access Required'}
        </h3>
        <p className="text-xs text-pink-200/80 mb-5">
          {isAdminUnlocked
            ? 'You have permission to change the best friend name and settings.'
            : 'Only admins can change the best friend name and apology settings.'}
        </p>

        {isAdminUnlocked ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Admin permissions active</span>
            </div>
            <button
              type="button"
              onClick={handleRelock}
              className="w-full py-2.5 rounded-xl bg-pink-950 hover:bg-pink-900 text-pink-200 border border-pink-500/40 text-xs font-semibold"
            >
              Lock Admin Mode
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="password"
                  maxLength={10}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="Enter 4-digit password"
                  autoFocus
                  className={`w-full px-4 py-2.5 rounded-xl bg-black/60 border text-white text-center text-lg tracking-widest focus:outline-none ${
                    error
                      ? 'border-red-500 ring-1 ring-red-500'
                      : 'border-pink-500/40 focus:border-pink-400'
                  }`}
                />
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-pink-400/60" />
              </div>
              {error && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">
                  Incorrect passcode. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-pink-500/30 transition-transform active:scale-95"
            >
              Unlock Settings
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
