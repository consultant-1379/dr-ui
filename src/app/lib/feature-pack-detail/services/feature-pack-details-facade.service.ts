import * as FeaturePackDetailsActions from '../store/feature-pack-details.actions';

import {
  getFeaturePackDeleted,
  getFeaturePackDetailSuccess,
  getFeaturePackDetails,
  getFeaturePackDetailsFailure,
  getFeaturePackDetailsLoading,
  getFeaturePackUploadSuccess,
} from '../store/feature-pack-details.selectors';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { FeaturePackDetailsResponse } from 'src/app/models/feature-pack-details-response.model';
import { FeaturePackDetailsState } from '../store/feature-pack-details.reducer';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class FeaturePackDetailsFacadeService {

  constructor(readonly featurePackDetailsStore: Store<FeaturePackDetailsState>) { }

  /**
   * @see app-item-details-facade-service
   */
  loadDetails(id: string) {
    return this.featurePackDetailsStore.dispatch(
      new FeaturePackDetailsActions.LoadFeaturePackDetails({ id })
    );
  }

  uploadFeaturePack(name: string, description: string, file: File, showSuccessMessage: boolean = false) {
    return this.featurePackDetailsStore.dispatch(
      new FeaturePackDetailsActions.UploadFeaturePack({ name, description, file, showSuccessMessage })
    );
  }

  updateFeaturePack(id: string, description: string, file: File, showSuccessMessage: boolean = false) {
    return this.featurePackDetailsStore.dispatch(
      new FeaturePackDetailsActions.UpdateFeaturePack({id, description, file, showSuccessMessage })
    );
  }

  deleteFeaturePack(id: string, name: string, showSuccessMessage: boolean = false) {
    return this.featurePackDetailsStore.dispatch(
      new FeaturePackDetailsActions.DeleteFeaturePack({ id, name, showSuccessMessage })
    );
  }

  clearFailureState() {
    return this.featurePackDetailsStore.dispatch(
      new FeaturePackDetailsActions.ClearFailureState()
    );
  }

  getFeaturePackDeleted(): Observable<boolean> {
    return this.featurePackDetailsStore.select(getFeaturePackDeleted);
  }

  getFeaturePackUploadSuccess(): Observable<boolean> {
    return this.featurePackDetailsStore.select(getFeaturePackUploadSuccess);
  }

  getFeaturePackDetailSuccess(): Observable<FeaturePackDetailsResponse> {
    return this.featurePackDetailsStore.select(
      getFeaturePackDetailSuccess
    );
  }

  getFeaturePackDetails(): Observable<FeaturePackDetailsResponse> {
    return this.featurePackDetailsStore.select(getFeaturePackDetails);
  }

  getFeaturePackDetailsLoading(): Observable<boolean> {
    return this.featurePackDetailsStore.select(getFeaturePackDetailsLoading);
  }

  getFeaturePackDetailsFailure(): Observable<DnrFailure> {
    return this.featurePackDetailsStore.select(getFeaturePackDetailsFailure);
  }
}
