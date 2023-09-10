import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FormsService } from 'src/app/services/forms.service';
import { loginAction } from 'src/app/store/user/user.actions';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnDestroy {

  public loginForm!: FormGroup;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private formsService: FormsService
  ) {
    this.formsService.validationRulesObtained$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.initLoginForm();
      })
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

  // Submitting login form

  public submit(): void {
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();

    if (this.loginForm.invalid) return;
    this.store.dispatch(loginAction(this.loginForm?.value));
  }

  // Submits form if user clicked Enter
  public onKeyUp(event: KeyboardEvent): void {
    if (event.keyCode !== 13) return;
    this.submit();
  }

}
