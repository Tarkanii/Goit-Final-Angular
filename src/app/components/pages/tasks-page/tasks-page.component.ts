import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { ISprint } from 'src/app/shared/interfaces/project';
import { IStore } from 'src/app/shared/interfaces/store';
import { loadingSelector } from 'src/app/store/general/general.selectors';
import { setSidebarFormAction, setChartAction } from 'src/app/store/projects/projects.actions';
import { changeSprintAction } from 'src/app/store/projects/sprint/sprint.actions';
import { sprintSelector, sprintsSelector } from 'src/app/store/projects/sprint/sprint.selectors';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent implements OnInit {

  public loading$: Observable<boolean> = this.store.select(loadingSelector);
  public sprint!: ISprint | null;
  public sprints$!: Observable<ISprint[]>;
  public projectId: string = '';
  public sprintId: string = '';
  public sprintDate: Date | null = null;
  public changeNameControl: FormControl = this.formBuilder.control('');
  public searchControl: FormControl = this.formBuilder.control(''); 
  public calendarOpen: boolean = false;

  private sprints: ISprint[] = [];
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store<IStore>,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ projectId, sprintId }) => {
          this.projectId = projectId; 
          this.sprints$ = this.store.select(sprintsSelector(projectId));
          return this.store.select(sprintSelector(projectId, sprintId));
        }),
        takeUntil(this.unsubscribe$)
        )
      .subscribe((sprint: ISprint | null) => {
        this.sprint = sprint;
        if (!sprint) return;

        if (this.sprintId !== sprint._id) {
          this.onSprintChange();
        }
        this.sprintId = sprint._id;
        this.changeNameControl.setValue(sprint.name);
      })

    this.sprints$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sprints: ISprint[]) => {
        const mustUpdate = !this.sprints.length;
        this.sprints = sprints;
        if (mustUpdate) {
          // Must update current sprint values only if there were no sprints before
          // otherwise it will cause change of sprint date selected by user
          this.onSprintChange();
        }
      })
  }

  private onSprintChange(): void {
    this.calendarOpen = false;
    this.searchControl.setValue('');
    if (!this.sprint) return; 
    const { startDate, endDate } = this.sprint;
    this.setInitialSprintDate(startDate, endDate);
  }

  // Sets initial date of sprint on init or on swicthing sprints 
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

  // Gets filter functions for filter pipe
  public filterFunc(): (value: string) => boolean {
    return (value: string) => {
      return value.toLowerCase().includes(this.searchControl.value.toLowerCase().trim());
    };
  }

  // Sets sprint date
  public setSprintDate(date: Date): void {
    this.sprintDate = date;
  }

  // Opens sidebar form to create new task
  public openSidebarForm(): void {
    this.store.dispatch(setSidebarFormAction({ form: 'task' }));
  }

  // Opens chart to see the progress on the sprint
  public openChart(): void {
    this.calendarOpen = false;
    this.store.dispatch(setChartAction({ chartOpen: true }));
  }

  // Changes name of sprint
  public changeSprintName(): void {
    const newName = this.changeNameControl.value?.trim();
    if (!newName.length || newName === this.sprint?.name) {
      this.changeNameControl.setValue(this.sprint?.name);
      return;
    }
 
    this.store.dispatch(changeSprintAction({ id: this.sprintId, project: this.projectId, name: newName }));
    this.changeNameControl.setValue(this.sprint?.name);
  }

}
