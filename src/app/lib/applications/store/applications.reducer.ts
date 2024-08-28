import { ApplicationsActionTypes, ApplicationsActions } from './applications.actions';

import { AbstractFetchState } from '@erad/core';
import { Application } from 'src/app/models/application.model';

export const applicationsFeatureKey = 'applications';

export interface ApplicationsState extends AbstractFetchState {
  applications: Application[];
  totalCount: number;
}

export const initialState: ApplicationsState = {
  applications: null,
  failure: null,
  loading: false,
  totalCount: 0
};

export function applicationsReducer(state: ApplicationsState, action: ApplicationsActions): ApplicationsState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case ApplicationsActionTypes.LoadApplicationsType:
      return {
        ...state,
        loading: true,
        failure: null,
      };
    case ApplicationsActionTypes.LoadApplicationsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        applications: action.payload.response.items,
        totalCount: action.payload.response.totalCount
      };
    case ApplicationsActionTypes.LoadApplicationsFailureType:
      return {
        ...state,
        loading: false,
        failure: action.payload.failure
      };
    case ApplicationsActionTypes.ClearFailureStateType:
      return {
        ...state,
        failure: null
      };

    default:
      return state;
  }
}
