import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { IStore } from '../../interfaces/store';
import { setSidebarFormAction } from 'src/app/store/projects/projects.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, OnDestroy {

  @Input() public list: any[] | null = null;
  @Input() public type: 'project' | 'sprint' = 'project';
  @ViewChild('listTemplate') public listTemplate!: ElementRef;
  public params$: Observable<{ project: string, sprint: string }> = this.getParams();
  private interval!: number;

  constructor(
    private store: Store<IStore>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngAfterViewInit(): void {
    this.interval = window.setInterval(() => {
        const currentObject = this.listTemplate.nativeElement.querySelector('.current');
        if (currentObject) {
          clearInterval(this.interval);
          currentObject.scrollIntoView({ behavior: "smooth", block: 'nearest' });
        }
    }, 100);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  // Getting ids of current project and sprint 
  private getParams(): Observable<{ project: string, sprint: string }> {
    return this.activatedRoute.params
      .pipe(
        map(({ projectId, sprintId }) => {
          return { project: projectId, sprint: sprintId };
        })
      )
  }

  public navigateBack(): void {
    if (this.type === 'project') {
      this.router.navigateByUrl('/');
      return;
    }
 
    const projectPageUrl = this.router.url.split('sprints')[0] + 'sprints';
    this.router.navigateByUrl(projectPageUrl);
  }

  // Getting link for list items (projects or sprints items)
  public getLink(id: string): string {
    if (this.type === 'project') {
      return `/projects/${id}/sprints`;
    } else {
      const urlArray = this.router.url.split('/');
      urlArray[urlArray.length - 2] = id;
      return urlArray.join('/');
    }
  }

  public openFormSidebar(): void {
    this.store.dispatch(setSidebarFormAction({ form: this.type }));
  }
}
