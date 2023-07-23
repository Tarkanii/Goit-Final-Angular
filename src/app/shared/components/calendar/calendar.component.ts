import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDay } from '../../interfaces/calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  public currentDate: Date = new Date();
  @Input() public selectedDate: Date | null = null;
  @Input() public startDate: string | null = null;
  @Input() public endDate: string | null = null;
  @Output() public dateSelected: EventEmitter<Date> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    if (!this.selectedDate) {
      this.selectedDate = this.currentDate;
    } else {
      this.currentDate = this.selectedDate;
    }
  }

  // Getters

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  get currentMonth(): number {
    return this.currentDate.getMonth();
  }

  get daysList(): IDay[] {
    const previousMonth = new Date(this.currentYear, this.currentMonth, 0);
    const lastDateOfSelectedMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysList = [];

    for (let i = previousMonth.getDay() - 1; i >= 0; i--) {
      daysList.push({ inactive: true, value: previousMonth.getDate() - i, selected: false });
    }
 
    for (let i = 1; i <= lastDateOfSelectedMonth.getDate(); i++) {
      const selected = this.currentYear === this.selectedDate?.getFullYear() &&
        this.currentMonth === this.selectedDate?.getMonth() && this.selectedDate?.getDate() === i;
      const inactive = this.shouldBeInactive(i);
      daysList.push({ inactive, value: i, selected: !!selected });
    }

    if (lastDateOfSelectedMonth.getDay() === 0) return daysList;

    for (let i = 0; i <= 6 - lastDateOfSelectedMonth.getDay(); i++) {
      daysList.push({ inactive: true, value: i + 1, selected: false });
    }

    return daysList;
  }

  // Actions

  public changeMonth(action: 'previous' | 'next'): void {
    if (action === 'next' && !this.shouldStop(action)) {
      this.currentDate = new Date(this.currentYear, this.currentMonth + 1);
    } else if (action === 'previous' && !this.shouldStop(action)) {
      this.currentDate = new Date(this.currentYear, this.currentMonth - 1);
    }
  }

  public shouldStop(action: 'previous' | 'next'): boolean {
    if (!this.startDate && !this.endDate) return false;

    const newDate = new Date(this.currentYear, action === 'next' ? this.currentMonth + 1 : this.currentMonth -1);
    if (action === 'next' && this.endDate) {
      const endDate = new Date(this.endDate);
      if ((newDate.getFullYear() > endDate.getFullYear()) || 
          (newDate.getFullYear() === endDate.getFullYear() && endDate.getMonth() < newDate.getMonth())) {
        return true;
      }
    }

    if (action === 'previous' && this.startDate) {
      const startDate = new Date(this.startDate);
      if ((newDate.getFullYear() < startDate.getFullYear()) || 
          (newDate.getFullYear() === startDate.getFullYear() && startDate.getMonth() > newDate.getMonth())) {
        return true;
      }
    }
    
    return false;
  }

  public shouldBeInactive(day: number): boolean {
    if (!this.startDate && !this.endDate) return false;

    if (this.startDate) {
      const startDate = new Date(this.startDate);
      if (startDate.getFullYear() === this.currentYear &&
        startDate.getMonth() === this.currentMonth && startDate.getDate() > day) {
        return true;
      }
    } 
    
    if (this.endDate) {
      const endDate = new Date(this.endDate);
      if (endDate.getFullYear() === this.currentYear &&
        endDate.getMonth() === this.currentMonth && endDate.getDate() < day) {
        return true;
      }
    }

    return false;
  }

  public selectDate({ value, inactive }: IDay): void {
    if (inactive) return;
    this.selectedDate = new Date(this.currentYear, this.currentMonth, value);
    this.dateSelected.emit(this.selectedDate);
  }

}
