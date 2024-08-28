import * as fromApplications from './applications.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectApplicationsState = createFeatureSelector<fromApplications.ApplicationsState>(
  fromApplications.applicationsFeatureKey
);

export const getApplications = createSelector(
  selectApplicationsState,
  state => state.applications
);

export const getApplicationsTotalCount = createSelector(
  selectApplicationsState,
  state => state.totalCount
);

export const getApplicationsLoading = createSelector(
  selectApplicationsState,
  state => state.loading
);

export const getApplicationsFailure = createSelector(
  selectApplicationsState,
  state => state.failure
);
