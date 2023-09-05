import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { IProject } from "src/app/shared/interfaces/project";

// Getting projects actions
export const getProjectsAction = createAction('[Projects] Get Projects');
export const getProjectsActionOnSuccess = createAction('[Projects] Get Projects Success', props<{ projects: IProject[] }>());
export const getProjectsActionOnError = createAction('[Projects] Get Projects Error', props<{ error: HttpErrorResponse }>());

// Deleting project actions
export const deleteProjectAction = createAction('[Projects] Delete Project', props<{ id: string, name: string }>());
export const deleteProjectActionOnSuccess = createAction('[Projects] Delete Project Success', props<{ name: string }>());
export const deleteProjectActionOnError = createAction('[Projects] Delete Project Error', props<{ error: HttpErrorResponse }>());

// Adding project actions
export const addProjectAction = createAction('[Projects] Add Project', props<{ name: string, description: string }>());
export const addProjectActionOnSuccess = createAction('[Projects] Add Project Success', props<{ name: string, project: IProject }>());
export const addProjectActionOnError = createAction('[Projects] Add Project Error', props<{ error: HttpErrorResponse }>());

// Changing project actions
export const changeProjectAction = createAction('[Projects] Change Project', props<{ id: string, name?: string, description?: string }>());
export const changeProjectActionOnSuccess = createAction('[Projects] Change Project Success');
export const changeProjectActionOnError = createAction('[Projects] Change Project Error', props<{ error: HttpErrorResponse }>());

// Add participants actions
export const addParticipantAction = createAction('[Participant] Add Participant', props<{ id: string, email: string }>());
export const addParticipantActionOnSuccess = createAction('[Participant] Add Participant Success', props<{ name: string }>());
export const addParticipantActionOnError = createAction('[Participant] Add Participant Error', props<{ error: HttpErrorResponse }>());

// Delete participants actions
export const deleteParticipantAction = createAction('[Participant] Delete Participant', props<{ id: string, email: string }>());
export const deleteParticipantActionOnSuccess = createAction('[Participant] Delete Participant Success', props<{ name: string }>());
export const deleteParticipantActionOnError = createAction('[Participant] Delete Participant Error', props<{ error: HttpErrorResponse }>());

// Setting sidebar form value action
export const setSidebarFormAction = createAction('[Projects] Set Sidebar Form Value', props<{ form: 'project' | 'sprint' | 'task' | 'participant' | null }>());

// Setting chart value action
export const setChartAction = createAction('[Projects] Set Chart Value', props<{ chartOpen: boolean }>());