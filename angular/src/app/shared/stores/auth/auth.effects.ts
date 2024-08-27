import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as authActions from './auth.actions';
import { AuthService } from 'src/app/services/auth-service.service';
import { StorageService } from 'src/app/services/storage.service';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions,
    private authService: AuthService,
    private storageService: StorageService
  ) { }

  getLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginUser),
      switchMap((action) => {
        return this.authService.login(action.loginPayload).pipe(
          map((res) => {
            this.storageService.set('loggedInUser', res);
            return authActions.loginSuccess({ userObject: res });
          })
        );
      })
    )
  );
}
