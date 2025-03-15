import { createAction, props } from '@ngrx/store';

type CounterModel = { counter1: number; counter2: number; counter3?: number };

export const increment = createAction('increment');
export const decrement = createAction('decrement');
export const setCounterToAnyVal = createAction('set5', props<CounterModel>());
