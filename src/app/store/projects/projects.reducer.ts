import { createReducer, on } from "@ngrx/store";
import { getProjectsActionOnSuccess } from "./projects.actions";

const initialState: any[] = [];

export const projectsReducer = createReducer(
  initialState,
  on(getProjectsActionOnSuccess, (state, { projects }) => ([...projects]))
)