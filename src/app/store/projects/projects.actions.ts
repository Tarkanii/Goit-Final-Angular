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

// Change project actions
export const changeProjectAction = createAction('[Projects] Change Project', props<{ id: string, name?: string, description?: string }>());
export const changeProjectActionOnSuccess = createAction('[Projects] Change Project Success');
export const changeProjectActionOnError = createAction('[Projects] Change Project Error', props<{ error: HttpErrorResponse }>());

// Add project form actions
export const openSidebarFormAction = createAction('[Projects] Open Form', props<{ form: 'project' | 'sprint' | 'task' }>());
export const closeSidebarFormAction = createAction('[Projects] Close Form');

// Set chart value 
export const setChartAction = createAction('[Projects] Set Chart value', props<{ chartOpen: boolean }>());