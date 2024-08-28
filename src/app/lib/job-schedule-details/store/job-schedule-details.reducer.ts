import { JobScheduleDetailsActionTypes, JobScheduleDetailsActions } from './job-schedule-details.actions';

import { AbstractFetchState } from '@erad/core';
import { Failure } from '@erad/utils/models';
import { JobSchedule } from 'src/app/models/job-schedule.model';

export const jobScheduleDetailsFeatureKey = 'jobScheduleDetails';

export interface JobScheduleDetailsState extends AbstractFetchState {
  jobSchedule?: JobSchedule;
  id?: string,
  jobScheduleDeleted?: boolean;
  jobScheduleEnabledStateChanged?: boolean;
  enableDisableFailure?: Failure
}

export const initialState: JobScheduleDetailsState = {
  jobSchedule: null,
  id: null,
  failure: null,
  enableDisableFailure: null,
  loading: false,
};

export function JobScheduleDetailsReducer(state: JobScheduleDetailsState, action: JobScheduleDetailsActions): JobScheduleDetailsState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case JobScheduleDetailsActionTypes.LoadJobScheduleDetailsType:
    case JobScheduleDetailsActionTypes.CreateJobScheduleType:
    case JobScheduleDetailsActionTypes.EnableJobScheduleType:
    case JobScheduleDetailsActionTypes.DeleteJobScheduleType:
      return {
        ...state,
        loading: true,
        failure: null,
        enableDisableFailure: null,
        jobScheduleDeleted: null,
        id: null,
        jobScheduleEnabledStateChanged: null
      };
    case JobScheduleDetailsActionTypes.EnableJobScheduleSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        enableDisableFailure: null,
        jobScheduleEnabledStateChanged: true,
        id: action.payload.id
      };
    case JobScheduleDetailsActionTypes.DeleteJobScheduleSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        enableDisableFailure: null,
        jobScheduleDeleted: true,
        id: action.payload.id
      };
    case JobScheduleDetailsActionTypes.CreateJobScheduleSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        enableDisableFailure: null,
        id: action.payload.response.id,
      };
    case JobScheduleDetailsActionTypes.LoadJobScheduleDetailsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        enableDisableFailure: null,
        jobSchedule: action.payload.response,
        id: action.payload.response.id,
      };
    case JobScheduleDetailsActionTypes.LoadJobScheduleDetailsFailureType:
    case JobScheduleDetailsActionTypes.DeleteJobScheduleFailureType:
    case JobScheduleDetailsActionTypes.CreateJobScheduleFailureType:
      return {
        ...state,
        loading: false,
        jobScheduleEnabledStateChanged: false,
        jobScheduleDeleted: false,
        failure: action.payload.failure,
        enableDisableFailure: null,
      };
      case JobScheduleDetailsActionTypes.EnableJobScheduleFailureType:
        return {
          ...state,
          loading: false,
          jobScheduleEnabledStateChanged: false,
          jobScheduleDeleted: false,
          failure: null,
          enableDisableFailure: action.payload.failure,
        };
    case JobScheduleDetailsActionTypes.ClearFailureStateType:
      return {
        ...state,
        jobScheduleEnabledStateChanged: null,
        jobScheduleDeleted: null,
        failure: null,
        enableDisableFailure: null
      };

    default:
      return state;
  }
}
