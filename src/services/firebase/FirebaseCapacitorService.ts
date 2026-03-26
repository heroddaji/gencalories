import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { FirebaseCrashlytics } from "@capacitor-firebase/crashlytics";
import { FirebaseFirestore } from "@capacitor-firebase/firestore";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5CDVJNEfL6jDIwwc7MSnp9jRbEigjp4g",
  authDomain: "gen-calories.firebaseapp.com",
  projectId: "gen-calories",
  storageBucket: "gen-calories.firebasestorage.app",
  messagingSenderId: "966326325106",
  appId: "1:966326325106:web:0e762e0d127df9e030d7eb",
  measurementId: "G-T3JGT9CWVV",
};

class FirebaseCapacitorService {
  private fbApp;
  private db;

  constructor() {
    this.fbApp =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    // ensure Firestore is initialized with the same app instance and with IndexedDB persistence enabled
    // todo: verify ios/android behavior
    this.db = initializeFirestore(this.fbApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  }

  async initializeFirebaseAnalytics() {
    if (typeof window === "undefined") {
      return;
    }

    if (!(await isSupported())) {
      return;
    }

    getAnalytics(this.fbApp);
  }

  signInAnonymously = async () => {
    return await FirebaseAuthentication.signInAnonymously();
  };

  crash = async () => {
    await FirebaseCrashlytics.crash({ message: "Test" });
  };

  addDocument = async () => {
    return await FirebaseFirestore.addDocument({
      reference: "users",
      data: {
        first: "Alan",
        last: "Turing",
        born: 1912,
      },
    });
  };
}

export const FirebaseCapService = new FirebaseCapacitorService();
