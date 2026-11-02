/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThreeHeartScene } from './components/ThreeHeartScene';
import { StorySections } from './components/StorySections';
import { BottomControlDock } from './components/BottomControlDock';
import { ForgiveModal } from './components/ForgiveModal';
import { AdminModal } from './components/AdminModal';
import { ApologyConfig } from './types/apology';

const STORAGE_KEY = 'bestie_apology_config_v1';

const DEFAULT_CONFIG: ApologyConfig = {
  friendName: 'Bestie',
  senderName: 'Your Best Friend',
  customMessage: 'I never wanted to hurt you or let you down.',
  heartColor: '#881337',
  heartEmissive: '#3d0213',
  tempo: 'normal',
  forgiven: false,
};

export default function App() {
  const [config, setConfig] = useState<ApologyConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;

    // 1. Prioritize persistent localStorage set by admin
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          // Reset session-based forgiven modal state if reloaded
          forgiven: parsed.forgiven || false,
        };
      }
    } catch (e) {
      console.warn('Failed to parse localStorage', e);
    }

    // 2. Fall back to URL parameters if available
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    const senderParam = params.get('from');
    const msgParam = params.get('msg');

    return {
      ...DEFAULT_CONFIG,
      friendName: nameParam || DEFAULT_CONFIG.friendName,
      senderName: senderParam || DEFAULT_CONFIG.senderName,
      customMessage: msgParam || DEFAULT_CONFIG.customMessage,
    };
  });

  const [isForgiveModalOpen, setIsForgiveModalOpen] = useState(false);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Keep localStorage and URL updated whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }

    const params = new URLSearchParams();
    if (config.friendName) params.set('name', config.friendName);
    if (config.senderName) params.set('from', config.senderName);
    if (config.customMessage) params.set('msg', config.customMessage);

    const newRelativePathQuery =
      window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [config]);

  const handleUpdateConfig = (updates: Partial<ApologyConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save to localStorage', e);
      }
      return next;
    });
  };

  const handleForgive = () => {
    setConfig((prev) => {
      const next = { ...prev, forgiven: true };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save to localStorage', e);
      }
      return next;
    });
    setIsForgiveModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#080106] text-pink-50 selection:bg-pink-600 selection:text-white">
      {/* 3D WebGL Canvas with High-Contrast Animated Heart and CSS2D "I am sorry" */}
      <ThreeHeartScene
        config={config}
        onForgive={handleForgive}
        onExploreClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }}
      />

      {/* Streamlined Story Sections with Reduced Text */}
      <StorySections
        config={config}
        onForgive={handleForgive}
        isAdminUnlocked={isAdminUnlocked}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Ergonomic Bottom Control Dock with Admin Password Protection */}
      <BottomControlDock
        config={config}
        onChangeConfig={handleUpdateConfig}
        onForgive={handleForgive}
        isOpen={isDockOpen}
        onToggleOpen={() => setIsDockOpen((prev) => !prev)}
        isAdminUnlocked={isAdminUnlocked}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Admin Passcode Modal (Password: 4505) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdminUnlocked={isAdminUnlocked}
        onUnlock={() => {
          setIsAdminUnlocked(true);
          setIsDockOpen(true);
        }}
        onLock={() => setIsAdminUnlocked(false)}
      />

      {/* Forgiveness Celebration Modal */}
      <ForgiveModal
        isOpen={isForgiveModalOpen}
        onClose={() => setIsForgiveModalOpen(false)}
        config={config}
      />
    </div>
  );
}
