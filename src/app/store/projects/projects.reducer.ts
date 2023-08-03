import { createReducer, on } from "@ngrx/store";
import { addProjectActionOnSuccess, getProjectsActionOnSuccess, setChartAction, setSidebarFormAction } from "./projects.actions";
import { IProjectsState } from "src/app/shared/interfaces/store";
import { logoutAction } from "../user/user.actions";

const initialState: IProjectsState = {
  projects: [],
  formSidebar: null,
  chartOpen: false
};

export const projectsReducer = createReducer(
  initialState,
  on(getProjectsActionOnSuccess, (state, { projects }) => ({ ...state, projects })),
  on(addProjectActionOnSuccess, (state, { project }) => ({ ...state, projects: [...state.projects, project] })),
  on(setSidebarFormAction, (state, { form }) => ({...state, formSidebar: form })),
  on(setChartAction, (state, { chartOpen }) => ({ ...state, chartOpen })),
  on(logoutAction, () => ({ ...initialState }))
)