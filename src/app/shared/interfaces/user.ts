export interface IUser {
  email: string,
  token: string
}

export interface IAuthRequestBody {
  email: string,
  password: string
}

export interface ILoginResponseBody {
  user: IUser
}

export interface IRegisterResponseBody {
  user: {
    email: string
  }
}