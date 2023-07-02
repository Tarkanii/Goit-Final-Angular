export interface IStore {
  user: IUserState
}

export interface IUserState {
  email: string,
  token: string,
  errorMessage: string
}