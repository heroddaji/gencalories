import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { AppUser } from "@/store/userStore";

// must call firebaseService.initializeApp() before using AuthService to ensure FirebaseAuthentication is properly initialized
class AuthService {
  async signInAnonymously() {
    return await FirebaseAuthentication.signInAnonymously();
  }

  async signInWithGoogle(): Promise<AppUser> {
    const result = await FirebaseAuthentication.signInWithGoogle();

    return {
      uid: result.user?.uid || "",
      displayName: result.user?.displayName || "",
      email: result.user?.email || "",
      photoUrl: result.user?.photoUrl || "",
    };
  }

  async signOut() {
    await FirebaseAuthentication.signOut();
  }
}

export const authService = new AuthService();
