import * as fromJob from './job-schedule-details.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectJobScheduleDetailsState = createFeatureSelector<fromJob.JobScheduleDetailsState>(
  fromJob.jobScheduleDetailsFeatureKey
);

export const getJobScheduleDetails = createSelector(
  selectJobScheduleDetailsState,
  state => state?.jobSchedule
);

export const getJobScheduleId = createSelector(
  selectJobScheduleDetailsState,
  state => state.id
);

export const getJobScheduleLoading = createSelector(
  selectJobScheduleDetailsState,
  state => state.loading
);

export const getJobScheduleDetailsFailure = createSelector(
  selectJobScheduleDetailsState,
  state => state.failure
);

export const getJobScheduleDeleted = createSelector(
  selectJobScheduleDetailsState,
  state => state.jobScheduleDeleted
);

export const getJobScheduleEnabledSet = createSelector(
  selectJobScheduleDetailsState,
  state => state.jobScheduleEnabledStateChanged
);

export const getJobScheduleEnabledSetFailure = createSelector(
  selectJobScheduleDetailsState,
  state => state.enableDisableFailure
);