import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { SprintsPageComponent } from './sprints-page/sprints-page.component';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';



@NgModule({
  declarations: [
    ProjectsPageComponent,
    SprintsPageComponent,
    TasksPageComponent,
    LoginPageComponent,
    RegisterPageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
