import { JobScheduleActions, JobSchedulesActionTypes } from './job-schedules.actions';
import { AbstractFetchState, Failure } from '@erad/core';
import { JobScheduleSummary } from 'src/app/models/job-schedule-summary.model';

export const jobSchedulesFeatureKey = 'jobSchedules';

export interface JobSchedulesState extends AbstractFetchState {
  // TODO AbstractFetchState has Failure not DnrFailure (but seems to work)
  failure: Failure;
  loading: boolean;
  totalCount: number;
  jobSchedules: JobScheduleSummary[];
}

export const initialState: JobSchedulesState = {
  failure: null,
  loading: false,
  totalCount: 0,
  jobSchedules: [],
};

export function jobSchedulesReducer(
  state: JobSchedulesState,
  action: JobScheduleActions): JobSchedulesState {

  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case JobSchedulesActionTypes.LoadJobSchedulesType:
      return {
        ...state,
        loading: true,
        failure: null,
      }
    case JobSchedulesActionTypes.LoadJobSchedulesSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        jobSchedules: action.payload.response.items,
        totalCount: action.payload.response.totalCount,
      }
    case JobSchedulesActionTypes.LoadJobSchedulesFailureType:
      return {
        ...state,
        loading: false,
        failure: action.payload.failure,
      }
    case JobSchedulesActionTypes.ClearFailureStateType: {
      return {
        ...state,
        failure: null
      }
    }
    default:
      return state;
  }
}
