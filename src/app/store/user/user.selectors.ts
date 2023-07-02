import { createSelector } from "@ngrx/store";
import { IStore, IUserState } from "src/app/shared/interfaces/store";

const selectorFeature = (store: IStore) => store.user;

export const tokenSelector = createSelector(
  selectorFeature,
  (state: IUserState) => state.token
)