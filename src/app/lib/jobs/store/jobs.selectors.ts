import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromJobs from './jobs.reducer';

const selectJobsState = createFeatureSelector<fromJobs.JobsState>(
  fromJobs.jobsFeatureKey
);

export const getJobs = createSelector(
  selectJobsState,
  state => state.jobs
);

export const getJobsTotalCount = createSelector(
  selectJobsState,
  state => state.totalCount
);

export const getJobsLoading = createSelector(
  selectJobsState,
  state => state.loading
);

export const getJobsFailure = createSelector(
  selectJobsState,
  state => state.failure
);
