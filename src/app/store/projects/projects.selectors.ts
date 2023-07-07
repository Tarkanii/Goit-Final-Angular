import { createSelector } from "@ngrx/store";
import { IProjectsState, IStore } from "src/app/shared/interfaces/store";

const selectorFeature = (store: IStore) => (store.projects);

export const projectsSelector = createSelector(
  selectorFeature,
  (state: IProjectsState) => (state.projects)
)

export const addProjectFormOpenSelector = createSelector(
  selectorFeature,
  (state: IProjectsState) => (state.addProjectFormOpen)
)