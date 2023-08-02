import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appTextarea]'
})
export class TextareaDirective implements AfterViewInit {

  @Output() private enterClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    const resizeObserver = new ResizeObserver(() => { this.setHeight(); });
    resizeObserver.observe(this.elementRef.nativeElement);
  }

  @HostListener('keydown.enter') private onEnterClick(): boolean {
    this.enterClicked.emit();
    this.elementRef.nativeElement.blur();
    return false;
  }

  @HostListener('keyup') private onKeyUp(): void {
    this.setHeight();
  }

  // Function sets height of textarea, so user won't see any scroll
  private setHeight(): void {
    this.elementRef.nativeElement.removeAttribute('style');
    const scrollHeight = this.elementRef.nativeElement.scrollHeight;
    this.elementRef.nativeElement.style.height = `${scrollHeight}px`;
  }

}
