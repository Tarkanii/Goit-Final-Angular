import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { RequestsService } from "src/app/services/requests.service";
import * as actions from './sprint.actions';


@Injectable()
export class SprintEffects {
  constructor(
    private actions$: Actions,
    private requestsService: RequestsService
  ) {}

  private addSprint$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.addSprintAction),
      switchMap(({ type, ...body }) => this.requestsService.addSprint(body).pipe(
        map(({ sprint }) => actions.addSprintActionOnSuccess({ name: sprint.name, sprint })),
        catchError(({ error }: HttpErrorResponse) => of(actions.addSprintActionOnError({ message: error.message })))
      ))
    )
  })

  private deleteSprint$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.deleteSprintAction),
      switchMap(({ id, name }) => this.requestsService.deleteSprint(id).pipe(
        map(() => actions.deleteSprintActionOnSuccess({ name })),
        catchError(({ error }: HttpErrorResponse) => of(actions.deleteSprintActionOnError({ message: error.message })))
      )
    ))
  })

  private changeSprint$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.changeSprintAction),
      switchMap(({ id, name }) => this.requestsService.changeSprint(id, name).pipe(
        map(() => actions.changeSprintActionOnSuccess()),
        catchError(({ error }: HttpErrorResponse) => of(actions.changeSprintActionOnError({ message: error.message })))
      )
    ))
  })
}