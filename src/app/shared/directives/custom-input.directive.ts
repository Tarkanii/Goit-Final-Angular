import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appInput]'
})
export class InputDirective {

  constructor(
    private element: ElementRef<HTMLElement>, 
    private ngControl: NgControl
  ) { }

  @HostListener('focus') public onInputFocus(): void {
    this.element.nativeElement.parentElement?.classList.add('float-label');
  }

  @HostListener('blur') public onInputBlur(): void {
    if (this.ngControl.control?.value) return;
    this.element.nativeElement.parentElement?.classList.remove('float-label');
  }
}
