import { userReducer } from './user/user.reducer';
import { UserEffects} from './user/user.effects';
import { projectsReducer } from './projects/projects.reducer';
import { ProjectEffects } from './projects/projects.effects';
import { SprintEffects } from './projects/sprint/sprint.effects';
import { TaskEffects } from './projects/task/task.effects';
import { generalReducer } from './general/general.reducer';

export const reducers = {
  user: userReducer,
  projects: projectsReducer,
  general: generalReducer
}

export const effects = [
  UserEffects,
  ProjectEffects,
  SprintEffects,
  TaskEffects
]