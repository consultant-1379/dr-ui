import { InputConfigDetailsActionTypes, InputConfigDetailsActions } from './input-configuration-details.actions';

import { AbstractFetchState } from '@erad/core';
import { InputConfigurationDetails } from 'src/app/models/input-configuration-details.model';

export const inputConfigKey = 'inputConfigDetails';

export interface InputConfigDetailsState extends AbstractFetchState {
  inputConfig: InputConfigurationDetails;
}

export const initialState: InputConfigDetailsState = {
  inputConfig: null,
  failure: null,
  loading: false,
};

export function inputConfigDetailsReducer(state: InputConfigDetailsState, action: InputConfigDetailsActions): InputConfigDetailsState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case InputConfigDetailsActionTypes.LoadInputConfigDetailsType:
      return {
        ...state,
        loading: true,
        failure: null,
      };
    case InputConfigDetailsActionTypes.LoadInputConfigDetailsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        inputConfig: action.payload.response,
      };
    case InputConfigDetailsActionTypes.LoadInputConfigDetailsFailureType:
      return {
        ...state,
        loading: false,
        failure: action.payload.failure
      };
    case InputConfigDetailsActionTypes.ClearFailureStateType:
      return {
        ...state,
        failure: null
      };

    default:
      return state;
  }
}
