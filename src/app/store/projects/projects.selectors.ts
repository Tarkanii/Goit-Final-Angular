import { createSelector } from "@ngrx/store";
import { IProject } from "src/app/shared/interfaces/project";
import { IProjectsState, IStore } from "src/app/shared/interfaces/store";

const selectorFeature = (store: IStore) => (store.projects);

export const projectsSelector = createSelector(
  selectorFeature,
  (state: IProjectsState) => (state.projects)
)

export const projectSelector = (id: string) => createSelector(
  selectorFeature,
  (state: IProjectsState) => (state.projects.find((project: IProject) => project._id === id)),
)

export const addProjectFormOpenSelector = createSelector(
  selectorFeature,
  (state: IProjectsState) => (state.addProjectFormOpen)
)