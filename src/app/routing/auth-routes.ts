import { Routes } from '@angular/router';
import { RegisterFormComponent } from '../components/forms/register-form/register-form.component';
import { LoginFormComponent } from '../components/forms/login-form/login-form.component';

export const authRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
]