import * as ApplicationActions from '../store/application-details.actions';

import {
  getApplicationDetails,
  getApplicationDetailsFailure,
  getApplicationDetailsLoading,
} from '../store/application-details.selectors';

import { Application } from 'src/app/models/application.model';
import { ApplicationDetailsState } from '../store/application-details.reducer';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDetailsFacadeService {

  constructor(readonly applicationStore: Store<ApplicationDetailsState>) { }

  loadApplicationDetails(featureId: string, appId: string) {
    return this.applicationStore.dispatch(
      new ApplicationActions.LoadApplicationDetails({ featureId, appId })
    );
  }

  clearFailureState() {
    return this.applicationStore.dispatch(
      new ApplicationActions.ClearFailureState()
    );
  }

  getApplicationDetails(): Observable<Application> {
    return this.applicationStore.select(getApplicationDetails);
  }

  getApplicationDetailsLoading(): Observable<boolean> {
    return this.applicationStore.select(getApplicationDetailsLoading);
  }

  getApplicationDetailsFailure(): Observable<DnrFailure> {
    return this.applicationStore.select(getApplicationDetailsFailure);
  }
}
