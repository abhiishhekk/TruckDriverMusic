import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// All values come from Vite env vars (VITE_ prefix so they're exposed to
// the client). None of these are secret — a Firebase web config is safe
// to ship in a static bundle; access control lives in your Database Rules,
// not in hiding this object. See .env.example for where to get them.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Object.values(firebaseConfig).every(Boolean);

// If .env hasn't been filled in yet, skip initializing entirely rather
// than throwing at import time and taking the whole site down with it.
// useOnlineCount.js checks `db` for null and just no-ops in that case.
export const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getDatabase(app) : null;
