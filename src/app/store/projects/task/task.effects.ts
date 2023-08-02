import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { RequestsService } from 'src/app/services/requests.service';
import * as actions from './task.actions';

@Injectable()
export class TaskEffects {

  constructor(
    private requestsService: RequestsService,
    private actions$: Actions
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
      switchMap(({ id, name }) => {
        return this.requestsService.changeTaskName(id, name).pipe(
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
}