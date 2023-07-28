import { createReducer, on } from "@ngrx/store"
import { IGeneralState } from "src/app/shared/interfaces/store"
import { setLoadingAction } from "./general.actions"

const initialState: IGeneralState = {
  loading: false
}

export const generalReducer = createReducer(
  initialState,
  on(setLoadingAction, (state, { value }) => ({...state, loading: value}))
)