import { EMPTY, Observable } from 'rxjs';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Injectable } from '@angular/core';
import { JobSchedule } from 'src/app/models/job-schedule.model';

@Injectable({
  providedIn: 'root',
})
export class JobScheduleDetailsFacadeServiceMock {
  loadDetails() {
    return EMPTY;
  }

  getJobScheduleDetails(): Observable<JobSchedule> {
    return EMPTY;
  }

  getJobScheduleFailure(): Observable<DnrFailure> {
    return EMPTY;
  }

  getJobScheduleDeleted(): Observable<boolean> {
    return EMPTY;
  }

  getJobScheduleEnabledSet(): Observable<boolean> {
    return EMPTY;
  }

  getJobScheduleLoading(): Observable<boolean> {
    return EMPTY;
  }

  clearFailureState(): Observable<boolean> {
    return EMPTY;
  }

  enableJobSchedule() : Observable<boolean> {
    return EMPTY;
  }
}
