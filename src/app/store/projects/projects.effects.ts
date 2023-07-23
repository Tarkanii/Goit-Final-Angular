import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, map, of, switchMap } from "rxjs";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RequestsService } from "src/app/services/requests.service";
import * as actions from "./projects.actions";
import { IProject } from "src/app/shared/interfaces/project";
import { InfoDialogComponent } from "src/app/shared/dialogs/info-dialog/info-dialog.component";
import { addSprintActionOnSuccess, changeSprintActionOnSuccess, deleteSprintActionOnSuccess } from "./sprint/sprint.actions";


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
        actions.deleteProjectActionOnSuccess,
        actions.changeProjectActionOnSuccess,
        addSprintActionOnSuccess,
        deleteSprintActionOnSuccess,
        changeSprintActionOnSuccess
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

  private addProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.addProjectAction),
      switchMap(({ type, ...body }) => this.requestService.addProject(body).pipe(
        map(({ project }: { project: IProject }) => actions.addProjectActionOnSuccess({ name: project.name, project })),
        catchError(({ error }: HttpErrorResponse) => of(actions.addProjectActionOnError({ message: error.message })))
      ))
    )
  })

  private changeProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.changeProjectAction),
      switchMap(({ type, id, ...body }) => {
        return this.requestService.changeProject(id, body).pipe(
          map(() => actions.changeProjectActionOnSuccess()),
          catchError(({ error }: HttpErrorResponse) => of(actions.changeProjectActionOnError({ message: error.message })))
        )
      })
    )
  })

  private openDialogOnSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.deleteProjectActionOnSuccess,
        actions.addProjectActionOnSuccess,
        addSprintActionOnSuccess,
        deleteSprintActionOnSuccess
      ),
      map(({ type, name }) => {
        const key = type.includes('Add') ? 'ADD' : 'DELETE';
        const message = `${ type.includes('Project') ? 'PROJECTS' : 'SPRINTS'}.SUCCESS.${key}`
        this.dialog.open(InfoDialogComponent, {
          width: '450px',
          data: {
            message,
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

  private closeSidebarForm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.addProjectActionOnSuccess,
        addSprintActionOnSuccess
      ),
      map(() => actions.closeSidebarFormAction())
    )
  })

}