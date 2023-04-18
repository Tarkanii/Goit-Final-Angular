import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  public loginForm: FormGroup;
  public passwordMinLength: number = this.formsService.passwordMinLength;

  constructor(
    private formBuilder: FormBuilder,
    private formsService: FormsService
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', this.formsService.emailValidator],
      password: ['', this.formsService.passwordValidator]
    });
  }

  ngOnInit(): void {
  }
  
  public get emailControl(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  public get passwordControl(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  public submit(): void {
    console.log('form', this.loginForm.value);
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();
  }

}
