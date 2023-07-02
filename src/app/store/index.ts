import { userReducer } from './user/user.reducer';
import { UserEffects} from './user/user.effects';

export const reducers = {
  user: userReducer
}

export const effects = [
  UserEffects
]