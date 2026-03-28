import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { FirebaseCrashlytics } from "@capacitor-firebase/crashlytics";
import { FirebaseFirestore } from "@capacitor-firebase/firestore";
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { Capacitor } from "@capacitor/core";

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
  private fbApp?: FirebaseApp;
  private db?: Firestore;
  private isWeb: boolean;

  constructor() {
    this.isWeb = Capacitor.getPlatform() === "web";

    if (this.isWeb) {
      this.fbApp =
        getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

      // ensure Firestore is initialized with the same app instance and with IndexedDB persistence enabled
      this.db = initializeFirestore(this.fbApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });

      this.initializeFirebaseAnalyticsForWebPlatform();
    }
  }

  initializeApp(): FirebaseApp | undefined {
    return this.fbApp;
  }

  private async initializeFirebaseAnalyticsForWebPlatform() {
    if (typeof window === "undefined") {
      return;
    }

    if (!(await isSupported())) {
      return;
    }

    getAnalytics(this.fbApp);
  }

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

export const firebaseService = new FirebaseCapacitorService();
