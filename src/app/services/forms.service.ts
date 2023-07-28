import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RequestsService } from './requests.service';
import { IPasswordRules, IValidationResponse, IValidationRules } from '../shared/interfaces/validation';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  public validationRulesObtained$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private emailRegExp!: RegExp;
  private numbersRegExp: RegExp = new RegExp('[0-9]');
  private capitalsRegExp: RegExp = new RegExp('[A-Z]');
  private specialSymbolsRegExp: RegExp = new RegExp('[\\W_]');
  private dateRegExp: RegExp = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
  private passwordValidationRules!: IPasswordRules;


  constructor(
    private requestsService: RequestsService
  ) { }

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

  public dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) return { required: true };

      if (!this.dateRegExp.test(control.value)) return { format: true };

      const [year, month, day] = control.value.split('-');
      const currentDate = new Date();
      if ( year < currentDate.getFullYear() || year > 2050 ) return { year: true };

      if ( month < 1 || month > 12 ) return { month: true };

      const amountOfDays = new Date(year, month, 0).getDate();
      if ( day > amountOfDays || day < 1 ) return { day: true };

      return null;
    }
  }

  public hoursValidator(minHours: number, maxHours?: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) return { required: true };

      if (Number(control.value) < minHours) return { min: true };

      if (maxHours && Number(control.value) > maxHours) return { max: true }

      return null;
    }
  }

  public get passwordMinLength(): number {
    return this.passwordValidationRules?.min_length;
  }

  public getValidationRules(): void {
    if (this.validationRulesObtained$.value) return;
    this.requestsService.getValidationRules()
      .pipe(
        map(({ data }: IValidationResponse) => data),
        take(1)
        )
      .subscribe(({ password, email }: IValidationRules) => {
        this.passwordValidationRules = password;
        this.emailRegExp = new RegExp(email);
        this.validationRulesObtained$.next(true);
      }, (error) => console.log('error', error.status, error.message))
  }
  
}
