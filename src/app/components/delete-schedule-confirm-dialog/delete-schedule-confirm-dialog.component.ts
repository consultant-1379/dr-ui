import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { ButtonMode } from '@erad/components/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Display delete schedule confirmation dialog.
 * Includes checkbox option to also delete all jobs associated with the schedule.
 */
@Component({
  selector: 'dnr-delete-schedule-confirm-dialog',
  templateUrl: './delete-schedule-confirm-dialog.component.html',
  styleUrls: ['./delete-schedule-confirm-dialog.component.scss']
})
export class DeleteScheduleConfirmDialogComponent {

  /**
   * Event sent when user confirms wishes to delete schedule.
   *
   * Emits 'deleteJobsSelected' as true if user
   * also wishes to delete all jobs associated with the schedule.
   */
  @Output()
  confirmScheduleDeleteEvent: EventEmitter<{ deleteJobsSelected: boolean }> = new EventEmitter<{ deleteJobsSelected: boolean }>();

  /**
   * Cancel button pressed event.
   */
  @Output()
  cancelScheduleDeleteEvent: EventEmitter<void> = new EventEmitter<void>();

  /**
   * true if user selects to also delete
   * all jobs associated with the schedule (checkbox)
   */
  deleteJobsSelected: boolean;

  disableDeleteButton: boolean;
  buttonMode = ButtonMode;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      scheduleName: string
      totalJobsCount: number
    },
    readonly dialogRef: MatDialogRef<DeleteScheduleConfirmDialogComponent>,
  ) { }

  onDeleteJobsCheckboxChange(event: any): void {
    this.deleteJobsSelected = event.target.checked;
  }

  onDeleteSchedule() {
    this.disableDeleteButton = true; // prevent double click

    this.confirmScheduleDeleteEvent.emit({
      deleteJobsSelected: this.deleteJobsSelected
    });
    this.dialogRef.close();
  }

  onCancel() {
    this.cancelScheduleDeleteEvent.emit();
    this.dialogRef.close();
  }
}
