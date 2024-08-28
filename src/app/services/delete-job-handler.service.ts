import { EventEmitter, Injectable, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, filter } from 'rxjs';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { ConfirmationService } from '@erad/components/confirmation-dialog';
import { DnrFailure } from '../models/dnr-failure.model';
import { FailureDisplayDialogComponent } from '../components/failure-display-dialog/failure-display-dialog.component';
import { Job } from '../models/job.model';
import { JobDetailsFacadeService } from '../lib/job-detail/services/job-details-facade.service';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { TranslateService } from '@ngx-translate/core';
import { setConfirmDialogPrimaryButtonToRed } from '../utils/common.utils';

/**
 * This service handles deleting a job,
 * i.e. showing the confirm dialog and making the server call.
 *
 * If a server call fail occurs the error is presented on a dialog
 * (as opposed to an inline error message)
 *
 * Multiple delete jobs is supported via filtered jobs API
 */
@Injectable({
  providedIn: 'root'
})
@UnsubscribeAware()
export class DeleteJobHandlerService {

  /**
   * Success delete for a given Job id
   * e.g. DELETE /v1/jobs/2
   */
  @Output()
  deleteSuccessEvent: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Multiple jobs delete success (via filter on Jobs URL)
   * e.g. DELETE /v1/jobs?filter=id==1,id==2,id==3
   */
  @Output()
  filteredJobsDeleteSuccessEvent: EventEmitter<number> = new EventEmitter<number>();

  id: string;

  jobDeleteSuccess$: Observable<boolean> = this.jobService.getJobDeleted();

  filteredJobsDeleteSuccess$: Observable<number> = this.jobService.getFilteredJobsDeleted();

  jobDeleteFailure$: Observable<DnrFailure> = this.jobService.getJobDetailsFailure();

  subscriptions: any[] = [];

  constructor(
    readonly confirmationService: ConfirmationService,
    readonly translateService: TranslateService,
    readonly jobService: JobDetailsFacadeService,
    readonly errorDialog: MatDialog,
  ) { }

  /**
   * Send server call to delete job after user confirmation.
   * Sends success notification which will include job name and id
   * (as apposed to a job delete count)
   * @param job     single job row
   */
  deleteJob(job: Job) {
    this.id = job.id;
    this.confirmationService.show({
      header: this.translateService.instant("DELETE_JOB_CONFIRM_HEADER"),
      content: this._getDeleteConfirmMsg([job]),
      cancelText: this.translateService.instant('buttons.CANCEL'),
      confirmButtonText: this.translateService.instant('buttons.DELETE')

    }).subscribe(observer => {
      if (observer) {
        // user confirmed going ahead with delete
        this.jobService.clearFailureState();
        this._subscribeToStoreEvents();
        this.jobService.deleteJob(job.id, job.name, true);
      }
    });

    setTimeout(() => {
      setConfirmDialogPrimaryButtonToRed();
    }, 100);
  }

  /**
  * Send server call to delete multiple jobs after user confirmation.
  * Sends success notification which a job deleted count
  * (as apposed to a single job name and id)
  *
  * @param jobs  Selected job rows for delete
  */
  deleteJobs(jobs: Job[]) {
    if (jobs.length === 1) {
      /* keep using other API for better toast success message (with name and id) */
      this.deleteJob(jobs[0]);
    } else {
      const jobIds: string[] = jobs.map(job => job.id);
      this.confirmationService.show({
        header: this.translateService.instant("DELETE_MULTIPLE_JOB_CONFIRM_HEADER"),
        content: this._getDeleteConfirmMsg(jobs),
        cancelText: this.translateService.instant('buttons.CANCEL'),
        confirmButtonText: this.translateService.instant('buttons.DELETE')

      }).subscribe(observer => {
        if (observer) {
          // user confirmed going ahead with delete
          this.jobService.clearFailureState();
          this._subscribeToStoreEvents();

          this.jobService.deleteFilteredJobs({
            filters: this._getFiqlValueForIds(jobIds)
          }, true);
        }
      });

      setTimeout(() => {
        setConfirmDialogPrimaryButtonToRed();
      }, 100);

    }
  }

  _getFiqlValueForIds(ids: string[]): string {
    const prefix = 'id==';
    return ids.map(id => `${prefix}${id}`).join(',');
  }

  /**
   * A scheduled job that is active (in progress) can not be deleted - even with force.
   * Server will return an error and delete will fail.
   * UI can be stale - so best to just warn (if schedules jobs present) rather than prevent delete attempt.
   *
   * @param jobRows   containing one row item for single delete
   * @returns         confirm message based on job row selection
   */
  _getDeleteConfirmMsg(jobRows: Job[]) {

    const scheduledJobFound = jobRows.some((job) => !!job.jobScheduleId);
    const inProgressManualJobFound = jobRows.some((job) => !job.jobScheduleId && (job.status === JobStatus.RECONCILE_INPROGRESS || job.status === JobStatus.DISCOVERY_INPROGRESS));

    let msg = inProgressManualJobFound ? this.translateService.instant("DELETE_MESSAGE_IN_PROGRESS_MANUAL_JOB") : '';
    msg += (scheduledJobFound) ? this.translateService.instant("DELETE_MESSAGE_SCHEDULED_JOB_FOUND") : '';

    if (jobRows.length === 1) {
      msg += this.translateService.instant("DELETE_JOB_CONFIRM_MESSAGE", { name: jobRows[0].name })
    } else {
      msg += this.translateService.instant("DELETE_MULTIPLE_JOB_CONFIRM_MESSAGE", { count: jobRows.length })
    }
    return msg;
  }

  _subscribeToStoreEvents() {
    if (this.subscriptions.length === 0) {
      this.subscriptions.push(this._subscribeSingleDeleteSuccess());
      this.subscriptions.push(this._subscribeMultipleDeleteSuccess());
      this.subscriptions.push(this._subscribeFailure());
    }
  }

  _subscribeFailure() {
    return this.jobDeleteFailure$?.pipe(
      filter(failure => !!failure),
      takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        this._showErrorDialog(failure)
      });
  }

  _subscribeSingleDeleteSuccess() {
    return this.jobDeleteSuccess$?.pipe(
      filter(response => !!response),
      takeUntilDestroyed(this))
      .subscribe(() => {
        // when success, emit event so caller can refresh table and show notification
        this.deleteSuccessEvent.emit(this.id);
        this._unsubscribeFromStore();
      });
  }

  _subscribeMultipleDeleteSuccess() {
    return this.filteredJobsDeleteSuccess$?.pipe(
      filter(deleteCount => !!deleteCount),
      takeUntilDestroyed(this))
      .subscribe((deleteCount) => {
        this.filteredJobsDeleteSuccessEvent.emit(deleteCount);
        this._unsubscribeFromStore();
      });
  }

  _showErrorDialog(failure: DnrFailure) {
    this.jobService.clearFailureState();
    const errorDialog: MatDialogRef<FailureDisplayDialogComponent> =
      this.errorDialog.open(FailureDisplayDialogComponent, {
        width: '500px',
        data: { failure, titleKey: 'FAILED_TO_DELETE_JOB_HEADER' }
      });
    errorDialog.afterClosed().subscribe(() => {
      this._unsubscribeFromStore();
    });
  }

  /**
  * Unsubscribe from all store events as this is a
  * shared service and won't be destroyed after use.
  */
  _unsubscribeFromStore() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
    this.subscriptions = [];
  }
}
