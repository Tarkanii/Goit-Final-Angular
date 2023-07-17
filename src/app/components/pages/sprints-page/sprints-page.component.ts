import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IProject } from 'src/app/shared/interfaces/project';
import { IStore } from 'src/app/shared/interfaces/store';
import { changeProjectAction, openSidebarFormAction } from 'src/app/store/projects/projects.actions';
import { projectSelector, projectsSelector } from 'src/app/store/projects/projects.selectors';

@Component({
  selector: 'app-sprints-page',
  templateUrl: './sprints-page.component.html',
  styleUrls: ['./sprints-page.component.scss']
})
export class SprintsPageComponent implements OnInit, OnDestroy {

  public projects$: Observable<IProject[]> = this.store.select(projectsSelector);
  public project$!: Observable<IProject | undefined>;
  public changeNameForm: FormGroup | null = null;
  private projectId!: string;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store<IStore>,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ projectId }) => {
        this.projectId = projectId;
        this.project$ = this.store.select(projectSelector(projectId));
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public initializeChangeNameForm(): void {
    this.changeNameForm = this.formBuilder.group({
      name: ''
    })
  }

  public destroyChangeNameForm(): void {
    this.changeNameForm = null;
  }

  public submitChangeNameForm(event: Event): void {
    event.preventDefault();
    const { name } = this.changeNameForm?.value;
    if (name.trim()?.length) {
      this.store.dispatch(changeProjectAction({ id: this.projectId, name: String(name.trim()) }));
    }
    this.destroyChangeNameForm();
  }

  public openSidebarForm(): void {
    this.store.dispatch(openSidebarFormAction({ form: 'sprint' }));
  }

}
