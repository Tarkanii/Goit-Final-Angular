import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject, filter, takeUntil } from 'rxjs';

@Directive({
  selector: '[appInput]'
})
export class InputDirective implements OnInit, OnDestroy {

  @Input() public email: boolean = false;
  @Input() public text: boolean = false;
  @Input() public numberOnly: boolean = false;
  @Input() public calendar: boolean = false;

  private spaceRegExp: RegExp= new RegExp(/[\ ]/g);
  private calendarRegExp: RegExp = new RegExp(/[^0-9\-]/g);
  private numberOnlyRegExp: RegExp = new RegExp(/[^0-9\.\-]/g);
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private element: ElementRef<HTMLElement>, 
    private ngControl: NgControl
  ) { }

  ngOnInit(): void {
    if (!this.calendar && !this.numberOnly) return;

    this.ngControl.control?.valueChanges
      .pipe(
        filter((value) => value.length),
        takeUntil(this.unsubscribe$)
        )
      .subscribe(() => this.element.nativeElement.parentElement?.classList.add('float-label'))
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @HostListener('focus') public onInputFocus(): void {
    this.element.nativeElement.parentElement?.classList.add('float-label');
  }

  @HostListener('blur') public onInputBlur(): void {
    if (this.email || this.calendar) {
      this.ngControl.control?.setValue(this.getNewValue(this.email ? this.spaceRegExp : this.calendarRegExp));
    }

    if (this.numberOnly && this.ngControl.control?.value) {
      this.updateNumberOnlyValue();
    }

    if (this.text) {
      this.ngControl.control?.setValue(this.ngControl.control?.value?.trim());
    }

    if (this.ngControl.control?.value || this.ngControl.control?.value === 0) return;

    this.element.nativeElement.parentElement?.classList.remove('float-label');
  }

  @HostListener('keydown', ['$event']) public onKeyDown({key, keyCode}: KeyboardEvent): boolean {
    if (!this.email) return true;

    // 32 - code of 'space' key, we don't allow user to type space in email input
    return keyCode !== 32;
  }

  @HostListener('keyup', ['$event']) public onKeyUp({ keyCode, ctrlKey }: KeyboardEvent): void {
    if (!this.email && !this.calendar && !this.numberOnly) return;

    // 86 - code of 'v' key
    // 17 - code of 'ctrl' key, we remove all the spaces, when user tries to paste them
    if (keyCode === 86 && ctrlKey || keyCode === 17) {
      if (this.numberOnly) {
        this.updateNumberOnlyValue();
      } else {
        this.ngControl.control?.setValue(this.getNewValue(this.email ? this.spaceRegExp : this.calendarRegExp));
      }
    }
  }

  @HostListener('paste', ['$event']) public onPaste(event: any): void {
    if (!this.email && !this.calendar && !this.numberOnly) return;

    if (this.numberOnly) {
      this.updateNumberOnlyValue();
    } else {
      this.ngControl.control?.setValue(this.getNewValue(this.email ? this.spaceRegExp : this.calendarRegExp));
    }
  }

  // Returns control's value without symbols which match regular expression
  private getNewValue(regexp: RegExp): string {
    return this.ngControl.control?.value.replace(regexp, '');
  }

  // Updates numberOnly value, so it has only numbers and one possible dot
  private updateNumberOnlyValue(): void {
    const value = this.getNewValue(this.numberOnlyRegExp).replace(/\./, '*').replace(/\./g, '').replace(/\*/, '.');
    if (isNaN(Number(value)) || !value) {
      this.ngControl.control?.setValue('');
    } else {
      this.ngControl.control?.setValue(Number(value).toFixed(2));
    }
  }
}
