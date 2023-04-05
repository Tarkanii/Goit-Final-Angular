import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  public registerForm: FormGroup;
  public passwordMinLength: number = this.formsService.passwordMinLength;

  constructor(
    private formBuilder: FormBuilder,
    private formsService: FormsService
  ) { 
    this.registerForm = this.formBuilder.group({
      email: ['', this.formsService.emailValidator],
      password: ['', this.formsService.passwordValidator],
      repeatPassword: ['', this.repeatPasswordValidator],
    });
  }

  ngOnInit(): void {
  }

  // Getters

  public get emailControl(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  public get passwordControl(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  public get repeatPasswordControl(): AbstractControl | null {
    return this.registerForm.get('repeatPassword');
  }

  // Validators
  
  private get repeatPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) return { required: true };

      if (this.passwordControl?.valid && this.passwordControl?.value !== control.value) return { mismatch: true }; 

      return null;
    }
  }

  // Register

  public register(): void {
    console.log('form:', this.registerForm?.value);
    this.registerForm.markAllAsTouched();
    for ( const control in this.registerForm.controls ) {
      this.registerForm.get(control)?.updateValueAndValidity();
    }
  }

}
