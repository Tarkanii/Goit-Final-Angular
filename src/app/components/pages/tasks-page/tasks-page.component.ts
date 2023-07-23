import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, filter, takeUntil } from 'rxjs';
import { ISprint } from 'src/app/shared/interfaces/project';
import { IStore } from 'src/app/shared/interfaces/store';
import { openSidebarFormAction } from 'src/app/store/projects/projects.actions';
import { changeSprintAction } from 'src/app/store/projects/sprint/sprint.actions';
import { sprintSelector, sprintsSelector } from 'src/app/store/projects/sprint/sprint.selectors';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent implements OnInit {

  public sprint$!: Observable<ISprint | null>;
  public sprints$!: Observable<ISprint[]>;
  public sprintIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public sprintId: string = '';
  public sprintDate: Date | null = null;
  public changeNameForm: FormGroup | null = null;
  public calendarOpen: boolean = false;

  private sprints: ISprint[] = [];
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store<IStore>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ projectId, sprintId }) => {
        this.sprints$ = this.store.select(sprintsSelector(projectId));
        this.sprint$ = this.store.select(sprintSelector(projectId, sprintId));
        this.sprintId = sprintId;
        this.sprintIndex$.next(this.getSprintIndex(this.sprintId))
      })

    this.sprints$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sprints: ISprint[]) => {
        this.sprints = sprints;
        this.sprintIndex$.next(this.getSprintIndex(this.sprintId))
      })

    this.sprintIndex$
      .pipe(
        filter(() => !!this.sprints.length),
        takeUntil(this.unsubscribe$)
        )
      .subscribe((index: number) => {
        this.calendarOpen = false;
        const { startDate, endDate } = this.sprints[index - 1];
        this.setInitialSprintDate(startDate, endDate);
      })
  }

  public initializeChangeNameForm(): void {
    this.changeNameForm = this.formBuilder.group({
      name: ''
    })
  }

  public getSprintIndex(sprintId: string): number {
    const index = this.sprints.findIndex((sprint: ISprint) => sprint._id === sprintId);
    return index < 0 ? 1 : index + 1;    
  }

  public switchSprint(action: 'decrease' | 'increase'): void {
    if (action === 'decrease' && this.sprintIndex$.value <= 1) return;

    if (action === 'increase' && this.sprintIndex$.value >= this.sprints.length) return;

    const index = action === 'decrease' ? this.sprintIndex$.value - 2 : this.sprintIndex$.value;
    const sprintId = this.sprints[index]._id;
    const urlArr = this.router.url.split('/');
    const url = urlArr.slice(0, urlArr.length - 2).join('/') + `/${sprintId}` + '/tasks';
    this.router.navigateByUrl(url);
  }

  public setInitialSprintDate(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date();

    if (currentDate.getTime() >= start.getTime() && currentDate.getTime() <= end.getTime()) {
      this.sprintDate = currentDate;
    } else if (currentDate.getTime() > end.getTime()) {
      this.sprintDate = end;
    } else if (currentDate.getTime() < start.getTime()) {
      this.sprintDate = start;
    }
  }

  public setSprintDate(date: Date): void {
    this.sprintDate = date;
  }

  public destroyChangeNameForm(): void {
    this.changeNameForm = null;
  }

  public openSidebarForm(): void {
    this.store.dispatch(openSidebarFormAction({ form: 'task' }));
  }

  public submitChangeNameForm(event: Event): void {
    event.preventDefault();
    const { name } = this.changeNameForm?.value;
    if (name.trim()?.length) {
      this.store.dispatch(changeSprintAction({ id: this.sprintId, name: String(name.trim()) }));
    }
    this.destroyChangeNameForm();
  }

}
