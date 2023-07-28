import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { ITask } from '../../interfaces/project';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { IStore } from '../../interfaces/store';
import { changeTaskNameAction, changeTaskSpentHoursAction, deleteTaskAction } from 'src/app/store/projects/task/task.actions';
import { FormsService } from 'src/app/services/forms.service';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnChanges {

  @Input() public task!: ITask;
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
    this.updateSpentHoursDayControl();
  }

  public changeName(): void {
    const newName = this.changeNameControl.value.trim();
    if (!newName.length || newName === this.task.name) {
      this.changeNameControl.setValue(this.task.name);
      return;
    }
    
    this.store.dispatch(changeTaskNameAction({ id: this.task._id, name: newName }));
  }

  public changeHours(): void {
    const newValue = this.spentHoursDayControl.value.trim();
    if (this.spentHoursDayControl.invalid && this.spentHoursDayControl.touched ||
        Number(newValue) === Number(this.getSpentHours())) {
      this.spentHoursDayControl.setValue(this.getSpentHours());
      return;
    }

    this.store.dispatch(changeTaskSpentHoursAction({ id: this.task._id, date: this.getFormattedDate(), hours: Number(newValue) }));
  }

  private updateSpentHoursDayControl(): void {
    this.spentHoursDayControl = this.formBuilder.control(this.getSpentHours(), this.formsService.hoursValidator(this.minValue, this.maxValue));
  }

  private getSpentHours(): string {
    const formattedSprintDate = this.getFormattedDate();
    const spentDay = this.task.spentHoursDay.find((value: { date: string, hours: number }) => value.date === formattedSprintDate);
    return spentDay ? spentDay.hours.toString() : '0';
  }

  private getFormattedDate(): string {
    return `${this.sprintDate?.getFullYear()}-${this.sprintDate?.getMonth() && String(this.sprintDate?.getMonth() + 1).padStart(2, '0')}-${this.sprintDate?.getDate()}`;
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

}
