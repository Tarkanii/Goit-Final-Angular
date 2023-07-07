import { createSelector } from "@ngrx/store";
import { IProject } from "src/app/shared/interfaces/project";
import { IStore } from "src/app/shared/interfaces/store";

const selectorFeature = (store: IStore) => (store.projects);

export const projectsSelector = createSelector(
  selectorFeature,
  (projects: IProject[]) => (projects)
) 