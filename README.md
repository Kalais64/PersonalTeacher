<<<<<<< HEAD
# CogniTutor AI (Firebase & Gemini Edition)

A hyper-personalized e-learning platform centered on a one-on-one tutoring experience with an AI mentor. Built with React (Vite + TypeScript), Firebase (Auth, Firestore, Functions, Hosting), and Google Gemini.

## Core Features
- AI-powered chatbot tutor (Gemini via Firebase Functions)
- Learning style analysis and user profiling
- Personalized dashboard with recommendations and progress
- Adaptive quiz generator with instant feedback

## Tech Stack
- Frontend: React + Vite + TS, React Router, Zustand, Tailwind CSS, Firebase SDK
- Backend: Firebase Cloud Functions (TypeScript), Firestore, Auth, Hosting
- AI: Google Gemini via @google/generative-ai (called securely from Functions)

## Monorepo Structure
- web/ — React app
- functions/ — Firebase Cloud Functions (TypeScript)
- firebase.json — Firebase configuration
- firestore.rules — Security rules
- .firebaserc — Project mapping (set your Firebase project id)

## Quickstart
1) Prereqs
- Node.js LTS and npm
- Firebase CLI: npm i -g firebase-tools
- A Firebase project (projectId) and a Gemini API key

2) Configure
- Set Firebase project id in .firebaserc (replace placeholder)
- Copy env examples and fill values:
  - Root: cp .env.example .env (optional)
  - Web: cp web/.env.example web/.env
- For Functions, set Gemini key via Firebase config:
  firebase functions:config:set gemini.key="{{GEMINI_API_KEY}}"

3) Install deps (from repo root or per-package)
- cd web && npm install
- cd ../functions && npm install

4) Local dev (recommended with emulators)
- firebase emulators:start
  - Web will run with: npm run dev (in web)
  - Functions emulator will expose callable function: chat

5) Deploy
- firebase deploy --only hosting,functions

## Notes
- Never commit real secrets. Use Firebase config for Gemini and .env for client-side keys.
- Default Functions region is us-central1; adjust as needed.
=======
# PersonalTeacher
>>>>>>> 0d1676bef65634d339577a29b4480c1b61215065
