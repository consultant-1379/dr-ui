import { JobsActionTypes, JobsActions } from './jobs.actions';

import { AbstractFetchState } from '@erad/core';
import { Job } from 'src/app/models/job.model';

export const jobsFeatureKey = 'jobs';

export interface JobsState extends AbstractFetchState {
  jobs: Job[];
  totalCount: number;
}

export const initialState: JobsState = {
  jobs: [],
  failure: null,
  loading: false,
  totalCount: -1
};

export function jobsReducer(state: JobsState, action: JobsActions): JobsState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case JobsActionTypes.LoadJobsType:
      return {
        ...state,
        loading: true,
        failure: null,
        totalCount: -1
      };
    case JobsActionTypes.LoadJobsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        jobs: action.payload.response.items,
        totalCount: action.payload.response.totalCount
      };
    case JobsActionTypes.LoadJobsFailureType:
      return {
        ...state,
        loading: false,
        failure: action.payload.failure
      };
    case JobsActionTypes.ClearFailureStateType:
      return {
        ...state,
        failure: null
      };

    default:
      return state;
  }
}
