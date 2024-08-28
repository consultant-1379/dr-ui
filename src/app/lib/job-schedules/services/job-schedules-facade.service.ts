import * as JobScheduleActions from '../store/job-schedules.actions';

import {
  getJobSchedules,
  getJobSchedulesFailure,
  getJobSchedulesLoading,
  getJobSchedulesTotalCount,
} from '../store/job-schedules.selectors';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { JobSchedule } from 'src/app/models/job-schedule.model';
import { JobSchedulesState } from '../store/job-schedules.reducer';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryParams } from 'src/app/models/query.params.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class JobSchedulesFacadeService {

  constructor(readonly jobScheduleStore: Store<JobSchedulesState>) { }

  loadItems(query: QueryParams) {
    return this.jobScheduleStore.dispatch(
      new JobScheduleActions.LoadJobSchedules({ query })
    );
  }

  clearFailureState() {
    return this.jobScheduleStore.dispatch(
      new JobScheduleActions.ClearFailureState()
    );
  }

  getItems(): Observable<JobSchedule[]> {
    return this.jobScheduleStore.select(getJobSchedules);
  }

  getItemsTotalCount(): Observable<number> {
    return this.jobScheduleStore.select(getJobSchedulesTotalCount);
  }

  getItemsLoading(): Observable<boolean> {
    return this.jobScheduleStore.select(getJobSchedulesLoading);
  }

  getItemsFailure(): Observable<DnrFailure> {
    return this.jobScheduleStore.select(getJobSchedulesFailure);
  }
}
