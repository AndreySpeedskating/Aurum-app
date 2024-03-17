import { create } from 'zustand';

interface INetworkState {
  status: boolean;
  uuid: string;
  _hasHydrated: boolean;
  401: boolean;
}

interface INetworkActions {
  setNetworkStatus: (status: boolean) => void;
  setNetworkStateHasHydrated: (status: boolean) => void;
  setUuid: (uuid: string) => void;
  setLoginStatus: (status: boolean) => void;
}

export const useServiceStore = create<INetworkActions & INetworkState>()((set) => ({
  status: false,
  uuid: '',
  _hasHydrated: false,
  401: true,
  setLoginStatus: (status: boolean) => set((state) => ({ ...state, 401: status })),
  setNetworkStatus: (status: boolean) => set((state) => ({ ...state, status })),
  setUuid: (uuid: string) => set((state) => ({ ...state, uuid })),
  setNetworkStateHasHydrated: (flag: boolean) => {
    set((state) => ({
      ...state,
      _hasHydrated: flag,
    }));
  },
}));

export const { setNetworkStatus, setNetworkStateHasHydrated, setUuid, setLoginStatus } =
  useServiceStore.getState();
