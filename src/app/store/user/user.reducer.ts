import { createReducer, on } from "@ngrx/store"
import { loginOnError, loginOnSuccess, logoutAction, registerOnError, registerOnSuccess } from "./user.actions"
import { IUserState } from "src/app/shared/interfaces/store"

const initialState: IUserState = {
  email: '',
  token: '',
  errorMessage: ''
}

export const userReducer = createReducer(
  initialState,
  on(registerOnError, (state, { message }) => ({ ...state, errorMessage: message })),
  on(registerOnSuccess, (state) => ({ ...state, errorMessage: '' })),
  on(loginOnError, (state, { message }) => ({ ...state, errorMessage: message })),
  on(loginOnSuccess, (state, { email, token }) => ({ ...state, errorMessage: '', email, token })),
  on(logoutAction, () => ({ ...initialState }))
)