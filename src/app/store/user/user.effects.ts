import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { of } from 'rxjs';
import { catchError, exhaustMap, filter, map, mergeMap } from "rxjs/operators";
import { createEffect, ofType } from "@ngrx/effects";
import { Actions } from "@ngrx/effects";
import * as userActions from './user.actions';
import { RequestsService } from "src/app/services/requests.service";
import { ILoginResponseBody, IRegisterResponseBody } from "src/app/shared/interfaces/user";
import { InfoDialogComponent } from "src/app/shared/dialogs/info-dialog/info-dialog.component";


@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private requestService: RequestsService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  private register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.registerAction),
      exhaustMap(({ type, ...body }) => {
        return this.requestService.register(body).pipe(
          map(({ user }: IRegisterResponseBody) => userActions.registerOnSuccess({ email: user.email })),
          catchError((error: HttpErrorResponse) => of(userActions.registerOnError({ email: body.email, error })))
        )
      })
    )
  })

  private login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.loginAction),
      exhaustMap(({ type, ...body }) => {
        return this.requestService.login(body).pipe(
          map(({ user }: ILoginResponseBody) => {
            this.requestService.setToken(user.token);
            return userActions.loginOnSuccess({ email: user.email, token: user.token })
          }),
          catchError((error: HttpErrorResponse) => of(userActions.loginOnError({ email: body.email, error })))
        )
      })
    )
  })

  private logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.logoutAction),
      mergeMap(() => {
        this.router.navigateByUrl('/auth/login');
        return this.requestService.logout();
      })
    )
  }, { dispatch: false })

  private openDialogOnSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        userActions.registerOnSuccess,
        userActions.loginOnSuccess
        ),
      map(({ type, email }) => {
        const link = type.includes('Login') ? 'projects' : 'auth/login';
        const message = `AUTH.${type.includes('Login') ? 'LOGIN' : 'REGISTER'}.SUCCESS`;
        const button = type.includes('Login') ? null : 'BUTTONS.LOG_IN';

        this.dialog.open(InfoDialogComponent, {
          width: '450px',
          data: {
            type: 'auth',
            email: email,
            message,
            button,
            callback: type.includes('Login') ? null : () => this.router.navigateByUrl(link)
          },
          autoFocus: false
        });

        type.includes('Login') && this.router.navigateByUrl(link);
      })
    )
  }, { dispatch: false })

  private openDialogOnError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        userActions.loginOnError, 
        userActions.registerOnError
      ),
      filter(({ error }) => (!!error.status && error.status !== 401 && error.status < 500)),
      map(({ type, error, email }) => {
        const base = `AUTH.${type.includes('Login') ? 'LOGIN' : 'REGISTER'}`;
        this.dialog.open(InfoDialogComponent, {
          width: '450px',
          data: {
            type: 'auth',
            email,
            message: `${base}.${this.requestService.convertMessageFromBackend(error.error.message)}`,
          },
          autoFocus: false
        })
      })
    )
  }, { dispatch: false })

}