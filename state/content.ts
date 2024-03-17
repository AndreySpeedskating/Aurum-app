import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  IApplicationResponse,
  IAutoPark,
  ICargo,
  IConterpartieResponse,
  ILoadingPoint,
  IUnLoadingPoint,
} from '../api/content/interface';

const { setItem, getItem, removeItem } = AsyncStorage;

interface IContentState {
  autoParks: IAutoPark[];
  cargo: ICargo[];
  conterparties: IConterpartieResponse[];
  applications: IApplicationResponse[];
  loadingPoints: ILoadingPoint[];
  unloadingPoints: IUnLoadingPoint[];
  _hasHydrated: boolean;
}

interface IContentActions {
  setAutoParks: (autoParks: IAutoPark[]) => void;
  setConterparties: (conterparties: IConterpartieResponse[]) => void;
  setApplications: (applications: IApplicationResponse[]) => void;
  setContentStateHasHydrated: (status: boolean) => void;
  setLoadingPoints: (point: ILoadingPoint[]) => void;
  setUnLoadingPoints: (point: IUnLoadingPoint[]) => void;
  setCargo: (cargo: ICargo[]) => void;
}

export const useContentStore = create<IContentActions & IContentState>()(
  persist(
    (set) => ({
      autoParks: [],
      conterparties: [],
      cargo: [],
      applications: [],
      loadingPoints: [],
      unloadingPoints: [],
      _hasHydrated: false,
      setConterparties: (payload: IConterpartieResponse[]) =>
        set((state) => ({ ...state, conterparties: payload })),
      setAutoParks: (paylaod: IAutoPark[]) =>
        set((state) => ({
          ...state,
          autoParks: paylaod,
        })),
      setCargo: (payload: ICargo[]) => set((state) => ({ ...state, cargo: payload })),
      setApplications: (payload: IApplicationResponse[]) =>
        set((state) => ({ ...state, applications: payload })),
      setLoadingPoints: (payload: ILoadingPoint[]) =>
        set((state) => ({ ...state, loadingPoints: payload })),
      setUnLoadingPoints: (payload: IUnLoadingPoint[]) =>
        set((state) => ({ ...state, unloadingPoints: payload })),
      setContentStateHasHydrated: (flag: boolean) => {
        set((state) => ({
          ...state,
          _hasHydrated: flag,
        }));
      },
    }),
    {
      name: 'contentStore',
      onRehydrateStorage: () => (state) => {
        state?.setContentStateHasHydrated(true);
      },
      storage: createJSONStorage(() => ({
        setItem: setItem,
        getItem: getItem,
        removeItem: removeItem,
      })),
    }
  )
);

export const {
  setAutoParks,
  setConterparties,
  setContentStateHasHydrated,
  setApplications,
  setCargo,
  setLoadingPoints,
  setUnLoadingPoints,
} = useContentStore.getState();
