import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {

  public loginForm!: FormGroup;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private formsService: FormsService
  ) {
    this.formsService.validationRulesObtained$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.initLoginForm();
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', this.formsService.emailValidator],
      password: ['', Validators.required]
    });
  }

  // Getters
  
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
