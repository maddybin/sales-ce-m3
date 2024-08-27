
import { createAction, props } from '@ngrx/store';

// Login User
export const loginUser = createAction(
  '[Auth] Login User',
  props<{ loginPayload: any }>()
);

// Login User Successful
export const loginSuccess = createAction(
  '[Auth] Login User Successfully',
  props<{ userObject: any }>()
);

// Creates action for handling Logout Request /
export const Logout = createAction("[Auth] Logout user");

// Creates action for handling Logout Request /
export const LogoutSuccess = createAction("[Auth] Logout Success");