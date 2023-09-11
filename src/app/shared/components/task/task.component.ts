import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { FormsService } from 'src/app/services/forms.service';
import { ITask } from '../../interfaces/project';
import { IStore } from '../../interfaces/store';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { changeTaskNameAction, changeTaskSpentHoursAction, deleteTaskAction } from 'src/app/store/projects/task/task.actions';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnChanges {

  @Input() public task!: ITask;
  @Input() public sprintId!: string;
  @Input() public sprintDate!: Date | null;
  public dateFormat: string = 'dd.MM.yyyy';
  public changeNameControl!: FormControl;
  public spentHoursDayControl!: FormControl;
  public minValue: number = 0;
  public maxValue: number = 24;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private store: Store<IStore>,
    private formsService: FormsService,
    private scrollStrategyOptions: ScrollStrategyOptions
  ) { }

  ngOnInit(): void {
    this.changeNameControl = this.formBuilder.control(this.task.name);
    this.updateSpentHoursDayControl();
  }

  ngOnChanges(): void {
    // Setting new control on task or date changing
    this.updateSpentHoursDayControl();
  }

  // Changing name of task
  public changeName(): void {
    const newName = this.changeNameControl.value.trim();
    if (!newName.length || newName === this.task.name) {
      this.changeNameControl.setValue(this.task.name);
      return;
    }
    
    this.store.dispatch(changeTaskNameAction({ id: this.task._id, name: newName, sprint: this.sprintId }));
    this.changeNameControl.setValue(this.task.name);
  }

  // Changing hours spent in day provided by user
  public changeHours(): void {
    const newValue = this.spentHoursDayControl.value.trim();
    if (this.spentHoursDayControl.invalid && this.spentHoursDayControl.touched ||
        Number(newValue) === Number(this.getSpentHours())) {
      this.spentHoursDayControl.setValue(this.getSpentHours());
      return;
    }

    this.store.dispatch(changeTaskSpentHoursAction({ id: this.task._id, date: this.getFormattedDate(), hours: Number(newValue) }));
  }

  // Setting 'spent hours in day' control
  private updateSpentHoursDayControl(): void {
    this.spentHoursDayControl = this.formBuilder.control(this.getSpentHours(), this.formsService.hoursValidator(this.minValue, this.maxValue));
  }

  // Getting hours spent on the task in the day provided by user
  private getSpentHours(): string {
    const formattedSprintDate = this.getFormattedDate();
    const spentDay = this.task.spentHoursDay.find((value: { date: string, hours: number }) => value.date === formattedSprintDate);
    return spentDay ? spentDay.hours.toString() : '0';
  }

  private getFormattedDate(): string {
    return `${this.sprintDate?.getFullYear()}-${this.sprintDate?.getMonth() && String(this.sprintDate?.getMonth() + 1).padStart(2, '0')}-${String(this.sprintDate?.getDate()).padStart(2, '0')}`;
  }

  public delete(event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        question: 'TASKS.DELETE_CONFIRMATION'
      },
      width: '450px',
      autoFocus: false,
      scrollStrategy: this.scrollStrategyOptions.noop()
    });

    dialogRef.afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(deleteTaskAction({ id: this.task._id, name: this.task.name }));
      })
  }

  // On enter click in spent hours input, we trigger blur, which calls changeHours function
  public onKeyUp(event: KeyboardEvent): void {
    // 13 - Enter
    if (event.keyCode !== 13) return;
    (event.target as HTMLElement).blur();
  }

}
