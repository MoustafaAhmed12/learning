import { createReducer, on } from '@ngrx/store';
import { decrement, increment, setCounterToAnyVal } from './counter.actions';

export const initialState: number = 0;
export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => state + 1),
  on(decrement, (state) => {
    if (state > 0) {
      return state - 1;
    }
    return 0;
  }),
  on(setCounterToAnyVal, (state, { counter1, counter2 }) => {
    if (counter1 > counter2) {
      return (state = counter1);
    } else {
      return (state = counter2);
    }
  })
);
