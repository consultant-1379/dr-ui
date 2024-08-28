import { EventEmitter, Injectable, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, filter, skip } from 'rxjs';
import { UnsubscribeAware, takeUntilDestroyed, } from '@erad/utils';

import { DeleteScheduleConfirmDialogComponent } from '../components/delete-schedule-confirm-dialog/delete-schedule-confirm-dialog.component';
import { DnrFailure } from '../models/dnr-failure.model';
import { FailureDisplayDialogComponent } from '../components/failure-display-dialog/failure-display-dialog.component';
import { Job } from '../models/job.model';
import { JobDetailsFacadeService } from '../lib/job-detail/services/job-details-facade.service';
import { JobScheduleDetailsFacadeService } from '../lib/job-schedule-details/services/job-schedule-details-facade.service';
import { JobsFacadeService } from '../lib/jobs/services/jobs-facade.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * This service handles deleting a schedule,
 * showing the confirm dialog and making the server call.
 *
 * The confirm dialog is bespoke as it includes a checkbox,
 * allowing the user to choose to also delete all jobs associated with the schedule.
 *
 * Two or Three API calls can happen, as follows:
 *
 * - jobsFacadeService: API call to display number of associated jobs that could be deleted
 *
 * - scheduleDetailsService: Delete schedule for schedule table row selection
 *
 * - jobDetailsFacadeService (optional): API call to delete associated jobs for the schedule
 *   should use choose to do so (checkbox option)
 *
 * If a server call fail occurs the error is presented on a dialog
 * (as opposed to an inline error message)
 */

@Injectable({
  providedIn: 'root'
})
@UnsubscribeAware()
export class DeleteScheduleHandlerService {

  /**
   * Schedule delete success emitted event
   * (emitted to request update of current schedule table)
   */
  @Output()
  deleteScheduleSuccessEvent: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Jobs associated with Schedule delete success emitted event
   */
  @Output()
  deleteFilteredJobsSuccessEvent: EventEmitter<string> = new EventEmitter<string>();

  jobScheduleId: string;
  scheduleName: string;
  deleteJobsSelected: boolean;

  jobsCountSuccess$: Observable<number> = this.jobsFacadeService.getItemsTotalCount();
  jobsCountFailure$: Observable<DnrFailure> = this.jobsFacadeService.getItemsFailure();

  scheduleDeleteSuccess$: Observable<boolean> = this.scheduleDetailsService.getJobScheduleDeleted();
  scheduleDeleteFailure$: Observable<DnrFailure> = this.scheduleDetailsService.getJobScheduleFailure();

  filteredJobsDeleteSuccess$: Observable<number> = this.jobDetailsFacadeService.getFilteredJobsDeleted();
  filteredJobsDeleteFailure$: Observable<DnrFailure> = this.jobDetailsFacadeService.getJobDetailsFailure();

  // lazy subscribing - noting that this is a service and won't be destroyed after use
  scheduleSubscriptions: any[] = [];
  jobDetailSubscriptions: any[] = [];
  jobsCountSubscriptions: any[] = [];


  constructor(
    readonly dialog: MatDialog,
    readonly translateService: TranslateService,
    readonly jobDetailsFacadeService: JobDetailsFacadeService,
    readonly jobsFacadeService: JobsFacadeService<Job>,
    readonly scheduleDetailsService: JobScheduleDetailsFacadeService,
    readonly errorDialog: MatDialog,
  ) { }

  /**
   * Send server call to delete schedule after user confirmation.
   *
   * Bespoke confirm dialog required as also showing checkbox
   * with option to delete all jobs associated with the schedule.
   *
   * @param id     id of schedule to delete
   * @param name   name of schedule to delete
   */
  deleteSchedule(id: string, name: string) {

    this.jobScheduleId = id;
    this.scheduleName = name;

    /* fetch total jobs count for message */
    this._subscribeToJobsCountEvents();

    const filter = `jobScheduleId==${this.jobScheduleId}`;
    this.jobsFacadeService.loadItems({ filters: filter });

  }

  _subscribeToJobsCountEvents() {
    this._unsubscribeFromJobsCountStore(); // take no chances with checking array length - need to open confirm dialog
    this.jobsCountSubscriptions.push(this._subscribeJobsCountSuccess());
    this.jobsCountSubscriptions.push(this._subscribeJobsCountFailure());
  }

  _subscribeJobsCountSuccess() {
    return this.jobsCountSuccess$?.pipe(
      skip(1), /* ensures one dialog launched only */
      filter(totalCount => totalCount >= 0),
      takeUntilDestroyed(this))
      .subscribe((totalCount) => {
        this._launchConfirmDeleteScheduleDialog(totalCount);
      });
  }

  _subscribeJobsCountFailure() {
    return this.jobsCountFailure$?.pipe(
      filter(failure => !!failure),
      takeUntilDestroyed(this))
      .subscribe(() => {
        this._launchConfirmDeleteScheduleDialog(null);
      });
  }

  /**
   * Launch confirm schedule delete dialog once
   * with a total job count to display if available
   * @param totalJobsCount  total jobs associated with schedule or null
   */
  _launchConfirmDeleteScheduleDialog(totalJobsCount: number) {

    this._unsubscribeFromJobsCountStore();
    this.jobsFacadeService.ClearFailureState();

    const data = {
      scheduleName: this.scheduleName,
      totalJobsCount: totalJobsCount  /* can be null or 0 */
    };
    const dialogRef = this.dialog.open(DeleteScheduleConfirmDialogComponent, {
      width: '500px',
      data
    });

    dialogRef.componentInstance?.confirmScheduleDeleteEvent.subscribe((observer) => {
      if (observer) {
        this.deleteJobsSelected = observer.deleteJobsSelected;
        this._onConfirmDeleteSchedule();
      }
    });
  }

  /**
   * User has confirmed delete schedule.
   *
   * May have also selected (checkbox) to delete
   * all jobs associated with the schedule
   */
  _onConfirmDeleteSchedule() {

    this.scheduleDetailsService.clearFailureState();
    this._subscribeToScheduleStoreEvents();

    this.scheduleDetailsService.deleteJobSchedule(
      this.jobScheduleId,
      this.scheduleName,
      true);  // show success notification

    if (this.deleteJobsSelected) { /* checkbox selected */
      this.jobDetailsFacadeService.clearFailureState();
      this._subscribeToFilterJobsDeleteEvents();

      this.jobDetailsFacadeService.deleteFilteredJobs({
        filters: `jobScheduleId==${this.jobScheduleId}`
      }, true);
    }
  }

  _subscribeToScheduleStoreEvents() {

    if (this.scheduleSubscriptions.length === 0) {
      this.scheduleSubscriptions.push(this._subscribeDeleteScheduleSuccess());
      this.scheduleSubscriptions.push(this._subscribeDeleteScheduleFailure());
    }
  }

  _subscribeToFilterJobsDeleteEvents() {
    if (this.jobDetailSubscriptions.length === 0) {
      this.jobDetailSubscriptions.push(this._subscribeDeleteFilterJobsSuccess());
      this.jobDetailSubscriptions.push(this._subscribeDeleteFilterJobsFailure());
    }
  }

  _subscribeDeleteScheduleSuccess() {
    return this.scheduleDeleteSuccess$?.pipe(
      filter(response => !!response),
      takeUntilDestroyed(this))
      .subscribe(() => {
        // when success, emit event so caller can refresh schedule table
        this.deleteScheduleSuccessEvent.emit(this.jobScheduleId);
        this._unsubscribeFromScheduleStore();
      });
  }

  _subscribeDeleteScheduleFailure() {
    return this.scheduleDeleteFailure$?.pipe(
      filter(failure => !!failure),
      takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        this._showErrorDialog(failure, 'FAILED_TO_DELETE_SCHEDULE_HEADER');
      });
  }

  _subscribeDeleteFilterJobsSuccess() {
    return this.filteredJobsDeleteSuccess$?.pipe(
      takeUntilDestroyed(this))
      .subscribe((deletedCount: number) => {
        if (deletedCount || deletedCount === 0) {
          this.deleteFilteredJobsSuccessEvent.emit(this.jobScheduleId);
          this._unsubscribeFromJobDetailsStore();
        }
      });
  }

  _subscribeDeleteFilterJobsFailure() {
    return this.filteredJobsDeleteFailure$?.pipe(
      filter(failure => !!failure),
      takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        this._showErrorDialog(failure, 'FAILED_TO_DELETE_FILTERED_JOBS_HEADER');
      });
  }

  _showErrorDialog(failure: DnrFailure, titleKey: string) {
    const errorDialog: MatDialogRef<FailureDisplayDialogComponent> =
      this.errorDialog.open(FailureDisplayDialogComponent, {
        width: '500px',
        data: { failure, titleKey: titleKey }
      });
    errorDialog.afterClosed().subscribe(() => {
      this._unsubscribeFromStore();
    });
    return errorDialog; // for testing
  }

  /**
   * Unsubscribe from all store events as this is a
   * shared service and won't be destroyed after use.
   */
  _unsubscribeFromStore() {
    this._unsubscribeFromScheduleStore();
    this._unsubscribeFromJobDetailsStore();
    this._unsubscribeFromJobsCountStore();

  }

  _unsubscribeFromScheduleStore() {
    this.scheduleSubscriptions.forEach(sub => sub?.unsubscribe());
    this.scheduleSubscriptions = [];
  }

  _unsubscribeFromJobDetailsStore() {
    this.jobDetailSubscriptions.forEach(sub => sub?.unsubscribe());
    this.jobDetailSubscriptions = [];
  }

  _unsubscribeFromJobsCountStore() {
    this.jobsCountSubscriptions.forEach(sub => sub?.unsubscribe());
    this.jobsCountSubscriptions = [];
  }
}
