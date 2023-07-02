import { createAction, props } from "@ngrx/store";
import { IAuthRequestBody, IUser } from "src/app/shared/interfaces/user";

// Register actions
export const registerAction = createAction('[User] Register Request', props<IAuthRequestBody>());
export const registerOnError = createAction('[User] Error Register Request', props<{ email: string, message: string }>());
export const registerOnSuccess = createAction('[User] Successful Register Request', props<{ email: string }>());

// Login actions
export const loginAction = createAction('[User] Login Request', props<IAuthRequestBody>());
export const loginOnError = createAction('[User] Error Login Request', props<{ email: string, message: string }>());
export const loginOnSuccess = createAction('[User] Successful Login Request', props<IUser>());

export const logoutAction = createAction('[User] Logout', props<{ token: string }>());