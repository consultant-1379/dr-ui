import * as FeaturePackActions from '../store/feature-packs.actions';

import {
  getAllFeaturePacks,
  getAllFeaturePacksFailure,
  getAllFeaturePacksLoading,
  getFeaturePackApplications,
  getFeaturePackApplicationsFailure,
  getFeaturePackApplicationsTotalCount,
  getFeaturePacks,
  getFeaturePacksFailure,
  getFeaturePacksLoading,
  getFeaturePacksTotalCount,
} from '../store/feature-packs.selectors';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { DropdownOption } from 'src/app/models/dropdown-option.model';
import { FeaturePack } from 'src/app/models/feature-pack.model';
import { FeaturePacksState } from '../store/feature-packs.reducer';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryParams } from 'src/app/models/query.params.model';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class FeaturePackFacadeService {

  constructor(readonly featurePackStore: Store<FeaturePacksState>) { }

  loadItems(query: QueryParams) {
    return this.featurePackStore.dispatch(
      new FeaturePackActions.LoadFeaturePacks({ query })
    );
  }

  clearFailureState() {
    return this.featurePackStore.dispatch(
      new FeaturePackActions.ClearFailureState()
    );
  }

  getItems(): Observable<FeaturePack[]> {
    return this.featurePackStore.select(getFeaturePacks);
  }

  getItemsTotalCount(): Observable<number> {
    return this.featurePackStore.select(getFeaturePacksTotalCount);
  }

  getItemsLoading(): Observable<boolean> {
    return this.featurePackStore.select(getFeaturePacksLoading);
  }

  getItemsFailure(): Observable<DnrFailure> {
    return this.featurePackStore.select(getFeaturePacksFailure);
  }

  loadApplications(featurePackId: string, query : QueryParams = {}) {
    return this.featurePackStore.dispatch(
      new FeaturePackActions.LoadFeaturePackApplications({ featurePackId, query })
    );
  }

  getApplications() {
    return this.featurePackStore.select(getFeaturePackApplications);
  }

  getFeaturePackApplicationsTotalCount(): Observable<number> {
    return this.featurePackStore.select(getFeaturePackApplicationsTotalCount);
  }

  getFeaturePackApplicationsFailure(): Observable<DnrFailure> {
    return this.featurePackStore.select(getFeaturePackApplicationsFailure);
  }

  loadAllFeaturePacks() {
    return this.featurePackStore.dispatch(
      new FeaturePackActions.LoadAllFeaturePacks()
    );
  }

  getAllFeaturePacksLoading(): Observable<boolean> {
    return this.featurePackStore.select(getAllFeaturePacksLoading);
  }

  getAllFeaturePacks(): Observable<DropdownOption[]> {
    return this.featurePackStore.select(getAllFeaturePacks);
  }

  getAllFeaturePacksFailure(): Observable<DnrFailure> {
    return this.featurePackStore.select(getAllFeaturePacksFailure);
  }

}
