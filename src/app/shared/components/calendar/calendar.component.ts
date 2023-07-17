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
      daysList.push({ inactive: false, value: i, selected: !!selected });
    }

    if (lastDateOfSelectedMonth.getDay() === 0) return daysList;

    for (let i = 0; i <= 6 - lastDateOfSelectedMonth.getDay(); i++) {
      daysList.push({ inactive: true, value: i + 1, selected: false });
    }

    return daysList;
  }

  // Actions

  public changeMonth(action: 'previous' | 'next'): void {
    if (action === 'next') {
      this.currentDate = new Date(this.currentYear, this.currentMonth + 1);
    } else {
      this.currentDate = new Date(this.currentYear, this.currentMonth - 1);
    }
  }

  public selectDate({ value, inactive }: IDay): void {
    if (inactive) return;
    this.selectedDate = new Date(this.currentYear, this.currentMonth, value);
    this.dateSelected.emit(this.selectedDate);
  }

}
