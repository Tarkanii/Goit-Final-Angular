import { createAction, props } from "@ngrx/store";
import { IProject } from "src/app/shared/interfaces/project";

// Getting projects actions
export const getProjectsAction = createAction('[Projects] Get Projects');
export const getProjectsActionOnSuccess = createAction('[Projects] Get Projects Success', props<{ projects: IProject[] }>());
export const getProjectsActionOnError = createAction('[Projects] Get Projects Error', props<{ message: string }>());

// Deleting project actions
export const deleteProjectAction = createAction('[Projects] Delete Project', props<{ id: string, name: string }>());
export const deleteProjectActionOnSuccess = createAction('[Projects] Delete Project Success', props<{ name: string }>());
export const deleteProjectActionOnError = createAction('[Projects] Delete Project Error', props<{ message: string }>());