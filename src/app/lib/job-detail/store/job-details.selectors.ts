import * as fromJob from './job-details.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectJobDetailsState = createFeatureSelector<fromJob.JobDetailsState>(
  fromJob.jobDetailsFeatureKey
);

export const getJobDetails = createSelector(
  selectJobDetailsState,
  state => state?.job
);

export const getJobId = createSelector(
  selectJobDetailsState,
  state => state.id
);

export const getJobDetailsLoading = createSelector(
  selectJobDetailsState,
  state => state.loading
);

export const getJobDetailsFailure = createSelector(
  selectJobDetailsState,
  state => state.failure
);

export const getJobDeleted = createSelector(
  selectJobDetailsState,
  state => state.jobDeleted
);

export const getJobReconciled = createSelector(
  selectJobDetailsState,
  state => state.jobReconciled
);

export const getJobDuplicated = createSelector(
  selectJobDetailsState,
  state => state.jobDuplicated
);

export const getFilteredJobsDeleted = createSelector(
  selectJobDetailsState,
  state => state.deletedCount
);
