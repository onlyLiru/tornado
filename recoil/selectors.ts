import { selector } from 'recoil';
import { counterState } from './atoms';

export const doubledCounterState = selector<number>({
  key: 'doubledCounterState',
  get: ({ get }) => {
    const counter = get(counterState);
    return counter.amount * 2;
  },
});