import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  JOB_SCHEDULES_URL,
  JOB_SCHEDULE_WITH_ID_URL
} from '../constants/UrlConstants';

import { Injectable } from '@angular/core';
import { JobSchedule } from '../models/job-schedule.model';
import { JobScheduleCreateData } from '../models/job-schedule-create.model';
import { JobScheduleItemsResponse } from '../models/job-schedule-items-response.model';
import { Observable } from 'rxjs';
import { QueryParams } from '../models/query.params.model';
import { addQueryParamsToUrl } from './query-utils';

@Injectable({
  providedIn: 'root'
})
export class JobScheduleService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });

  constructor(private http: HttpClient) { }

  getJobSchedules(query: QueryParams = {}): Observable<JobScheduleItemsResponse> {
      const url = addQueryParamsToUrl(JOB_SCHEDULES_URL, query);
      return this.http.get<JobScheduleItemsResponse>(url, { headers: this.headers });
  }

  getJobScheduleById(id: string): Observable<JobSchedule> {
    const url = JOB_SCHEDULE_WITH_ID_URL.replace('{0}', id);
    return this.http.get<JobSchedule>(url, { headers: this.headers });
  }

  createJobSchedule(payload: JobScheduleCreateData): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(JOB_SCHEDULES_URL, payload, { headers: this.headers });
  }

  deleteJobSchedule(id: string): Observable<any> {
    const url = JOB_SCHEDULE_WITH_ID_URL.replace('{0}', id);
    return this.http.delete<any>(url, { headers: this.headers });
  }

  enableJobSchedule(id: string, enabled: boolean): Observable<any> {
    const url = JOB_SCHEDULE_WITH_ID_URL.replace('{0}', id);
    return this.http.patch<any>(url, { enabled }, { headers: this.headers });
  }
}
