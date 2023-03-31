import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { SprintsPageComponent } from './pages/sprints-page/sprints-page.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    ProjectsPageComponent,
    SprintsPageComponent,
    TasksPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class ComponentsModule { }
