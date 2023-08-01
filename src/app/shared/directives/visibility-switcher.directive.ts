import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appVisibilitySwitcher]'
})
export class VisibilitySwitcherDirective {

  constructor(
    private elementRef: ElementRef
  ) { }

  @HostListener('click') public onClick(): void {
    const passwordInput = (this.elementRef.nativeElement as HTMLElement).parentElement?.querySelector('input');
    if (!passwordInput) return;

    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';

    if (passwordInput.type === 'password') {
      (this.elementRef.nativeElement as HTMLElement).classList.remove('open');
    } else {
      (this.elementRef.nativeElement as HTMLElement).classList.add('open');
    }
  }

}
