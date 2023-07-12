import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authRoutes } from './auth-routes';
import { AuthPageComponent } from '../components/pages/auth-page/auth-page.component';
import { ProjectsPageComponent } from '../components/pages/projects-page/projects-page.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { SprintsPageComponent } from '../components/pages/sprints-page/sprints-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', canActivate: [AuthGuard], component: AuthPageComponent, children: authRoutes },
  { path: 'projects', canActivate: [AuthGuard], component: ProjectsPageComponent, pathMatch: 'full' },
  { path: 'projects/:projectId/sprints', canActivate: [AuthGuard], component: SprintsPageComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})  
export class AppRoutingModule { }
