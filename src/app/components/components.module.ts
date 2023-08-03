import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { SprintsPageComponent } from './pages/sprints-page/sprints-page.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { RegisterFormComponent } from './forms/register-form/register-form.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { CreateProjectComponent } from './forms/create-project/create-project.component';
import { FormSidebarComponent } from './form-sidebar/form-sidebar.component';
import { CreateSprintComponent } from './forms/create-sprint/create-sprint.component';
import { CreateTaskComponent } from './forms/create-task/create-task.component';
import { ChartComponent } from './chart/chart.component';



@NgModule({
  declarations: [
    CreateTaskComponent,
    CreateSprintComponent,
    CreateProjectComponent,
    ProjectsPageComponent,
    SprintsPageComponent,
    TasksPageComponent,
    LoginFormComponent,
    RegisterFormComponent,
    HeaderComponent,
    AuthPageComponent,
    FormSidebarComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    HeaderComponent,
    CreateProjectComponent,
    CreateSprintComponent,
    CreateTaskComponent,
    FormSidebarComponent,
    ChartComponent
  ]
})
export class ComponentsModule { }
