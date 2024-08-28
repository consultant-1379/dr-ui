import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromFeaturePackDetails from './feature-pack-details.reducer';

const selectFeaturePackDetailsState = createFeatureSelector<fromFeaturePackDetails.FeaturePackDetailsState>(
  fromFeaturePackDetails.featurePackDetailsFeatureKey
);

export const getFeaturePackDetails = createSelector(
  selectFeaturePackDetailsState,
  state => state.featurePackDetails
);

export const getFeaturePackDetailSuccess = createSelector(
  selectFeaturePackDetailsState,
  state => state.featurePackDetails
);

export const getFeaturePackDetailsLoading = createSelector(
  selectFeaturePackDetailsState,
  state => state.loading
);

export const getFeaturePackDetailsFailure = createSelector(
  selectFeaturePackDetailsState,
  state => state.failure
);

export const getFeaturePackUploadSuccess = createSelector(
  selectFeaturePackDetailsState,
  state => state.uploadSuccess
);

export const getFeaturePackDeleted = createSelector(
  selectFeaturePackDetailsState,
  state => state.featurePackDeleted
);