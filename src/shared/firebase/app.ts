import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC5CDVJNEfL6jDIwwc7MSnp9jRbEigjp4g",
  authDomain: "gen-calories.firebaseapp.com",
  projectId: "gen-calories",
  storageBucket: "gen-calories.firebasestorage.app",
  messagingSenderId: "966326325106",
  appId: "1:966326325106:web:0e762e0d127df9e030d7eb",
  measurementId: "G-T3JGT9CWVV",
};

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const initializeFirebaseAnalytics = async (): Promise<void> => {
  if (typeof window === "undefined") {
    return;
  }

  if (!(await isSupported())) {
    return;
  }

  getAnalytics(firebaseApp);
};
