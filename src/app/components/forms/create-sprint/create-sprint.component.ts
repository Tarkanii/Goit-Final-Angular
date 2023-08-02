import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { FormsService } from 'src/app/services/forms.service';
import { IStore } from 'src/app/shared/interfaces/store';
import { setSidebarFormAction } from 'src/app/store/projects/projects.actions';
import { addSprintAction } from 'src/app/store/projects/sprint/sprint.actions';

@Component({
  selector: 'app-create-sprint',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.scss']
})
export class CreateSprintComponent implements OnInit, OnDestroy {

  public createSprintForm!: FormGroup;
  public calendarOpen: 'end' | 'start' | null = null;
  public currentYear: string = new Date().getFullYear().toString();
  public projectId: string = '';

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store<IStore>,
    private formsService: FormsService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.activatedRoute.firstChild?.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ projectId }) => {
        this.projectId = projectId;
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public initForm(): void {
    this.createSprintForm = this.formBuilder.group({
      name: ['', Validators.required],
      startDate: ['', this.formsService.dateValidator()],
      endDate: ['', [this.formsService.dateValidator(), this.endDateValidator()]]
    })
  }

  public getControl(control: string): AbstractControl | null {
    return this.createSprintForm?.get(control);
  }

  // Validator for the endDate
  private endDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDateControl = this.getControl('startDate');
      if (!startDateControl || !startDateControl.valid) return null;

      const startDate = new Date(startDateControl.value).getTime();
      const endDate = new Date(control.value).getTime();
      if (startDate >= endDate) return { difference: true }

      return null;
    }
  }

  // Calendar can be opened only for one field (endDate or startDate) or it should be closed
  public setCalendarOpen(value: 'end' | 'start' | null): void {
    this.calendarOpen = value;
  }

  // Sets formatted date, when the date was selected in the calendar component
  public setDate(control: string, value: Date): void {
    const dateValue = `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${value.getDate().toString().padStart(2, '0')}`;
    this.getControl(control)?.setValue(dateValue);
  }

  // Gets startDate or endDate for calendar if control is valid  
  public getDate(control: string): Date | null {
    if (this.getControl(control)?.invalid) return null;
    
    return new Date(this.getControl(control)?.value);
  }

  // Returns whether we must show error about the difference between the start date and the end date of sprint or not 
  public mustShowDifferenceError(): boolean {
    return this.getControl('endDate')?.errors?.['difference'] && Object.keys(this.getControl('endDate')?.errors || {}).length;
  }

  // Submitting create sprint form
  public submit(): void {
    this.createSprintForm.markAllAsTouched()
    for (const control in this.createSprintForm.controls) {
      this.createSprintForm.get(control)?.updateValueAndValidity();
    }

    if (this.createSprintForm.invalid) return;
    this.store.dispatch(addSprintAction({...this.createSprintForm.value, project: this.projectId }));
  }

  // Closes sidebar form if user clicked cancel button
  public cancel(): void {
    this.store.dispatch(setSidebarFormAction({ form: null }));
  }

  // Submits form if user clicked Enter
  public onKeyUp(event: KeyboardEvent): void {
    if (event.keyCode !== 13) return;
    this.submit();
  }

}
