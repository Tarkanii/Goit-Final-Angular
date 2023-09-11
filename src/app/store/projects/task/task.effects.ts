import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { RequestsService } from 'src/app/services/requests.service';
import * as actions from './task.actions';
import { InfoDialogComponent } from 'src/app/shared/dialogs/info-dialog/info-dialog.component';

@Injectable()
export class TaskEffects {

  constructor(
    private requestsService: RequestsService,
    private actions$: Actions,
    private dialog: MatDialog,
    private scrollStrategyOptions: ScrollStrategyOptions
  ) {}

  private addTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.addTaskAction),
      switchMap(({ type, ...body }) => this.requestsService.addTask(body).pipe(
        map(({ task }) => actions.addTaskActionOnSuccess({ name: task.name })),
        catchError((error: HttpErrorResponse) => of(actions.addTaskActionOnError({ error })))
      ))
    )
  })

  private deleteTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.deleteTaskAction),
      switchMap(({ id, name }) => this.requestsService.deleteTask(id).pipe(
        map(() => actions.deleteTaskActionOnSuccess({ name })),
        catchError((error: HttpErrorResponse) => of(actions.deleteTaskActionOnError({ error })))
      ))
    )
  })

  private changeTaskName$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.changeTaskNameAction),
      switchMap(({ id, name, sprint }) => {
        return this.requestsService.changeTaskName(id, name, sprint).pipe(
          map(() => actions.changeTaskActionOnSuccess()),
          catchError((error: HttpErrorResponse) => of(actions.changeTaskActionOnError({ error })))
        )
      })
    )
  })

  private changeTaskSpentHours$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.changeTaskSpentHoursAction),
      switchMap(({ type, id, ...body  }) => {
        return this.requestsService.changeTaskSpentHours(id, body).pipe(
          map(() => actions.changeTaskActionOnSuccess()),
          catchError((error: HttpErrorResponse) => of(actions.changeTaskActionOnError({ error })))
        )
      })
    )
  })

  private openDialogOnError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.addTaskActionOnError,
        actions.changeTaskActionOnError,
      ),
      filter(({ error }) => (!!error.status && error.status !== 401 && error.status < 500)), 
      map(({ error }) => {
        const base = "TASKS.ERROR";
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