import { createReducer, on } from "@ngrx/store";
import { addProjectActionOnSuccess, closeAddProjectFormAction, getProjectsActionOnSuccess, openAddProjectFormAction } from "./projects.actions";
import { IProjectsState } from "src/app/shared/interfaces/store";

const initialState: IProjectsState = {
  projects: [],
  addProjectFormOpen: false
};

export const projectsReducer = createReducer(
  initialState,
  on(getProjectsActionOnSuccess, (state, { projects }) => ({ ...state, projects })),
  on(addProjectActionOnSuccess, (state, { project }) => ({ ...state, projects: [...state.projects, project]})),
  on(openAddProjectFormAction, (state) => ({...state, addProjectFormOpen: true})),
  on(closeAddProjectFormAction, (state) => ({...state, addProjectFormOpen: false}))
)