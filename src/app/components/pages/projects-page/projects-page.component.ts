import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, take } from 'rxjs';
import { IProject } from 'src/app/shared/interfaces/project';
import { IStore } from 'src/app/shared/interfaces/store';
import { getProjectsAction, setSidebarFormAction } from 'src/app/store/projects/projects.actions';
import { sidebarFormOpenSelector, projectsSelector } from 'src/app/store/projects/projects.selectors';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent {

  public projects$: Observable<IProject[]> = this.store.select(projectsSelector);
  public sidebarOpen$: Observable<string | null> = this.store.select(sidebarFormOpenSelector);

  constructor(
    private store: Store<IStore>
  ) { }

  // Opens sidebar form to create new project
  public openSidebarForm(): void {
    this.store.dispatch(setSidebarFormAction({ form: 'project' }));
  }

}
