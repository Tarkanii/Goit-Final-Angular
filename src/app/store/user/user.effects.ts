import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { of, catchError, exhaustMap, filter, map, mergeMap, tap } from 'rxjs';
import { createEffect, ofType, Actions} from "@ngrx/effects";
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
    private router: Router,
    private scrollStrategyOptions: ScrollStrategyOptions
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
        return this.requestService.logout().pipe(tap(() => this.requestService.setToken('')));
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

        this.dialog.open(InfoDialogComponent, {
          data: {
            type: 'auth',
            email,
            message
          },
          width: '450px',
          autoFocus: false,
          scrollStrategy: this.scrollStrategyOptions.noop()
        });

        this.router.navigateByUrl(link);
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
          data: {
            type: 'auth',
            email,
            message: `${base}.${this.requestService.convertMessageFromBackend(error.error.message)}`,
          },
          width: '450px',
          autoFocus: false,
          scrollStrategy: this.scrollStrategyOptions.noop()
        })
      })
    )
  }, { dispatch: false })

}