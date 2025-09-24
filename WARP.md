# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo with two TypeScript packages:
  - web/ — React + Vite app (client integrates with Firebase Auth, Firestore, and Cloud Functions)
  - functions/ — Firebase Cloud Functions (securely calls Google Gemini and persists chats/messages in Firestore)
- Firebase config at repo root controls hosting output (web/dist), Firestore rules, and local emulators.

How the system works (big picture)
- Authentication: Client uses Google Sign-In via Firebase Auth. The hook exposes user state and sign-in/out helpers.
  ```ts path=C:\Users\kalas\Projects\cognitutor-ai\web\src\hooks\useAuth.ts start=1
  import { useEffect, useState, useCallback } from 'react';
  import { auth, provider } from '../firebase';
  import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';
  export function useAuth() {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    useEffect(() => onAuthStateChanged(auth, setUser), []);
    const signInWithGoogle = useCallback(async () => { await signInWithPopup(auth, provider); }, []);
    const signOut = useCallback(async () => { await fbSignOut(auth); }, []);
    return { user, signInWithGoogle, signOut };
  }
  ```
- Data model: Firestore collections
  - chats/{chatId}: metadata per conversation (userId, startedAt, topic, summary)
  - chats/{chatId}/messages/{messageId}: ordered messages with role and content
  Security rules constrain access so users can only read/write their own documents.
  ```text path=C:\Users\kalas\Projects\cognitutor-ai\firestore.rules start=1
  match /users/{userId} { allow create: if request.auth != null && request.resource.data.userId == request.auth.uid; }
  match /chats/{chatId} {
    allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    match /messages/{messageId} {
      allow create, read, update, delete: if request.auth != null && get(/databases/$(database)/documents/chats/$(chatId)).data.userId == request.auth.uid;
    }
  }
  ```
- AI interaction: The client calls a callable Cloud Function chat via httpsCallable. The function validates auth, logs the user message, calls Gemini (gemini-1.5-flash), writes the assistant reply, and returns { reply, chatId }.
  ```ts path=C:\Users\kalas\Projects\cognitutor-ai\web\src\services\chat.ts start=1
  import { httpsCallable } from 'firebase/functions';
  import { functions } from '../firebase';
  export async function sendChatMessage(message: string, chatId?: string) {
    const chat = httpsCallable<{ message: string; chatId?: string }, { reply: string; chatId: string }>(functions, 'chat');
    const res = await chat({ message, chatId });
    return res.data;
  }
  ```
  ```ts path=C:\Users\kalas\Projects\cognitutor-ai\functions\src\index.ts start=10
  export const chat = functions.region(REGION).https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    const userId = context.auth.uid;
    const message: unknown = data?.message;
    if (typeof message !== 'string' || message.trim().length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Expected non-empty string message.');
    }
    const apiKey = process.env.GEMINI_API_KEY || (functions.config().gemini && functions.config().gemini.key);
    if (!apiKey) throw new functions.https.HttpsError('failed-precondition', 'Gemini API key not configured.');
    // persist user message, call Gemini, persist assistant reply, return { reply, chatId }
  });
  ```
- Firebase initialization (client): Region is driven by env; Functions, Auth, and Firestore are initialized from VITE_ variables.
  ```ts path=C:\Users\kalas\Projects\cognitutor-ai\web\src\firebase.ts start=1
  const functions = getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1');
  export { app, auth, provider, db, functions };
  ```

Commands you will commonly use
- Install dependencies (run per package)
  ```powershell path=null start=null
  npm install --prefix web
  npm install --prefix functions
  ```
- Local development
  - Start Firebase emulators (Functions, Firestore, Auth, UI) from repo root:
    ```powershell path=null start=null
    firebase emulators:start
    ```
  - Web (Vite dev server):
    ```powershell path=null start=null
    cd web
    npm run dev
    ```
  - Functions TypeScript in watch mode (optional alongside emulators):
    ```powershell path=null start=null
    cd functions
    npm run watch
    ```
- Build
  - Web bundle to web/dist (used by Firebase Hosting):
    ```powershell path=null start=null
    cd web
    npm run build
    ```
  - Functions (transpile to functions/lib):
    ```powershell path=null start=null
    cd functions
    npm run build
    ```
- Preview built web app locally (serves web/dist only):
  ```powershell path=null start=null
  cd web
  npm run preview
  ```
- Deploy
  - Deploy Hosting and Functions from repo root:
    ```powershell path=null start=null
    firebase deploy --only hosting,functions
    ```
  - Functions-only (from functions/):
    ```powershell path=null start=null
    npm run deploy
    ```
- Lint and tests
  - Lint: not configured in this repo (functions: "lint" is a placeholder; web has none).
  - Tests: no test runner is configured. Running a single test is not applicable at this time.

Environment and configuration
- Firebase project selection
  - .firebaserc controls the default project; update "projects.default" to your project ID before emulator or deploy.
    ```json path=C:\Users\kalas\Projects\cognitutor-ai\.firebaserc start=1
    { "projects": { "default": "your-firebase-project-id" } }
    ```
- Client env (web/.env): required VITE_ variables
  ```env path=C:\Users\kalas\Projects\cognitutor-ai\web\.env.example start=1
  VITE_FIREBASE_API_KEY=...
  VITE_FIREBASE_AUTH_DOMAIN=...
  VITE_FIREBASE_PROJECT_ID=...
  VITE_FIREBASE_STORAGE_BUCKET=...
  VITE_FIREBASE_MESSAGING_SENDER_ID=...
  VITE_FIREBASE_APP_ID=...
  VITE_FIREBASE_FUNCTIONS_REGION=us-central1
  ```
- Server env (Functions): Gemini key is read from either process.env.GEMINI_API_KEY or Firebase Runtime Config.
  - Recommended (Runtime Config):
    ```powershell path=null start=null
    firebase functions:config:set gemini.key={{GEMINI_API_KEY}}
    ```
  - Optional (local env): set GEMINI_API_KEY and FIREBASE_FUNCTIONS_REGION if you prefer environment variables during local workflows.
    ```env path=C:\Users\kalas\Projects\cognitutor-ai\.env.example start=1
    GEMINI_API_KEY=...
    FIREBASE_PROJECT_ID=...
    FIREBASE_FUNCTIONS_REGION=us-central1
    ```

Important implementation notes
- Node version: Firebase Functions target Node 20 (see functions/package.json engines). Ensure your local toolchain matches for consistent builds.
- Hosting output: firebase.json serves web/dist; run npm run build in web before firebase deploy --only hosting.
- Emulators: firebase.json defines ports (Functions 5001, Firestore 8080, Auth 9099, Emulator UI enabled). Run firebase emulators:start from the repo root.

What to look at first (for context)
- Chat flow entry points:
  - Client: web/src/pages/ChatPage.tsx (local state/UI and calls to sendChatMessage)
  - API bridge: web/src/services/chat.ts (httpsCallable to Functions)
  - Backend: functions/src/index.ts (chat handler with Gemini integration and Firestore writes)
- Auth flow: web/src/hooks/useAuth.ts and web/src/firebase.ts

Repository references
- Root Firebase config and rules:
  ```json path=C:\Users\kalas\Projects\cognitutor-ai\firebase.json start=1
  { "hosting": { "public": "web/dist" }, "emulators": { "functions": { "port": 5001 }, "firestore": { "port": 8080 }, "auth": { "port": 9099 }, "ui": { "enabled": true } } }
  ```

Notes from README.md incorporated here
- Quickstart essentials: install deps per package, set project ID in .firebaserc, set Gemini key via Firebase config, prefer running with emulators, deploy with firebase deploy --only hosting,functions.
