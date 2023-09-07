import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, filter, map, take, takeUntil } from 'rxjs';
import { FormsService } from 'src/app/services/forms.service';
import { IProject } from 'src/app/shared/interfaces/project';
import { IStore } from 'src/app/shared/interfaces/store';
import { addParticipantAction, setSidebarFormAction } from 'src/app/store/projects/projects.actions';
import { projectSelector } from 'src/app/store/projects/projects.selectors';
import { emailSelector } from 'src/app/store/user/user.selectors';

@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss']
})
export class AddPeopleComponent implements OnInit, OnDestroy {

  public addPeopleForm: FormGroup | null = null;
  public project$!: Observable<IProject | undefined>;
  public participantsList$!: Observable<String[]>;
  public projectId: string = '';
  private unsubscibe$: Subject<void> = new Subject();

  constructor(
    private store: Store<IStore>,
    private formBuilder: FormBuilder,
    private formService: FormsService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.formService.getValidationRules();

    this.formService.validationRulesObtained$
      .pipe(filter(Boolean), take(1))
      .subscribe(() => {
        this.addPeopleForm = this.formBuilder.group({
          email: ['', this.formService.emailValidator]
        })
      })
    
    this.projectId = this.router.url.split('/')[2];
    this.project$ = this.store.select(projectSelector(this.projectId));
    this.participantsList$ = combineLatest([this.project$, this.store.select(emailSelector)]).pipe(
      map(([project, email]) => {
        if (!project) return [];

        return project.participants.filter((participant: string) => participant !== email);
      }),
      takeUntil(this.unsubscibe$)
    );
  }

  ngOnDestroy(): void {
    this.unsubscibe$.next();
    this.unsubscibe$.complete();
  }

  // Getters

  public get emailControl(): AbstractControl | null {
    return this.addPeopleForm?.get('email') || null;
  }

  // Submitting add people form
  public submit(): void {
    this.addPeopleForm?.markAllAsTouched();
    this.addPeopleForm?.updateValueAndValidity();

    if (this.addPeopleForm?.invalid) return;
    this.store.dispatch(addParticipantAction({ id: this.projectId, email: this.addPeopleForm?.value.email }));
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
