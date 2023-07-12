import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appInput]'
})
export class InputDirective {

  @Input() public email: boolean = false;
  @Input() public text: boolean = false;
  private spaceRegExp = new RegExp('[\ ]', 'g')

  constructor(
    private element: ElementRef<HTMLElement>, 
    private ngControl: NgControl
  ) { }

  @HostListener('focus') public onInputFocus(): void {
    this.element.nativeElement.parentElement?.classList.add('float-label');
  }

  @HostListener('blur') public onInputBlur(): void {
    if (this.email) {
      this.ngControl.control?.setValue(this.getNewValue(this.spaceRegExp));
    }

    if (this.text) {
      this.ngControl.control?.setValue(this.ngControl.control?.value?.trim());
    }

    if (this.ngControl.control?.value) return;

    this.element.nativeElement.parentElement?.classList.remove('float-label');
  }

  @HostListener('keydown', ['$event']) public onKeyDown({ keyCode }: KeyboardEvent): boolean {
    if (!this.email) return true;

    // 32 - code of 'space' key, we don't allow user to type space in email input
    return keyCode !== 32;
  }

  @HostListener('keyup', ['$event']) public onKeyUp({ keyCode, ctrlKey }: KeyboardEvent): void {
    if (!this.email) return;

    // 86 - code of 'v' key
    // 17 - code of 'ctrl' key, we remove all the spaces, when user tries to paste them
    if (keyCode === 86 && ctrlKey || keyCode === 17) {
      this.ngControl.control?.setValue(this.getNewValue(this.spaceRegExp));
    }
  }

  // Returns control's value without symbols which match regular expression
  private getNewValue(regexp: RegExp): string {
    return this.ngControl.control?.value.replace(regexp, '');
  }
}
