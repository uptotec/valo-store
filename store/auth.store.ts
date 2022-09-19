import create from 'zustand';

type authStore =
  | {
      isSignedIn: false;
      accessToken: null;
      expiresIn: null;
      entitlementsToken: null;
      puuid: null;
      date: null;
    }
  | {
      isSignedIn: true;
      accessToken: string;
      expiresIn: number;
      entitlementsToken: string;
      puuid: string;
      date: number;
    };

export const useAuthStore = create<authStore>((set) => ({
  isSignedIn: false,
  accessToken: null,
  expiresIn: null,
  entitlementsToken: null,
  puuid: null,
  date: null,
}));
