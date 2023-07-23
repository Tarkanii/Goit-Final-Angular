import { createSelector } from "@ngrx/store";
import { IProject, ISprint } from "src/app/shared/interfaces/project";
import { projectsSelector } from '../projects.selectors';

export const sprintsSelector = (projectId: string) => createSelector(
  projectsSelector,
  (projects: IProject[]) => {
    if (!projects.length) {
      return [];
    }

    const idx = projects.findIndex((project: IProject) => project._id === projectId);
    return projects[idx].sprints;
  }
)

export const sprintSelector = (projectId: string, sprintId: string) => createSelector(
  sprintsSelector(projectId),
  (sprints: ISprint[]) => {
    if (!sprints.length) {
      return null;
    }

    const idx = sprints.findIndex((sprint: ISprint) => sprint._id === sprintId);
    return sprints[idx];
  }
)