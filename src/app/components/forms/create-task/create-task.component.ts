import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsService } from 'src/app/services/forms.service';
import { IStore } from 'src/app/shared/interfaces/store';
import { setSidebarFormAction } from 'src/app/store/projects/projects.actions';
import { addTaskAction } from 'src/app/store/projects/task/task.actions';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {

  public createTaskForm!: FormGroup;
  public minHoursValue: number = 0.1;

  constructor(
    private formBuilder: FormBuilder,
    private formsService: FormsService,
    private store: Store<IStore>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  public initializeForm(): void {
    this.createTaskForm = this.formBuilder.group({
      name: ['', Validators.required],
      hours: ['', this.formsService.hoursValidator(this.minHoursValue)]
    })
  }

  public getControl(control: string): AbstractControl | null {
    return this.createTaskForm?.get(control);
  }

  // Submitting create task form 
  public submit(): void {
    this.createTaskForm.markAllAsTouched();
    this.createTaskForm.updateValueAndValidity();
    if (this.createTaskForm.invalid) return;

    const sprintId = this.router.url.split('/').reverse()[1];
    const { hours, name } = this.createTaskForm.value;
    this.store.dispatch(addTaskAction({ sprint: sprintId, scheduledHours: hours, name}));
  }

  // Closes sidebar form if user clicked cancel button
  public cancel(): void {
    this.store.dispatch(setSidebarFormAction({ form: null }));
  }

  // Submits form if user clicked Enter
  public onKeyUp(event: KeyboardEvent): void {
    if (event.keyCode !== 13) return;
    this.submit();
  }

}
