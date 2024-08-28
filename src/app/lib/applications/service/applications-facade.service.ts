import * as ApplicationsActions from '../store/applications.actions';

import {
  getApplications,
  getApplicationsFailure,
  getApplicationsLoading,
  getApplicationsTotalCount
} from '../store/applications.selectors';

import { Application } from 'src/app/models/application.model';
import { ApplicationsState } from '../store/applications.reducer';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryParams } from 'src/app/models/query.params.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsFacadeService {

  constructor(readonly applicationsStore: Store<ApplicationsState>) { }

  loadApplications(id: string, query?: QueryParams) {
    return this.applicationsStore.dispatch(
      new ApplicationsActions.LoadApplications({ id, query })
    );
  }

  ClearFailureState() {
    return this.applicationsStore.dispatch(
      new ApplicationsActions.ClearFailureState()
    );
  }

  getApplications(): Observable<Application[]> {
    return this.applicationsStore.select(getApplications);
  }

  getApplicationsTotalCount(): Observable<number> {
    return this.applicationsStore.select(getApplicationsTotalCount);
  }

  getApplicationsLoading(): Observable<boolean> {
    return this.applicationsStore.select(getApplicationsLoading);
  }

  getApplicationsFailure(): Observable<DnrFailure> {
    return this.applicationsStore.select(getApplicationsFailure);
  }
}
