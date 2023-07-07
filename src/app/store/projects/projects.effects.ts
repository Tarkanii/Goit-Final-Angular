import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, map, of, switchMap } from "rxjs";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RequestsService } from "src/app/services/requests.service";
import * as actions from "./projects.actions";
import { IProject } from "src/app/shared/interfaces/project";
import { InfoDialogComponent } from "src/app/shared/dialogs/info-dialog/info-dialog.component";


@Injectable()
export class ProjectEffects {

  constructor (
    private requestService: RequestsService,
    private actions$: Actions,
    private dialog: MatDialog
  ) {}

  private getProjects$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.getProjectsAction,
        actions.deleteProjectActionOnSuccess
      ),
      switchMap(() => this.requestService.getProjects().pipe(
        map(({ projects }: { projects: IProject[] }) => actions.getProjectsActionOnSuccess({ projects })),
        catchError(({ error }: HttpErrorResponse) => of(actions.getProjectsActionOnError({ message: error.message })))
      ))
    )
  })

  private deleteProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.deleteProjectAction),
      switchMap(({ id, name }) => this.requestService.deleteProject(id).pipe(
        map(() => actions.deleteProjectActionOnSuccess({ name })),
        catchError(({ error }: HttpErrorResponse) => of(actions.deleteProjectActionOnError({ message: error.message })))
      ))
    )
  })

  private openDialogOnSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.deleteProjectActionOnSuccess
      ),
      map(({ name }) => {
        this.dialog.open(InfoDialogComponent, {
          width: '450px',
          data: {
            message: `PROJECTS.SUCCESS`,
            name
          }
        })
      })
    )
  }, { dispatch: false })

  private openDialogOnError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.deleteProjectActionOnError
      ),
      map(({ message }) => {
        const base = "PROJECTS.ERROR";
        this.dialog.open(InfoDialogComponent, {
          width: '450px',
          data: {
            message: `${base}.${this.requestService.convertMessageFromBackend(message)}`
          }
        })
      })
    )
  }, { dispatch: false })

}