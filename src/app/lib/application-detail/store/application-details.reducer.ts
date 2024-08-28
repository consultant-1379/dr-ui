import { ApplicationDetailsActionTypes, ApplicationDetailsActions } from './application-details.actions';

import { AbstractFetchState } from '@erad/core';
import { Application } from 'src/app/models/application.model';

export const applicationDetailsFeatureKey = 'applicationDetails';

export interface ApplicationDetailsState extends AbstractFetchState {
  application: Application;
}

export const initialState: ApplicationDetailsState = {
  application: null,
  failure: null,
  loading: false,
};

export function applicationDetailsReducer(state: ApplicationDetailsState, action: ApplicationDetailsActions): ApplicationDetailsState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case ApplicationDetailsActionTypes.LoadApplicationDetailsType:
      return {
        ...state,
        loading: true,
        failure: null,
      };
    case ApplicationDetailsActionTypes.LoadApplicationDetailsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        application: action.payload.response,
      };
    case ApplicationDetailsActionTypes.LoadApplicationDetailsFailureType:
      return {
        ...state,
        loading: false,
        failure: action.payload.failure
      };
    case ApplicationDetailsActionTypes.ClearFailureStateType:
      return {
        ...state,
        failure: null
      };

    default:
      return state;
  }
}
