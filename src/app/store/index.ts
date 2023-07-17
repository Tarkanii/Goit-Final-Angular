import { userReducer } from './user/user.reducer';
import { UserEffects} from './user/user.effects';
import { projectsReducer } from './projects/projects.reducer';
import { ProjectEffects } from './projects/projects.effects';
import { SprintEffects } from './projects/sprint/sprint.effects';

export const reducers = {
  user: userReducer,
  projects: projectsReducer
}

export const effects = [
  UserEffects,
  ProjectEffects,
  SprintEffects
]