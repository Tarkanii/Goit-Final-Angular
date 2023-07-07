import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { deleteProjectAction } from 'src/app/store/projects/projects.actions';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  @Input() public name: string = '';
  @Input() public description: string = '';
  @Input() public id: string = '';

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public delete(event: Event): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        question: "PROJECTS.DELETE_CONFIRMATION"
      }
    });

    dialogRef.afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => this.store.dispatch(deleteProjectAction({ id: this.id, name: this.name })))
  }

}
