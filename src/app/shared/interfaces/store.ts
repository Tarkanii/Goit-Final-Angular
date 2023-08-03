import { IProject } from "./project"

export interface IStore {
  user: IUserState,
  projects: IProjectsState,
  general: IGeneralState
}

export interface IUserState {
  email: string,
  token: string
}

export interface IProjectsState {
  projects: IProject[],
  formSidebar: 'project' | 'sprint' | 'task' | null,
  chartOpen: boolean
}

export interface IGeneralState {
  loading: boolean
}