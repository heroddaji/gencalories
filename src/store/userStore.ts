import { create } from "zustand";

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
}

interface UserState {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
}

// 2. Create the Zustand Store
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
