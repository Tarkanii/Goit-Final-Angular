import { IProject } from "./project"

export interface IStore {
  user: IUserState,
  projects: IProject[]
}

export interface IUserState {
  email: string,
  token: string
}