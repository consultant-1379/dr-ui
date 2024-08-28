import * as fromApplication from './application-details.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectApplicationDetailsState = createFeatureSelector<fromApplication.ApplicationDetailsState>(
  fromApplication.applicationDetailsFeatureKey
);

export const getApplicationDetails = createSelector(
  selectApplicationDetailsState,
  state => state.application
);

export const getApplicationDetailsLoading = createSelector(
  selectApplicationDetailsState,
  state => state.loading
);

export const getApplicationDetailsFailure = createSelector(
  selectApplicationDetailsState,
  state => state.failure
);
