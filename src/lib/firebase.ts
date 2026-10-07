import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC2YL3bLDxWWfpG7gToviJB14F2t8F0ro0",
  authDomain: "hifz-bf01b.firebaseapp.com",
  databaseURL: "https://hifz-bf01b-default-rtdb.firebaseio.com",
  projectId: "hifz-bf01b",
  storageBucket: "hifz-bf01b.firebasestorage.app",
  messagingSenderId: "345379633337",
  appId: "1:345379633337:web:d47c106ce913fc27984368",
  measurementId: "G-PWF4DRB1XV"
};

// Initialize Firebase (singleton pattern safe for Next.js SSR)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const db = getFirestore(app);

// Client-side analytics initialization
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};
