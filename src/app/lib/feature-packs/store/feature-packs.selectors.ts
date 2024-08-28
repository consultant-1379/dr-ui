import * as fromFeaturePack from './feature-packs.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectFeaturePacksState = createFeatureSelector<fromFeaturePack.FeaturePacksState>(
  fromFeaturePack.featurePacksFeatureKey
);

export const getFeaturePacks = createSelector(
  selectFeaturePacksState,
  state => state.featurePacks
);

export const getFeaturePackDeleted = createSelector(
  selectFeaturePacksState,
  state => state.featurePackDeleted
);

export const getFeaturePacksTotalCount = createSelector(
  selectFeaturePacksState,
  state => state.totalCount
);

export const getFeaturePacksLoading = createSelector(
  selectFeaturePacksState,
  state => state?.loading
);

export const getFeaturePacksFailure = createSelector(
  selectFeaturePacksState,
  state => state.failure
);

export const getFeaturePackApplications = createSelector(
  selectFeaturePacksState,
  _state => {
    return _state?.applications?.items
  }
);

export const getFeaturePackApplicationsTotalCount = createSelector(
  selectFeaturePacksState,
  state => state?.applications?.totalCount
);

export const getFeaturePackApplicationsFailure = createSelector(
  selectFeaturePacksState,
  state => state.failure
);

export const getAllFeaturePacks = createSelector(
  selectFeaturePacksState,
  state => state.allFeaturePacks
);

export const getAllFeaturePacksLoading = createSelector(
  selectFeaturePacksState,
  state => state.allLoading
);

export const getAllFeaturePacksFailure = createSelector(
  selectFeaturePacksState,
  state => state.allFailure
);
