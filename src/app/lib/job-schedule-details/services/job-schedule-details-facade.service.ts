import * as JobScheduleActions from '../store/job-schedule-details.actions';

import {
  getJobScheduleDeleted,
  getJobScheduleDetails,
  getJobScheduleDetailsFailure,
  getJobScheduleEnabledSet,
  getJobScheduleEnabledSetFailure,
  getJobScheduleId,
  getJobScheduleLoading,
} from '../store/job-schedule-details.selectors';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Injectable } from '@angular/core';
import { JobSchedule } from 'src/app/models/job-schedule.model';
import { JobScheduleCreateData } from 'src/app/models/job-schedule-create.model';
import { JobScheduleDetailsState } from '../store/job-schedule-details.reducer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class JobScheduleDetailsFacadeService {

  constructor(readonly jobScheduleStore: Store<JobScheduleDetailsState>) { }

  /**
   * @see app-item-details-facade-service
   */
  loadDetails(id: string) {
    return this.jobScheduleStore.dispatch(
      new JobScheduleActions.LoadJobScheduleDetails({ id })
    );
  }

  createJobSchedule(data: JobScheduleCreateData) {
    return this.jobScheduleStore.dispatch(
      new JobScheduleActions.CreateJobSchedule({ data })
    );
  }

  enableJobSchedule(id: string, name: string, enabled: boolean, showSuccessMessage: boolean = false) {
    return this.jobScheduleStore.dispatch(
      new JobScheduleActions.EnableJobSchedule({ id, name, enabled, showSuccessMessage })
    );
  }

  deleteJobSchedule(id: string, name: string, showSuccessMessage: boolean = false) {
    return this.jobScheduleStore.dispatch(
      new JobScheduleActions.DeleteJobSchedule({ id, name, showSuccessMessage })
    );
  }

  clearFailureState() {
    return this.jobScheduleStore.dispatch(
      new JobScheduleActions.ClearFailureState()
    );
  }

  getJobScheduleDetails(): Observable<JobSchedule> {
    return this.jobScheduleStore.select(getJobScheduleDetails);
  }

  getJobScheduleId(): Observable<string> {
    return this.jobScheduleStore.select(getJobScheduleId);
  }

  getJobScheduleLoading(): Observable<boolean> {
    return this.jobScheduleStore.select(getJobScheduleLoading);
  }

  getJobScheduleFailure(): Observable<DnrFailure> {
    return this.jobScheduleStore.select(getJobScheduleDetailsFailure);
  }

  getJobScheduleDeleted(): Observable<boolean> {
    return this.jobScheduleStore.select(getJobScheduleDeleted);
  }

  getJobScheduleEnabledSet(): Observable<boolean> {
    return this.jobScheduleStore.select(getJobScheduleEnabledSet);
  }

  getJobScheduleEnabledSetFailure(): Observable<DnrFailure> {
    return this.jobScheduleStore.select(getJobScheduleEnabledSetFailure);
  }
}