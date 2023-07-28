import { createSelector } from "@ngrx/store";
import { IGeneralState, IStore } from "src/app/shared/interfaces/store";

const selectorFeature = (store: IStore) => (store.general);

export const loadingSelector = createSelector(
  selectorFeature,
  (state: IGeneralState) => (state.loading)
)