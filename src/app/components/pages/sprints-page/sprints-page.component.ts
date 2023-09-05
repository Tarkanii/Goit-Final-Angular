import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { IProject } from 'src/app/shared/interfaces/project';
import { IStore } from 'src/app/shared/interfaces/store';
import { loadingSelector } from 'src/app/store/general/general.selectors';
import { changeProjectAction, setSidebarFormAction } from 'src/app/store/projects/projects.actions';
import { projectSelector, projectsSelector } from 'src/app/store/projects/projects.selectors';

@Component({
  selector: 'app-sprints-page',
  templateUrl: './sprints-page.component.html',
  styleUrls: ['./sprints-page.component.scss']
})
export class SprintsPageComponent implements OnInit, OnDestroy {

  public loading$: Observable<boolean> = this.store.select(loadingSelector);
  public projects$: Observable<IProject[]> = this.store.select(projectsSelector);
  public project!: IProject | undefined;
  public changeNameControl: FormControl = this.formBuilder.control('');
  public changeDescriptionControl: FormControl = this.formBuilder.control('');
  private projectId!: string;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store<IStore>,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ projectId }) => {
          this.projectId = projectId;
          return this.store.select(projectSelector(projectId));
        }),
        takeUntil(this.unsubscribe$)
        )
      .subscribe((project: IProject | undefined) => {
        this.project = project;
        this.changeNameControl.setValue(project?.name);
        this.changeDescriptionControl.setValue(project?.description);
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // Changes name of the project
  public changeProjectName(): void {
    const newName = this.changeNameControl.value.trim();
    if (!newName.length || newName === this.project?.name) {
      this.changeNameControl.setValue(this.project?.name);
      return;
    }

    this.store.dispatch(changeProjectAction({ id: this.projectId, name: newName }));
  }

  // Changes description of the project
  public changeProjectDescription(): void {
    const newDescription = this.changeDescriptionControl.value.trim();
    if (newDescription === this.project?.description) {
      this.changeDescriptionControl.setValue(this.project?.description);
      return;
    }

    this.store.dispatch(changeProjectAction({ id: this.projectId, description: newDescription }));
  }

  // Opens sidebar form to create new sprint
  public openSidebarForm(): void {
    this.store.dispatch(setSidebarFormAction({ form: 'sprint' }));
  }

  // Opens sidebar form to add new participant
  public openAddParticipantForm(): void {
    this.store.dispatch(setSidebarFormAction({ form: 'participant' }));
  }

}
