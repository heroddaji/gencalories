import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useUserStore((state) => state.setUser);

  const executeGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.signInWithGoogle();
      setUser(userData);
    } catch (err: any) {
      console.error("Google Sign-In failed:", err);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const executeSignOut = async () => {
    await authService.signOut();
    setUser(null); // Clear store
  };

  return {
    executeGoogleSignIn,
    executeSignOut,
    loading,
    error,
  };
};
