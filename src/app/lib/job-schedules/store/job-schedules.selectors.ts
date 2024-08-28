import * as fromJobSchedule from './job-schedules.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectJobSchedulesState = createFeatureSelector<fromJobSchedule.JobSchedulesState>(
  fromJobSchedule.jobSchedulesFeatureKey
);

export const getJobSchedules = createSelector(
  selectJobSchedulesState,
  state => state.jobSchedules
);

export const getJobSchedulesTotalCount = createSelector(
  selectJobSchedulesState,
  state => state.totalCount
);

export const getJobSchedulesLoading = createSelector(
  selectJobSchedulesState,
  state => state.loading
);

export const getJobSchedulesFailure = createSelector(
  selectJobSchedulesState,
  state => state.failure
);
