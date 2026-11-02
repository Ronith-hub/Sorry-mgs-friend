# 💖 3D Best Friend Apology Experience

An interactive 3D web experience built with **React**, **Three.js**, **CSS2DRenderer**, and **Tailwind CSS**. Designed to express a sincere, heartfelt apology to your best friend through an extruded 3D pulsing heart, glowing pink sparkles particle system, high-contrast overlay text, emotional storytelling sections, and interactive forgiveness celebrations.

---

## ✨ Features

- **3D Procedural Extruded Heart**:
  - Sculpted using mathematical bezier curves and extruded with smooth bevels in Three.js.
  - Rendered with glossy `MeshPhysicalMaterial` (clearcoat, metalness, and subtle rim emission).
  - High-contrast deep velvet color palette so the foreground text overlay is crystal clear.
  - Organic heartbeat pulse rhythm with gentle mouse-tilt and scroll tracking.

- **Centered CSS2DObject Text Overlay**:
  - Built with Three.js `CSS2DRenderer` and `CSS2DObject`, perfectly anchored to the 3D heart's center.
  - Utilizes semantic HTML tags and glowing glassmorphism styling that scales with 3D camera perspective.

- **Glowing Pink Sparkles Particle System**:
  - 340 soft glowing pink sparkles emitting and orbiting around the heart's contours.
  - Procedural radial-glow texture with star flare (100% in-code, zero external 404 image dependencies).
  - Rendered with `THREE.AdditiveBlending` for an enchanting, ambient atmosphere.

- **Admin Password Gate (`4505`)**:
  - Best friend's name, sender name, and custom message can **only** be modified by admins.
  - Entering the admin password **`4505`** unlocks editing mode.
  - The password is strictly hidden from regular visitors and best friends viewing the apology.

- **Persistent Across Reloads (`localStorage`)**:
  - Once the admin sets the friend's name, sender name, or message, it is permanently saved in browser `localStorage`.
  - Survives page refreshes, browser restarts, and tab closures until changed again by the admin.

- **Emotional Storytelling Journey**:
  - **Sincere Letter**: Honest acknowledgment and taking full accountability.
  - **Cherished Memories**: Interactive tokens celebrating your irreplaceable friendship.
  - **Promises**: Tangible commitments to listen first, communicate, and value their feelings.
  - **Forgiveness Finale**: Interactive *"I Forgive You"* button that triggers celebratory confetti bursts and warm harp chimes.

- **Procedural Web Audio API Sound Effects**:
  - Zero external `.mp3` dependencies.
  - Synthesizes harmonious harp chimes and organic heartbeats procedurally in the browser.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [bun](https://bun.sh/)

### Installation

1. **Clone the repository** (or extract the zip file):
   ```bash
   git clone https://github.com/your-username/3d-friend-apology.git
   cd 3d-friend-apology
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready static assets will be output to the `dist/` folder.

---

## 🔐 Admin Usage

1. Open the website.
2. Click **Admin Edit** on the hero section or the **Lock icon** in the bottom dock.
3. Enter password: **`4505`**.
4. Customize your best friend's name, your sign-off, or the apology message.
5. Click **Lock when finished**.
6. Your custom name and notes are now permanently saved and will persist whenever the link is opened or refreshed!

---

## 📁 Project Structure

```
├── public/                 # Static assets & downloadable package
│   └── apology-3d-heart.zip
├── src/
│   ├── components/
│   │   ├── ThreeHeartScene.tsx    # Three.js 3D canvas, extruded heart, CSS2DObject & sparkles
│   │   ├── StorySections.tsx      # Clean, heartfelt story & memory sections
│   │   ├── BottomControlDock.tsx  # Collapsible bottom dock with admin-guarded inputs
│   │   ├── AdminModal.tsx         # Passcode verification modal (PIN: 4505)
│   │   └── ForgiveModal.tsx       # Celebration modal with canvas confetti
│   ├── types/
│   │   └── apology.ts             # Data models, config, and color themes
│   ├── utils/
│   │   └── audio.ts               # Procedural Web Audio API sound synthesis
│   ├── App.tsx                    # Main controller & localStorage persistence
│   ├── index.css                  # Tailwind CSS, custom fonts & glassmorphism
│   └── main.tsx                   # React root entry point
├── index.html                     # HTML shell and Google Fonts
├── package.json                   # Dependencies and npm scripts
├── tsconfig.json                  # TypeScript compiler options
├── vite.config.ts                 # Vite bundler configuration
└── README.md                      # Documentation
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) + `CSS2DRenderer`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API (Synthesizer Oscillators)

---

## 📄 License

MIT License — Feel free to use and customize this project for your own friendships!
