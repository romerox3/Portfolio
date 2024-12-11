import { useEffect } from 'react';
import { AnimationState } from '../types';

export const useAnimationEvents = (
  setAnimationState: (state: AnimationState) => void,
  startTime: number
) => {
  useEffect(() => {
    const checkTransitions = () => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      if (elapsedTime > 5) {
        setAnimationState(AnimationState.CENTRAL_STAR_GROWTH);
      } else if (elapsedTime > 15) {
        setAnimationState(AnimationState.SUPERNOVA_EXPLOSION);
      } else if (elapsedTime > 17) {
        setAnimationState(AnimationState.BLACK_HOLE_FORMATION);
      } else if (elapsedTime > 32) {
        setAnimationState(AnimationState.JET_FORMATION);
      }
    };

    const intervalId = setInterval(checkTransitions, 1000);
    return () => clearInterval(intervalId);
  }, [setAnimationState, startTime]);
};