import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { Observable, filter, switchMap, take } from 'rxjs';
import { deleteParticipantAction, deleteProjectAction } from 'src/app/store/projects/projects.actions';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { emailSelector } from 'src/app/store/user/user.selectors';
import { IStore } from '../../interfaces/store';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  @Input() public name: string = '';
  @Input() public description: string = '';
  @Input() public owner: boolean = false;
  @Input() public id: string = '';
  private email$: Observable<string> = this.store.select(emailSelector);

  constructor(
    private store: Store<IStore>,
    private dialog: MatDialog,
    private router: Router,
    private scrollStrategyOptions: ScrollStrategyOptions
  ) { }

  ngOnInit(): void {
  }

  public delete(event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        question: "PROJECTS.DELETE_CONFIRMATION"
      },
      width: '450px',
      autoFocus: false,
      scrollStrategy: this.scrollStrategyOptions.noop()
    });

    dialogRef.afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => this.store.dispatch(deleteProjectAction({ id: this.id, name: this.name })))
  }

  public leave(event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        question: "PARTICIPANTS.LEAVE_CONFIRMATION"
      },
      width: '450px',
      autoFocus: false,
      scrollStrategy: this.scrollStrategyOptions.noop()
    });

    dialogRef.afterClosed()
      .pipe(take(1), filter(Boolean), switchMap(() => this.email$))
      .subscribe((email) => {
        this.store.dispatch(deleteParticipantAction({ id: this.id, email }));
      })
  }

  public navigateToProject(): void {
    this.router.navigateByUrl(`projects/${this.id}/sprints`);
  } 
}
