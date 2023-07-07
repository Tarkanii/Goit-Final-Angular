import { IProject } from "./project"

export interface IStore {
  user: IUserState,
  projects: IProjectsState
}

export interface IUserState {
  email: string,
  token: string
}

export interface IProjectsState {
  projects: IProject[],
  addProjectFormOpen: boolean 
}