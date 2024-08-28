import {
  DISCOVERED_OBJECTS_URL,
  DISCOVERY_JOBS_URL,
  DISCOVERY_JOB_WITH_ID_URL,
  DUPLICATE_JOB_WITH_ID_URL,
  RECONCILE_WITH_ID_URL
} from '../constants/UrlConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JobReconcileAllData, JobReconcileData } from '../models/job-reconcile.model';

import { DiscoveredObjectsItemsResponse } from '../models/discovered-objects-items-response.model';
import { ExecutionJob } from '../models/execute-job.model';
import { Injectable } from '@angular/core';
import { Job } from '../models/job.model';
import { JobsItemsResponse } from '../models/jobs-items-response.model';
import { Observable } from 'rxjs';
import { QueryParams } from '../models/query.params.model';
import { addQueryParamsToUrl } from './query-utils';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });

  deleteHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'force': 'true'
  });

  constructor(private http: HttpClient) { }

  getDiscoveryJobs(query : QueryParams = {}) : Observable<JobsItemsResponse> {
    const url = addQueryParamsToUrl(DISCOVERY_JOBS_URL, query);
    return this.http.get<JobsItemsResponse>(url, { headers: this.headers });
  }

  createJob(payload: ExecutionJob): Observable<{id: string}> {
    return this.http.post<{id: string}>(DISCOVERY_JOBS_URL, payload, { headers: this.headers });
  }

  reconcileJob(id: string, payload: JobReconcileData) {
    const url = RECONCILE_WITH_ID_URL.replace('{0}', id);
    return this.http.post(url, payload, { headers: this.headers });
  }

  reconcileAllJob(id: string, payload: JobReconcileAllData) {
    const url = RECONCILE_WITH_ID_URL.replace('{0}', id);
    return this.http.post(url, payload, { headers: this.headers });
  }

  duplicateJob(id: string) {
    const url = DUPLICATE_JOB_WITH_ID_URL.replace('{0}', id);
    return this.http.post(url, {}, { headers: this.headers });
  }

  deleteJob(id: string): Observable<any> {
    const url = DISCOVERY_JOB_WITH_ID_URL.replace('{0}', id);
    return this.http.delete<any>(url, { headers: this.deleteHeaders });
  }

  deleteFilteredJobs(query: QueryParams = {}): Observable<any> {
    let url = addQueryParamsToUrl(DISCOVERY_JOBS_URL, query);
    // no force header on deleting jobs based on a scheduleId filter (force when manually delete same as single delete)
    const headers = this._queryContainsIds(query) ? this.deleteHeaders : this.headers;
    return this.http.delete<any>(url, { headers });
  }

  _queryContainsIds(query: QueryParams): boolean {
    return /id==\d+/.test(query?.filters);
  }

  getDiscoveryJobById(id: string) : Observable<Job> {
    const url = DISCOVERY_JOB_WITH_ID_URL.replace('{0}', id);
    return this.http.get<Job>(url, { headers: this.headers });
  }

  getDiscoverdObjects(id: string, query: QueryParams = {}): Observable<DiscoveredObjectsItemsResponse> {
    let url = addQueryParamsToUrl(DISCOVERED_OBJECTS_URL, query);
    url = url.replace('{0}', id);
    return this.http.get<DiscoveredObjectsItemsResponse>(url, { headers: this.headers });
  }
}
