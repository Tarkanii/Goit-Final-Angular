import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { FormsService } from 'src/app/services/forms.service';
import { IStore } from 'src/app/shared/interfaces/store';
import { closeSidebarFormAction } from 'src/app/store/projects/projects.actions';
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
      duration: ['', this.durationValidator()],
      startDate: ['', this.formsService.dateValidator()],
      endDate: ['', [this.formsService.dateValidator(), this.endDateValidator()]]
    })
  }

  public getControl(control: string): AbstractControl | null {
    return this.createSprintForm?.get(control);
  }

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

  private durationValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) return { required: true };

      if (Number(control.value) < 1) return { min: true };

      return null;
    }
  }

  public setCalendarOpen(value: 'end' | 'start' | null): void {
    this.calendarOpen = value;
  }

  public setDate(control: string, value: Date): void {
    const dateValue = `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${value.getDate().toString().padStart(2, '0')}`;
    this.getControl(control)?.setValue(dateValue);
  }

  public getDate(control: string): Date | null {
    if (this.getControl(control)?.invalid) return null;
    
    return new Date(this.getControl(control)?.value);
  }

  public mustShowDifferenceError(): boolean {
    return this.getControl('endDate')?.errors?.['difference'] && Object.keys(this.getControl('endDate')?.errors || {}).length;
  }

  public submit(): void {
    this.createSprintForm.markAllAsTouched()
    for (const control in this.createSprintForm.controls) {
      this.createSprintForm.get(control)?.updateValueAndValidity();
    }

    if (this.createSprintForm.invalid) return;
    this.store.dispatch(addSprintAction({...this.createSprintForm.value, project: this.projectId }));
  }

  public cancel(): void {
    this.store.dispatch(closeSidebarFormAction());
  }

}
