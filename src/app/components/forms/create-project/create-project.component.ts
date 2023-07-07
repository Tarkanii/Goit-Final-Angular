import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IStore } from 'src/app/shared/interfaces/store';
import { addProjectAction, closeAddProjectFormAction } from 'src/app/store/projects/projects.actions';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

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

  ngOnInit(): void {
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

  // Cancel project creating

  public cancelProjectCreating(): void {
    this.store.dispatch(closeAddProjectFormAction());
  }

}
