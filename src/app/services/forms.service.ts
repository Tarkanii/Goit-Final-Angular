import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RequestsService } from './requests.service';
import { IPasswordRules, IValidationRules } from '../shared/interfaces/validation';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  public validationRulesObtained$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private emailRegExp!: RegExp;
  private numbersRegExp: RegExp = new RegExp('[0-9]');
  private capitalsRegExp: RegExp = new RegExp('[A-Z]');
  private specialSymbolsRegExp: RegExp = new RegExp('[\\W_]');
  private passwordValidationRules!: IPasswordRules;


  constructor(
    private requestsService: RequestsService
  ) {
    this.getValidationRules();
  }

  // Validators

  public get emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) return { required: true };

      if (!this.emailRegExp.test(control.value)) return { invalid: true }; 

      return null;
    }
  }

  public get passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) 
        return { required: true };

      if (control.value.length < this.passwordMinLength) 
        return { minLength: true };

      const { contain_numbers, contain_capitals, contain_special_symbols } = this.passwordValidationRules;
      if (contain_numbers && !this.numbersRegExp.test(control.value))
        return { containNumbers: true };

      if (contain_capitals && !this.capitalsRegExp.test(control.value))
        return { containCapitals: true };

      if (contain_special_symbols && !this.specialSymbolsRegExp.test(control.value))
        return { containSpecSymbols: true };

      return null;
    }
  }

  public get passwordMinLength(): number {
    return this.passwordValidationRules?.min_length;
  }

  private getValidationRules(): void {
    this.requestsService.getValidationRules()
      .pipe(
        map((result: { data: IValidationRules }) => result.data),
        take(1)
        )
      .subscribe(({ password, email }: IValidationRules) => {
        this.passwordValidationRules = password;
        this.emailRegExp = new RegExp(email);
        this.validationRulesObtained$.next(true);
      }, (error) => console.log('error', error.status, error.message))
  }
  
}
