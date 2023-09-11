import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";

// Adding task actions
export const addTaskAction = createAction('[Task] Add Task', props<{ name: string, scheduledHours: number, sprint: string }>());
export const addTaskActionOnSuccess = createAction('[Task] Add Task Success', props<{ name: string }>());
export const addTaskActionOnError = createAction('[Task] Add Task Error', props<{ error: HttpErrorResponse }>());

// Deleting task actions
export const deleteTaskAction = createAction('[Task] Delete Task', props<{ id: string, name: string }>());
export const deleteTaskActionOnSuccess = createAction('[Task] Delete Task Success', props<{ name: string }>());
export const deleteTaskActionOnError = createAction('[Task] Delete Task Error', props<{ error: HttpErrorResponse }>());

// Changing task actions
export const changeTaskNameAction = createAction('[Task] Change Task Name', props<{ id: string, name: string, sprint: string }>());
export const changeTaskSpentHoursAction = createAction('[Task] Change Task Spent Hours', props<{ id: string, date: string, hours: number }>());
export const changeTaskActionOnSuccess = createAction('[Task] Change Task Success');
export const changeTaskActionOnError = createAction('[Task] Change Task Error', props<{ error: HttpErrorResponse }>());