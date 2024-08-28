import { InputConfigsActionTypes, InputConfigsActions } from './input-configurations.actions';

import { AbstractFetchState } from '@erad/core';
import { InputConfiguration } from 'src/app/models/input-configuration.model';

export const inputConfigsKey = 'inputConfigs';

export interface InputConfigsState extends AbstractFetchState {
  inputConfigurations: InputConfiguration[];
  totalCount: number;
}

export const initialState: InputConfigsState = {
  inputConfigurations: null,
  failure: null,
  loading: false,
  totalCount: 0
};

export function InputConfigsReducer(state: InputConfigsState, action: InputConfigsActions): InputConfigsState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case InputConfigsActionTypes.LoadInputConfigsType:
      return {
        ...state,
        loading: true,
        failure: null,
      };
    case InputConfigsActionTypes.LoadInputConfigsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        inputConfigurations: action.payload.response.items,
        totalCount: action.payload.response.totalCount
      };
    case InputConfigsActionTypes.LoadInputConfigsFailureType:
      return {
        ...state,
        loading: false,
        failure: action.payload.failure
      };
    case InputConfigsActionTypes.ClearFailureStateType:
      return {
        ...state,
        failure: null
      };

    default:
      return state;
  }
}
