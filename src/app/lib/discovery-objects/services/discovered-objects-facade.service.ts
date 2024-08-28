import * as DiscoveredObjectsActions from '../store/discovered-objects.actions';

import {
  getDiscoveredObjects,
  getDiscoveredObjectsFailure,
  getDiscoveredObjectsLoading,
  getDiscoveredObjectsTotalCount
} from '../store/discovered-objects.selectors';

import { DiscoveredObjects } from 'src/app/models/discovered-objects.model';
import { DiscoveredObjectsState } from '../store/discovered-objects.reducer';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryParams } from 'src/app/models/query.params.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class DiscoveredObjectsFacadeService {

  constructor(readonly discoveredObjectsState: Store<DiscoveredObjectsState>) { }

  loadDiscoveredObjects(id: string, query?: QueryParams) {
    return this.discoveredObjectsState.dispatch(
      new DiscoveredObjectsActions.LoadDiscoveredObjects({ id, query })
    );
  }

  ClearFailureState() {
    return this.discoveredObjectsState.dispatch(
      new DiscoveredObjectsActions.ClearFailureState()
    );
  }

  getDiscoveredObjects(): Observable<DiscoveredObjects[]> {
    return this.discoveredObjectsState.select(getDiscoveredObjects);
  }

  getDiscoveredObjectsTotalCount(): Observable<number> {
    return this.discoveredObjectsState.select(getDiscoveredObjectsTotalCount);
  }

  getDiscoveredObjectsLoading(): Observable<boolean> {
    return this.discoveredObjectsState.select(getDiscoveredObjectsLoading);
  }

  getDiscoveredObjectsFailure(): Observable<DnrFailure> {
    return this.discoveredObjectsState.select(getDiscoveredObjectsFailure);
  }
}
