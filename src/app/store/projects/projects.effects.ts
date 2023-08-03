import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HttpErrorResponse } from "@angular/common/http";
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, filter, map, of, switchMap } from "rxjs";
import { RequestsService } from "src/app/services/requests.service";
import * as actions from "./projects.actions";
import { IProject } from "src/app/shared/interfaces/project";
import { InfoDialogComponent } from "src/app/shared/dialogs/info-dialog/info-dialog.component";
import { addSprintActionOnSuccess, changeSprintActionOnSuccess, deleteSprintActionOnSuccess } from "./sprint/sprint.actions";
import { addTaskActionOnSuccess, changeTaskActionOnSuccess, deleteTaskActionOnSuccess } from "./task/task.actions";


@Injectable()
export class ProjectEffects {

  constructor (
    private requestService: RequestsService,
    private actions$: Actions,
    private dialog: MatDialog,
    private scrollStrategyOptions: ScrollStrategyOptions
  ) {}

  private getProjects$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.getProjectsAction,
        actions.deleteProjectActionOnSuccess,
        actions.changeProjectActionOnSuccess,
        addSprintActionOnSuccess,
        deleteSprintActionOnSuccess,
        changeSprintActionOnSuccess,
        addTaskActionOnSuccess,
        changeTaskActionOnSuccess,
        deleteTaskActionOnSuccess
      ),
      switchMap(() => this.requestService.getProjects().pipe(
        map(({ projects }: { projects: IProject[] }) => actions.getProjectsActionOnSuccess({ projects })),
        catchError((error: HttpErrorResponse) => of(actions.getProjectsActionOnError({ error })))
      ))
    )
  })

  private deleteProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.deleteProjectAction),
      switchMap(({ id, name }) => this.requestService.deleteProject(id).pipe(
        map(() => actions.deleteProjectActionOnSuccess({ name })),
        catchError((error: HttpErrorResponse) => of(actions.deleteProjectActionOnError({ error })))
      ))
    )
  })

  private addProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.addProjectAction),
      switchMap(({ type, ...body }) => this.requestService.addProject(body).pipe(
        map(({ project }: { project: IProject }) => actions.addProjectActionOnSuccess({ name: project.name, project })),
        catchError((error: HttpErrorResponse) => of(actions.addProjectActionOnError({ error })))
      ))
    )
  })

  private changeProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.changeProjectAction),
      switchMap(({ type, id, ...body }) => {
        return this.requestService.changeProject(id, body).pipe(
          map(() => actions.changeProjectActionOnSuccess()),
          catchError((error: HttpErrorResponse) => of(actions.changeProjectActionOnError({ error })))
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
        deleteSprintActionOnSuccess,
        addTaskActionOnSuccess,
        deleteTaskActionOnSuccess
      ),
      map(({ type, name }) => {
        const key = type.includes('Add') ? 'ADD' : 'DELETE';
        const message = `${ type.includes('Project') ? 'PROJECTS' : type.includes('Sprint') ? 'SPRINTS' : 'TASKS'}.SUCCESS.${key}`
        this.dialog.open(InfoDialogComponent, {
          data: {
            message,
            name
          },
          width: '450px',
          autoFocus: false,
          scrollStrategy: this.scrollStrategyOptions.noop()
        })
      })
    )
  }, { dispatch: false })

  private openDialogOnError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.deleteProjectActionOnError
      ),
      filter(({ error }) => (!!error.status && error.status !== 401 && error.status < 500)), 
      map(({ error }) => {
        const base = "PROJECTS.ERROR";
        this.dialog.open(InfoDialogComponent, {
          data: {
            message: `${base}.${this.requestService.convertMessageFromBackend(error.error.message)}`
          },
          width: '450px',
          autoFocus: false,
          scrollStrategy: this.scrollStrategyOptions.noop()
        })
      })
    )
  }, { dispatch: false })

  private closeSidebarForm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        actions.addProjectActionOnSuccess,
        addSprintActionOnSuccess,
        addTaskActionOnSuccess
      ),
      map(() => actions.setSidebarFormAction({ form: null }))
    )
  })

}