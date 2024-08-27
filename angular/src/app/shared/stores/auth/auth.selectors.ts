import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";

export const authSelector = createFeatureSelector<AuthState>('auth');
export const getLoggedInUser = createSelector(authSelector,(state) => state.userObject);
