import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { ISprint } from '../../interfaces/project';
import { IStore } from '../../interfaces/store';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { deleteSprintAction } from 'src/app/store/projects/sprint/sprint.actions';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {
  
  @Input() public sprint!: ISprint;
  public dateFormat: string = 'dd MMM y';

  constructor(
    private dialog: MatDialog,
    private store: Store<IStore>,
    private router: Router,
    private scrollStrategyOptions: ScrollStrategyOptions
  ) { }

  ngOnInit(): void {
  }

  public navigateTo(): void { 
    this.router.navigateByUrl(`${this.router.url}/${this.sprint._id}/tasks`);
  }

  public delete(event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        question: 'SPRINTS.DELETE_CONFIRMATION'
      },
      width: '450px',
      autoFocus: false,
      scrollStrategy: this.scrollStrategyOptions.noop()
    });

    dialogRef.afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(deleteSprintAction({ id: this.sprint._id, name: this.sprint.name }));
      })
  }

}
