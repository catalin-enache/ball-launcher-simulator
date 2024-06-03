import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface AppStore {
  playState: 'play' | 'pause' | 'stop';
  setPlayState: (isPlaying: 'play' | 'pause' | 'stop') => void;
}

export const useAppStore = create<AppStore>()(
  // @ts-ignore
  subscribeWithSelector((set, _get) => ({
    playState: 'stop',
    setPlayState: (playState: AppStore['playState']) => set({ playState })
  }))
);
