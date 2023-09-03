import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDay } from '../../interfaces/calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  public currentDate: Date = new Date();
  public startWeekDay: number = 0;
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

    this.startWeekDay = previousMonth.getDay() + 1;
    for (let i = 1; i <= lastDateOfSelectedMonth.getDate(); i++) {
      const selected = this.currentYear === this.selectedDate?.getFullYear() &&
        this.currentMonth === this.selectedDate?.getMonth() && this.selectedDate?.getDate() === i;
      const inactive = this.shouldBeInactive(i);
      daysList.push({ inactive, value: i, selected: !!selected });
    }

    return daysList;
  }

  // Actions

  // Switches to the next or previous month
  public changeMonth(action: 'previous' | 'next'): void {
    if (action === 'next' && !this.shouldStop(action)) {
      this.currentDate = new Date(this.currentYear, this.currentMonth + 1);
    } else if (action === 'previous' && !this.shouldStop(action)) {
      this.currentDate = new Date(this.currentYear, this.currentMonth - 1);
    }
  }

  // Selects date if it's active and sends it to the parent 
  public selectDate({ value, inactive }: IDay): void {
    if (inactive) return;
    this.selectedDate = new Date(this.currentYear, this.currentMonth, value);
    this.dateSelected.emit(this.selectedDate);
  }

  // Stops user from switching months if the next month is more than endDate and if previous is less than startDate
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

  // Marks days as inactive if they are in different month(on the begining or the end of the calendar) 
  // or days are bigger than endDate os smaller then startDate 
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

}
