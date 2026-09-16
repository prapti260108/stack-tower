# Stack Tower

A responsive block-stacking game built with React, HTML5 Canvas, Node.js, Express, and MongoDB Atlas.

## Run locally

1. Copy `server/.env.example` to `server/.env`, then replace `MONGODB_URI` with a MongoDB Atlas connection string. Keep this file on the server only—never enter or expose the URI in the game UI. The game still works offline with device-local saves.
2. In one terminal, start the API: `npm run dev:server`.
3. In another terminal, start the game: `npm run dev:client`.
4. Open the URL printed by Vite, normally `http://localhost:5173`.

## MongoDB Atlas setup

Create a free Atlas cluster, create a database user, and add your current IP address to **Network Access**. In Atlas, use **Connect > Drivers** to copy the Node.js connection string; set its database name to `stack-tower`, URL-encode any special characters in the password, and put the complete string in `server/.env` as `MONGODB_URI`. For deployment, set `MONGODB_URI` in the hosting provider's server-side environment variables and set `VITE_API_URL` to the deployed API URL before building the client.

## What is included

- **Game Mechanics & SOW Baseline**: Tap/click and keyboard canvas controls, deterministic cutting physics, camera lerp tracking, 7 difficulty tiers with wind drift, combo multipliers with width-restoration milestones, particle VFX, and local best-score persistence.
- **Themes & Economy**: 6 block materials and 5 atmospheric background environments, unlockable with stars earned through gameplay.
- **Sound Engine**: 100% offline Web Audio API synthesizer with independent user settings for music, SFX, haptic vibration, and reduced motion.
- **Modals & UI**: Splash screen, Home screen, How to Play with interactive animated canvas preview, Game HUD, Pause with Quit Confirmation, Game Over results, Settings, Theme Vault, and Leaderboard.
- **Backend & Persistence**: Express REST endpoints for player profiles, game sessions, and leaderboard; Mongoose ODM with MongoDB Atlas integration and zero-dependency in-memory fallback.
- **Mobile Build Ready**: Capacitor configuration (`capacitor.config.json`) for Android APK and iOS Xcode packaging.

## Verify & Build

- **Unit tests**: `npm test` runs the 5 test suites covering collision math, difficulty, game loop, scoring, and state transitions.
- **Web production build**: `npm run build` generates optimized client bundle in `client/dist`.
- **Mobile packaging**: `npm run build:mobile` generates web assets and syncs with native Android/iOS Capacitor containers.
- **QA Acceptance Report**: Refer to [`QA_TEST_SUMMARY.md`](QA_TEST_SUMMARY.md) for detailed test cases and compliance matrix.

