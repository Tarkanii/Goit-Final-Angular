import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IInformationDialogData } from '../../interfaces/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IInformationDialogData,
  ) { }

}
