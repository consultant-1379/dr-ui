import * as JobActions from '../store/job-details.actions';

import { JobReconcileAllData, JobReconcileData } from 'src/app/models/job-reconcile.model';
import {
  getFilteredJobsDeleted,
  getJobDeleted,
  getJobDetails,
  getJobDetailsFailure,
  getJobDetailsLoading,
  getJobDuplicated,
  getJobId,
  getJobReconciled
} from '../store/job-details.selectors';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { ExecutionJob } from 'src/app/models/execute-job.model';
import { Injectable } from '@angular/core';
import { Job } from 'src/app/models/job.model';
import { JobDetailsState } from '../store/job-details.reducer';
import { Observable } from 'rxjs';
import { QueryParams } from 'src/app/models/query.params.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class JobDetailsFacadeService {

  constructor(readonly jobStore: Store<JobDetailsState>) { }

  /**
   * @see app-item-details-facade-service
   */
  loadDetails(id: string) {
    return this.jobStore.dispatch(
      new JobActions.LoadJobDetails({ id })
    );
  }

  createJob(data: ExecutionJob) {
    return this.jobStore.dispatch(
      new JobActions.CreateJob({ data })
    );
  }

  reconcileJob(id: string, data: JobReconcileData, showSuccessMessage: boolean = false) {
    return this.jobStore.dispatch(
      new JobActions.ReconcileJob({ id, data, showSuccessMessage })
    );
  }

  reconcileAllJob(id: string, data: JobReconcileAllData, showSuccessMessage: boolean = false) {
    return this.jobStore.dispatch(
      new JobActions.ReconcileAllJob({ id, data, showSuccessMessage })
    );
  }

  deleteJob(id: string, name: string, showSuccessMessage: boolean = false) {
    return this.jobStore.dispatch(
      new JobActions.DeleteJob({ id, name, showSuccessMessage })
    );
  }

  deleteFilteredJobs(query: QueryParams, showSuccessMessage: boolean = false) {
    return this.jobStore.dispatch(
      new JobActions.DeleteFilteredJobs({ query, showSuccessMessage })
    );
  }

  duplicateJob(id: string, name: string, showSuccessMessage: boolean = false) {
    return this.jobStore.dispatch(
      new JobActions.DuplicateJob({ id, name, showSuccessMessage })
    );
  }

  clearFailureState() {
    return this.jobStore.dispatch(
      new JobActions.ClearFailureState()
    );
  }

  getJobDetails(): Observable<Job> {
    return this.jobStore.select(getJobDetails);
  }

  getJobId(): Observable<string> {
    return this.jobStore.select(getJobId);
  }

  getJobDetailsLoading(): Observable<boolean> {
    return this.jobStore.select(getJobDetailsLoading);
  }

  getJobDetailsFailure(): Observable<DnrFailure> {
    return this.jobStore.select(getJobDetailsFailure);
  }

  getJobDeleted(): Observable<boolean> {
    return this.jobStore.select(getJobDeleted);
  }

  getFilteredJobsDeleted(): Observable<number> {
    return this.jobStore.select(getFilteredJobsDeleted);
  }

  getJobReconciled(): Observable<boolean> {
    return this.jobStore.select(getJobReconciled);
  }

  getJobDuplicated(): Observable<boolean> {
    return this.jobStore.select(getJobDuplicated);
  }
}