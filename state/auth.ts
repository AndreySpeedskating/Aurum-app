import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IAuthResponse } from '../api/auth/interface';

interface IAuthState {
  jwt: string;
  user: string;
  phone: string;
  id: number;
  device_id: string;
  _hasHydrated: boolean;
}

interface IAuthActions {
  setUser: (payload: IAuthResponse) => void;
  setAuthStateHasHydrated: (status: boolean) => void;
  resetUser: () => void;
}

export const useAuthStore = create<IAuthActions & IAuthState>()(
  persist(
    (set) => ({
      jwt: '',
      user: '',
      phone: '',
      id: 0,
      device_id: '',
      _hasHydrated: false,
      setUser: (paylaod: IAuthResponse) =>
        set((state) => ({
          ...state,
          user: paylaod?.user?.username,
          jwt: paylaod?.jwt,
          id: paylaod?.user?.id,
          phone: paylaod?.user?.phone,
          device_id: paylaod?.user?.device_id,
        })),
      resetUser: () => set((state) => ({ ...state, user: '', jwt: '', phone: '' })),
      setAuthStateHasHydrated: (flag: boolean) => {
        set((state) => ({
          ...state,
          _hasHydrated: flag,
        }));
      },
    }),
    {
      name: 'authStore',
      onRehydrateStorage: () => (state) => {
        state?.setAuthStateHasHydrated(true);
      },
      storage: createJSONStorage(() => ({
        setItem: setItemAsync,
        getItem: getItemAsync,
        removeItem: deleteItemAsync,
      })),
    }
  )
);

export const { setUser, setAuthStateHasHydrated, resetUser } = useAuthStore.getState();
