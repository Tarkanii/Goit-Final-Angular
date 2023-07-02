import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { of } from 'rxjs';
import { catchError, map, mergeMap } from "rxjs/operators";
import { createEffect, ofType } from "@ngrx/effects";
import { Actions } from "@ngrx/effects";
import * as userActions from './user.actions';
import { RequestsService } from "src/app/services/requests.service";
import { ILoginResponseBody, IRegisterResponseBody } from "src/app/shared/interfaces/user";
import { MatDialog } from "@angular/material/dialog";
import { InfoDialogComponent } from "src/app/shared/dialogs/info-dialog/info-dialog.component";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IStore, IUserState } from "src/app/shared/interfaces/store";


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
      mergeMap(({ type, ...body }) => {
        return this.requestService.register(body).pipe(
          map(({ user }: IRegisterResponseBody) => userActions.registerOnSuccess({ email: user.email })),
          catchError(({ error }: HttpErrorResponse) => of(userActions.registerOnError({ email: body.email, message: error.message })))
        )
      })
    )
  })

  private login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.loginAction),
      mergeMap(({ type, ...body }) => {
        return this.requestService.login(body).pipe(
          map(({ user }: ILoginResponseBody) => userActions.loginOnSuccess({ email: user.email, token: user.token })),
          catchError(({ error }: HttpErrorResponse) => of(userActions.loginOnError({ email: body.email, message: error.message })))
        )
      })
    )
  })

  private logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.logoutAction),
      mergeMap(({ token }) => this.requestService.logout(token))
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
            callback: type.includes('Login') ? null : () => this.router.navigate([link])
          },
          autoFocus: false
        });

        type.includes('Login') && this.router.navigate([link]);
      })
    )
  }, { dispatch: false })

  private openDialogOnError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        userActions.loginOnError, 
        userActions.registerOnError
      ),
      map(({ type, message, email }) => {
        const base = `AUTH.${type.includes('Login') ? 'LOGIN' : 'REGISTER'}`;
        this.dialog.open(InfoDialogComponent, {
          width: '450px',
          data: {
            type: 'auth',
            email,
            message: `${base}.${this.convertMessageFromBackend(message)}`,
          },
          autoFocus: false
        })
      })
    )
  }, { dispatch: false })

  private convertMessageFromBackend(message: string): string {
    return message.toUpperCase().split(' ').join('_');
  }
  
}