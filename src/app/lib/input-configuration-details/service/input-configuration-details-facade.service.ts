import * as InputConfigActions from '../store/input-configuration-details.actions';

import {
  getInputConfigDetails,
  getInputConfigDetailsFailure,
  getInputConfigDetailsLoading,
} from '../store/input-configuration-details.selectors';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Injectable } from '@angular/core';
import { InputConfigDetailsState } from '../store/input-configuration-details.reducer';
import { InputConfigurationDetails } from 'src/app/models/input-configuration-details.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class InputConfigDetailsFacadeService {

  constructor(readonly inputConfigDetailsStore: Store<InputConfigDetailsState>) { }

  loadInputConfigDetails(featureId: string, configurationId: string) {
    return this.inputConfigDetailsStore.dispatch(
      new InputConfigActions.LoadInputConfigDetails({ featureId, configurationId })
    );
  }

  clearFailureState() {
    return this.inputConfigDetailsStore.dispatch(
      new InputConfigActions.ClearFailureState()
    );
  }

  getInputConfigDetails(): Observable<InputConfigurationDetails> {
    return this.inputConfigDetailsStore.select(getInputConfigDetails);
  }

  getInputConfigDetailsLoading(): Observable<boolean> {
    return this.inputConfigDetailsStore.select(getInputConfigDetailsLoading);
  }

  getInputConfigDetailsFailure(): Observable<DnrFailure> {
    return this.inputConfigDetailsStore.select(getInputConfigDetailsFailure);
  }
}
