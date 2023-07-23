import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { IStore } from '../../interfaces/store';
import { Store } from '@ngrx/store';
import { openSidebarFormAction } from 'src/app/store/projects/projects.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  @Input() public list: any[] | null = null;
  @Input() public type: 'project' | 'sprint' = 'project';
  @ViewChild('listTemplate') public listTemplate!: ElementRef;
  public params$: Observable<{ project: string, sprint: string }> = this.getParams();

  constructor(
    private store: Store<IStore>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const currentObject = this.listTemplate.nativeElement.querySelector('.current');
    if (currentObject) {
      currentObject.scrollIntoView({ behavior: "smooth" });
    }
  }

  private getParams(): Observable<{ project: string, sprint: string }> {
    return this.activatedRoute.params
      .pipe(
        map(({ projectId, sprintId }) => {
          return { project: projectId, sprint: sprintId }
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
    this.store.dispatch(openSidebarFormAction({ form: this.type }));
  }
}
