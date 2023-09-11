import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, map, of, switchMap, tap } from "rxjs";
import { RequestsService } from "src/app/services/requests.service";
import * as actions from './sprint.actions';
import { InfoDialogComponent } from "src/app/shared/dialogs/info-dialog/info-dialog.component";


@Injectable()
export class SprintEffects {
  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private requestsService: RequestsService,
    private scrollStrategyOptions: ScrollStrategyOptions
  ) {}

  private addSprint$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.addSprintAction),
      switchMap(({ type, ...body }) => this.requestsService.addSprint(body).pipe(
        map(({ sprint }) => actions.addSprintActionOnSuccess({ name: sprint.name, sprint })),
        catchError((error: HttpErrorResponse) => of(actions.addSprintActionOnError({ error })))
      ))
    )
  })

  private deleteSprint$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.deleteSprintAction),
      switchMap(({ id, name }) => this.requestsService.deleteSprint(id).pipe(
        map(() => actions.deleteSprintActionOnSuccess({ name })),
        catchError((error: HttpErrorResponse) => of(actions.deleteSprintActionOnError({ error })))
      )
    ))
  })

  private changeSprint$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.changeSprintAction),
      switchMap(({ id, name, project }) => this.requestsService.changeSprint(id, name, project).pipe(
        map(() => actions.changeSprintActionOnSuccess()),
        catchError((error: HttpErrorResponse) => of(actions.changeSprintActionOnError({ error })))
      )
    ))
  })

  private openDialogOnError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.addSprintActionOnError,
        actions.changeSprintActionOnError
      ),
      filter(({ error }) => (!!error.status && error.status !== 401 && error.status < 500)), 
      map(({ error }) => {
        const base = "SPRINTS.ERROR";
        this.dialog.open(InfoDialogComponent, {
          data: {
            message: `${base}.${this.requestsService.convertMessageFromBackend(error.error.message)}`
          },
          width: '450px',
          autoFocus: false,
          scrollStrategy: this.scrollStrategyOptions.noop()
        })
      })
    )
  }, { dispatch: false })
}