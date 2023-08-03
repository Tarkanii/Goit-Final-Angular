import { createReducer, on } from "@ngrx/store"
import { loginOnSuccess, logoutAction, setUserStateAction } from "./user.actions"
import { IUserState } from "src/app/shared/interfaces/store"

const initialState: IUserState = {
  email: '',
  token: ''
}

export const userReducer = createReducer(
  initialState,
  on(loginOnSuccess, (state, { email, token }) => ({ ...state, email, token })),
  on(logoutAction, () => ({ ...initialState })),
  on(setUserStateAction, (_, { type, ...state }) => ({ ...state }))
)