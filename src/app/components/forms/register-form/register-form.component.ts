import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FormsService } from 'src/app/services/forms.service';
import { registerAction } from 'src/app/store/user/user.actions';

@Component({
  selector: '[app-register-form]',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  public registerForm!: FormGroup;
  public passwordMinLength: number = this.formsService.passwordMinLength;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private formsService: FormsService
  ) { }

  ngOnInit(): void {
    this.formsService.validationRulesObtained$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.passwordMinLength = this.formsService.passwordMinLength;
        this.initRegisterForm();
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', this.formsService.emailValidator],
      password: ['', this.formsService.passwordValidator],
      repeatPassword: ['', this.repeatPasswordValidator],
    });
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

  // Submitting register form
  public submit(): void {
    this.registerForm.markAllAsTouched();
    for (const control in this.registerForm.controls) {
      this.registerForm.get(control)?.updateValueAndValidity();
    }

    if (this.registerForm.invalid) return;
    const { email, password } = this.registerForm?.value;
    this.store.dispatch(registerAction({ email, password }));
  }

  // Submits form if user clicked Enter
  public onKeyUp(event: KeyboardEvent): void {
    if (event.keyCode !== 13) return;
    this.submit();
  }

}
