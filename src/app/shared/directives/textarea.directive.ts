import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appTextarea]'
})
export class TextareaDirective implements OnInit, OnDestroy, AfterViewInit {

  private controlValueSubscription!: Subscription | undefined;
  private resizeObserver: ResizeObserver = new ResizeObserver(() => this.setHeight());
  @Input() public id: string = '';
  @Output() private enterClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private ngControl: NgControl
  ) { }

  ngOnInit(): void {
    this.setNgControlSubscription();
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  ngOnChanges(): void {
    this.setNgControlSubscription();
    this.setHeight();
  }

  ngOnDestroy(): void {
    this.controlValueSubscription?.unsubscribe();
    this.resizeObserver.unobserve(this.elementRef.nativeElement);
  }

  @HostListener('keydown.enter') private onEnterClick(): boolean {
    this.enterClicked.emit();
    this.elementRef.nativeElement.blur();
    return false;
  }

  // Function sets height of textarea, so user won't see any scroll
  private setHeight(): void {
    if (Number.parseFloat(this.elementRef.nativeElement.style.height) === this.elementRef.nativeElement.scrollHeight) return;
    this.elementRef.nativeElement.removeAttribute('style');
    const scrollHeight = this.elementRef.nativeElement.scrollHeight;
    this.elementRef.nativeElement.style.height = `${scrollHeight}px`;
  }

  private setNgControlSubscription(): void {
    this.controlValueSubscription = this.ngControl.valueChanges?.subscribe(() => this.setHeight());
  }
}
