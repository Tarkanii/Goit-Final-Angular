import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ISprint } from '../../interfaces/project';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { IStore } from '../../interfaces/store';
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
    private store: Store<IStore>
  ) { }

  ngOnInit(): void {
  }

  public delete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        question: 'SPRINTS.DELETE_CONFIRMATION'
      }
    });

    dialogRef.afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(deleteSprintAction({ id: this.sprint._id, name: this.sprint.name }));
      })
  }

}
