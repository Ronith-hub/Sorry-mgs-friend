export interface ApologyConfig {
  friendName: string;
  senderName: string;
  customMessage: string;
  heartColor: string;
  heartEmissive: string;
  tempo: 'gentle' | 'normal' | 'fast';
  forgiven: boolean;
}

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  tag: string;
}

export interface PromiseItem {
  id: string;
  title: string;
  checked: boolean;
}

export const HEART_THEMES = [
  {
    id: 'midnight-ruby',
    name: 'Midnight Ruby',
    color: 0x660720,
    emissive: 0x3d0213,
    accentHex: '#881337',
  },
  {
    id: 'deep-crimson',
    name: 'Deep Crimson',
    color: 0x831843,
    emissive: 0x4a0429,
    accentHex: '#9d174d',
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Amethyst',
    color: 0x4c1d95,
    emissive: 0x2e1065,
    accentHex: '#6b21a8',
  },
  {
    id: 'sapphire-night',
    name: 'Midnight Blue',
    color: 0x1e1b4b,
    emissive: 0x0f172a,
    accentHex: '#312e81',
  },
  {
    id: 'warm-amber',
    name: 'Warm Amber',
    color: 0x78350f,
    emissive: 0x451a03,
    accentHex: '#92400e',
  },
];
