import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IStore } from 'src/app/shared/interfaces/store';
import { addProjectAction, setSidebarFormAction } from 'src/app/store/projects/projects.actions';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {

  public createProjectForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<IStore>
  ) { 
    this.createProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ''
    })
  }

  // Getters

  public get nameControl(): AbstractControl | null {
    return this.createProjectForm.get('name');
  }

  public get descriptionControl(): AbstractControl | null {
    return this.createProjectForm.get('description');
  }

  // Submitting create project form
  public submit(): void {
    this.createProjectForm.markAllAsTouched();
    this.createProjectForm.updateValueAndValidity();

    if (this.createProjectForm.invalid) return;
    this.store.dispatch(addProjectAction(this.createProjectForm.value));
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
