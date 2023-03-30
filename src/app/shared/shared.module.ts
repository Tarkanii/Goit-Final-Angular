import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './components/task/task.component';
import { SprintComponent } from './components/sprint/sprint.component';
import { ProjectComponent } from './components/project/project.component';
import { AccentButtonComponent } from './components/accent-button/accent-button.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { CreateProjectComponent } from './dialogs/create-project/create-project.component';
import { CreateTaskComponent } from './dialogs/create-task/create-task.component';
import { CreateSprintComponent } from './dialogs/create-sprint/create-sprint.component';
import { AddPeopleComponent } from './dialogs/add-people/add-people.component';
import { ChartTableComponent } from './dialogs/chart-table/chart-table.component';



@NgModule({
  declarations: [
    TaskComponent,
    SprintComponent,
    ProjectComponent,
    AccentButtonComponent,
    AddButtonComponent,
    CreateProjectComponent,
    CreateTaskComponent,
    CreateSprintComponent,
    AddPeopleComponent,
    ChartTableComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
