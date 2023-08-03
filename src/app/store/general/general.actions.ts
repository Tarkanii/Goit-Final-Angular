import { createAction, props } from '@ngrx/store';

export const setLoadingAction = createAction('[General] Set Loading', props<{ value: boolean }>());