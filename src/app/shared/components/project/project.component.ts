import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { deleteProjectAction } from 'src/app/store/projects/projects.actions';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';


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

  public navigateToProject(): void {
    this.router.navigateByUrl(`projects/${this.id}/sprints`);
  } 
}
