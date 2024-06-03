import { RootState, useFrame } from '@react-three/fiber';
import { _XRFrame } from '@react-three/fiber/dist/declarations/src/core/utils';
import { useAppStore } from 'src/store';

const noop = () => {};

export const usePlay = (
  callback: (state: RootState, delta: number, xrFrame?: _XRFrame) => void,
  renderPriority = 0
) => {
  const playState = useAppStore((state) => state.playState);
  useFrame(playState === 'play' ? callback : noop, renderPriority);
};
