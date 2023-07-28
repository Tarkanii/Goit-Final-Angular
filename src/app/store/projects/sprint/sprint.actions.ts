import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { ICreateSprintBody, ISprint } from "src/app/shared/interfaces/project";

// Add sprint actions
export const addSprintAction = createAction('[Sprint] Add Sprint', props<ICreateSprintBody>()); 
export const addSprintActionOnSuccess = createAction('[Sprint] Add Sprint Success', props<{ name: string, sprint: ISprint }>()); 
export const addSprintActionOnError = createAction('[Sprint] Add Sprint Error', props<{ error: HttpErrorResponse }>()); 

// Delete sprint actions
export const deleteSprintAction = createAction('[Sprint] Delete Sprint', props<{ id: string, name: string }>()); 
export const deleteSprintActionOnSuccess = createAction('[Sprint] Delete Sprint Success', props<{ name: string }>()); 
export const deleteSprintActionOnError = createAction('[Sprint] Delete Sprint Error', props<{ error: HttpErrorResponse }>());

// Change sprint actions
export const changeSprintAction = createAction('[Sprint] Change Sprint', props<{ id: string, name: string }>()); 
export const changeSprintActionOnSuccess = createAction('[Sprint] Change Sprint Success');
export const changeSprintActionOnError = createAction('[Sprint] Change Sprint Error', props<{ error: HttpErrorResponse }>());