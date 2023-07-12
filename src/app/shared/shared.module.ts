import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core';
import { TaskComponent } from './components/task/task.component';
import { SprintComponent } from './components/sprint/sprint.component';
import { ProjectComponent } from './components/project/project.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { ChartTableComponent } from './dialogs/chart-table/chart-table.component';
import { InputDirective } from './directives/custom-input.directive';
import { AppRoutingModule } from '../routing/app-routing.module';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


@NgModule({
  declarations: [
    TaskComponent,
    SprintComponent,
    ProjectComponent,
    AddButtonComponent,
    ChartTableComponent,
    InputDirective,
    InfoDialogComponent,
    ConfirmationDialogComponent,
    SidebarComponent
  ],
  exports: [
    InputDirective,
    TranslateModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AddButtonComponent,
    ProjectComponent,
    SidebarComponent,
    SprintComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule
  ]
})
export class SharedModule { }
