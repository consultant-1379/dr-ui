import * as InputConfigsActions from '../store/input-configurations.actions';

import {
  getInputConfigs,
  getInputConfigsFailure,
  getInputConfigsLoading,
  getInputConfigsTotalCount
} from '../store/input-configurations.selectors';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InputConfiguration } from 'src/app/models/input-configuration.model';
import { InputConfigsState } from '../store/input-configurations.reducer';
import { QueryParams } from 'src/app/models/query.params.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class InputConfigsFacadeService {

  constructor(readonly inputConfigsStore: Store<InputConfigsState>) { }

  loadInputConfigurations(id: string, query?: QueryParams) {
    return this.inputConfigsStore.dispatch(
      new InputConfigsActions.LoadInputConfigs({ id, query })
    );
  }

  ClearFailureState() {
    return this.inputConfigsStore.dispatch(
      new InputConfigsActions.ClearFailureState()
    );
  }

  getInputConfigurations(): Observable<InputConfiguration[]> {
    return this.inputConfigsStore.select(getInputConfigs);
  }

  getInputConfigurationsTotalCount(): Observable<number> {
    return this.inputConfigsStore.select(getInputConfigsTotalCount);
  }

  getInputConfigurationsLoading(): Observable<boolean> {
    return this.inputConfigsStore.select(getInputConfigsLoading);
  }

  getInputConfigurationsFailure(): Observable<DnrFailure> {
    return this.inputConfigsStore.select(getInputConfigsFailure);
  }
}
