import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appChartContainer]'
})
export class ChartContainerDirective implements AfterViewInit, OnDestroy {

  @Input() public chartHeight!: number;
  private tabletWidth!: number;
  private resizeObserver!: ResizeObserver;
  private htmlElement: HTMLElement = this.elementRef.nativeElement as HTMLElement;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this.tabletWidth = this.getTabletWidth();
    this.resizeObserver = new ResizeObserver(() => this.setMaxHeight());
    this.resizeObserver.observe(document.body);
    this.setMaxHeight();
  }

  ngOnDestroy(): void {
    this.resizeObserver.unobserve(document.body);
  }

  // Setting max-height for chart container so overflow protperty applies to it
  private setMaxHeight(): void {
    const windowWidth = window.innerWidth;
    if (windowWidth < this.tabletWidth && this.htmlElement.style.maxHeight === '100%') {
      return;
    } else if (windowWidth < this.tabletWidth) {
      this.htmlElement.style.maxHeight = '100%';
      return;
    }

    const windowHeight = window.innerHeight;
    const maxDialogHeight = windowHeight * 0.8;

    if (this.chartHeight + 60 <= maxDialogHeight) {
      this.htmlElement.style.maxHeight = '100%';
      return;
    }

    if (this.htmlElement.style.maxHeight === `${maxDialogHeight - 60}px`) return;
    
    this.htmlElement.style.maxHeight = `${maxDialogHeight - 60}px`;  
  }

  // Getting width when we apply tablet styles to document 
  private getTabletWidth(): number {
    const container = document.querySelector('.container');
    const tabletWidth = getComputedStyle(container as Element).getPropertyValue('--tablet');
    return Number.parseFloat(tabletWidth);
  }

}
