import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormsService } from 'src/app/services/forms.service';
import { IStore } from 'src/app/shared/interfaces/store';
import { closeSidebarFormAction } from 'src/app/store/projects/projects.actions';

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
    private store: Store<IStore>
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

  public submit(): void {
    this.createTaskForm.markAllAsTouched();
    this.createTaskForm.updateValueAndValidity();
    console.log(this.createTaskForm.value);
  }

  public cancel(): void {
    this.store.dispatch(closeSidebarFormAction());
  }

}
