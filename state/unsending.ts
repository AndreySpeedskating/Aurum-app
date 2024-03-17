import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ImagePickerAsset } from 'expo-image-picker';

const { setItem, getItem, removeItem } = AsyncStorage;

interface IContentState {
  unsendingPhotos: { [key: number]: ImagePickerAsset[] };
  unSendingApplications: { data: any; files: any[] }[];
  _hasHydrated: boolean;
}

interface IContentActions {
  setUnsendingPhotos: (payload: { [key: number]: ImagePickerAsset[] }) => void;
  setUnsendingApplications: (applications: { data: any; files: any[] }[]) => void;
  setUnsendingStateHasHydrated: (status: boolean) => void;
}

export const useUnsendingStore = create<IContentActions & IContentState>()(
  persist(
    (set) => ({
      unSendingApplications: [],
      unsendingPhotos: [],
      _hasHydrated: false,
      setUnsendingPhotos: (payload) => set((state) => ({ ...state, unsendingPhotos: payload })),
      setUnsendingApplications: (payload: { data: any; files: any[] }[]) =>
        set((state) => ({ ...state, unSendingApplications: payload })),
      setUnsendingStateHasHydrated: (flag: boolean) => {
        set((state) => ({
          ...state,
          _hasHydrated: flag,
        }));
      },
    }),
    {
      name: 'unsendingStore',
      onRehydrateStorage: () => (state) => {
        state?.setUnsendingStateHasHydrated(true);
      },
      storage: createJSONStorage(() => ({
        setItem: setItem,
        getItem: getItem,
        removeItem: removeItem,
      })),
    }
  )
);

export const { setUnsendingApplications, setUnsendingPhotos } = useUnsendingStore.getState();
