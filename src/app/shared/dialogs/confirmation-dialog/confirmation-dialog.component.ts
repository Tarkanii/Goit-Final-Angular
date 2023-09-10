import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IConfirmationDialogData } from '../../interfaces/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IConfirmationDialogData,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) { }

  public onClick(decision: boolean): void {
    this.dialogRef.close(decision);
  }

}
