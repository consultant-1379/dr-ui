import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonMode } from '@erad/components/button';
import { DnrFailure } from 'src/app/models/dnr-failure.model';


export interface FailureDisplayDialogData {
  failure: DnrFailure
  titleKey?: string
}

/**
 * Component content for a dialog error message
 * to display error message with an error code
 */
@Component({
  selector: 'dnr-failure-display-dialog',
  templateUrl: './failure-display-dialog.component.html',
  styleUrls: ['./failure-display-dialog.component.scss']
})
export class FailureDisplayDialogComponent {

  buttonMode = ButtonMode;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public failureData: FailureDisplayDialogData,
    public dialogRef: MatDialogRef<FailureDisplayDialogComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
