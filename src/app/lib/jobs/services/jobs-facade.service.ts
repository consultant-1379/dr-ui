import { QueryParams } from 'src/app/models/query.params.model';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Job } from 'src/app/models/job.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  getJobsTotalCount,
  getJobsFailure,
  getJobsLoading,
  getJobs,
} from '../store/jobs.selectors';
import  * as  JobsActions from '../store/jobs.actions';
import { JobsState } from '../store/jobs.reducer';

@Injectable({
  providedIn: 'root'
})
export class JobsFacadeService<T> {

  constructor(readonly jobsStore: Store<JobsState>) { }

  loadItems(query?: QueryParams) {
    return this.jobsStore.dispatch(
      new JobsActions.LoadJobs({ query })
    );
  }

  ClearFailureState() {
    return this.jobsStore.dispatch(
      new JobsActions.ClearFailureState()
    );
  }

  getItems(): Observable<T[] | Job[]> {
    return this.jobsStore.select(getJobs);
  }

  getItemsTotalCount(): Observable<number> {
    return this.jobsStore.select(getJobsTotalCount);
  }

  getItemsLoading(): Observable<boolean> {
    return this.jobsStore.select(getJobsLoading);
  }

  getItemsFailure(): Observable<DnrFailure> {
    return this.jobsStore.select(getJobsFailure);
  }
}
