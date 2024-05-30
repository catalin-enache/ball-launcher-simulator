import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface AppStore {
  isPlaying: boolean;
}

export const useAppStore = create<AppStore>()(
  // @ts-ignore
  subscribeWithSelector((set, get) => ({
    isPlaying: false,
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying })
  }))
);
