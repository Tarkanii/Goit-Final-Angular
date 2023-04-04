import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }
  
  public get loginControl(): AbstractControl | null {
    return this.loginForm.get('login');
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
