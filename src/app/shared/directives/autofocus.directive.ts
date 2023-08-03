import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

  constructor(
    private element: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this.element.nativeElement.focus();
  }
}
