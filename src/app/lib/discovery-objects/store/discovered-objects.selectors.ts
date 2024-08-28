import * as fromDiscoveredObjects from './discovered-objects.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectDiscoveredObjectsState = createFeatureSelector<fromDiscoveredObjects.DiscoveredObjectsState>(
  fromDiscoveredObjects.discoveredObjectsFeatureKey
);

export const getDiscoveredObjects = createSelector(
  selectDiscoveredObjectsState,
  state => state.discoveredObjects
);

export const getDiscoveredObjectsTotalCount = createSelector(
  selectDiscoveredObjectsState,
  state => state.totalCount
);

export const getDiscoveredObjectsLoading = createSelector(
  selectDiscoveredObjectsState,
  state => state.loading
);

export const getDiscoveredObjectsFailure = createSelector(
  selectDiscoveredObjectsState,
  state => state.failure
);
