import { createReducer, on, Action } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as authActions from './auth.actions';

const createAuthReducer = createReducer(initialAuthState,
  on(authActions.loginUser, (state) => ({
    ...state,
  })),

  on(authActions.loginSuccess, (state, { userObject }) => ({
    ...state,
    userObject
  }))
);

export function authReducer(state: AuthState = initialAuthState, action: Action) {
  return createAuthReducer(state, action);
}
