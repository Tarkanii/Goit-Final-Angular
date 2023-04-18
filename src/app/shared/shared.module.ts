import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './components/task/task.component';
import { SprintComponent } from './components/sprint/sprint.component';
import { ProjectComponent } from './components/project/project.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { ChartTableComponent } from './dialogs/chart-table/chart-table.component';
import { InputDirective } from './directives/custom-input.directive';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../routing/app-routing.module';


@NgModule({
  declarations: [
    TaskComponent,
    SprintComponent,
    ProjectComponent,
    AddButtonComponent,
    ChartTableComponent,
    InputDirective
  ],
  exports: [
    InputDirective,
    TranslateModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class SharedModule { }
