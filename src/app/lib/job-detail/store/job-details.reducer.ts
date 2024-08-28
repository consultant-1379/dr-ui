import { JobDetailsActionTypes, JobDetailsActions } from './job-details.actions';

import { AbstractFetchState } from '@erad/core';
import { Job } from 'src/app/models/job.model';

export const jobDetailsFeatureKey = 'jobDetails';

export interface JobDetailsState extends AbstractFetchState {
  job?: Job;
  id?: string,
  deletedCount?: number;
  jobDeleted?: boolean;
  jobReconciled?: boolean;
  jobDuplicated?: boolean;
}

export const initialState: JobDetailsState = {
  job: null,
  id: null,
  deletedCount: null,
  failure: null,
  loading: false,
};

export function jobDetailsReducer(state: JobDetailsState, action: JobDetailsActions): JobDetailsState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case JobDetailsActionTypes.LoadJobDetailsType:
    case JobDetailsActionTypes.CreateJobType:
    case JobDetailsActionTypes.ReconcileAllJobType:
      return {
        ...state,
        id: null,
        job: null,
        deletedCount: null,
        loading: true,
        failure: null,
      };
    case JobDetailsActionTypes.ReconcileJobType:
      return {
        ...state,
        loading: true,
        failure: null,
        jobReconciled: null
      };
    case JobDetailsActionTypes.DeleteJobType:
      return {
        ...state,
        loading: true,
        failure: null,
        jobDeleted: null
      };
    case JobDetailsActionTypes.DeleteFilteredJobsType:
      return {
        ...state,
        loading: true,
        failure: null,
        deletedCount: null
      };

    case JobDetailsActionTypes.DuplicateJobType:
      return {
        ...state,
        loading: true,
        failure: null,
        jobDuplicated: null
      };

    case JobDetailsActionTypes.DeleteFilteredJobsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        deletedCount: action.payload.deleted
      };

    case JobDetailsActionTypes.DeleteJobSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        jobDeleted: true,
        id: action.payload.id
      };
      case JobDetailsActionTypes.ReconcileJobSuccessType:
        return {
          ...state,
          loading: false,
          failure: null,
          jobReconciled: true,
        };
    case JobDetailsActionTypes.CreateJobSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        id: action.payload.response.id,
      };
    case JobDetailsActionTypes.LoadJobDetailsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        job: action.payload.response,
        id: action.payload.response.id,
      };
    case JobDetailsActionTypes.DuplicateJobSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        jobDuplicated: true,
        id: action.payload.id,
      };
    case JobDetailsActionTypes.LoadJobDetailsFailureType:
    case JobDetailsActionTypes.DeleteJobFailureType:
    case JobDetailsActionTypes.CreateJobFailureType:
    case JobDetailsActionTypes.ReconcileJobFailureType:
    case JobDetailsActionTypes.DuplicateJobFailureType:
    case JobDetailsActionTypes.DeleteFilteredJobsFailureType:
      return {
        ...state,
        loading: false,
        jobReconciled: false,
        jobDeleted: false,
        jobDuplicated: false,
        deletedCount: null,
        failure: action.payload.failure
      };
    case JobDetailsActionTypes.ClearFailureStateType:
      return {
        ...state,
        jobDeleted: null,
        deletedCount: null,
        failure: null
      };

    default:
      return state;
  }
}
