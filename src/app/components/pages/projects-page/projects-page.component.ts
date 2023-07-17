import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IProject } from 'src/app/shared/interfaces/project';
import { IStore } from 'src/app/shared/interfaces/store';
import { getProjectsAction, openSidebarFormAction } from 'src/app/store/projects/projects.actions';
import { sidebarFormOpenSelector, projectsSelector } from 'src/app/store/projects/projects.selectors';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit {

  public projects$: Observable<IProject[]> = this.store.select(projectsSelector);
  public sidebarOpen$: Observable<string | null> = this.store.select(sidebarFormOpenSelector);

  constructor(
    private store: Store<IStore>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(getProjectsAction());
  }

  public onClick(): void {
    this.store.dispatch(openSidebarFormAction({ form: 'project' }));
  }

}
