import { FeaturePackDetailsActionTypes, FeaturePackDetailsActions } from './feature-pack-details.actions';

import { AbstractFetchState } from '@erad/core';
import { FeaturePackDetailsResponse } from 'src/app/models/feature-pack-details-response.model';

export const featurePackDetailsFeatureKey = 'featurePack';

export interface FeaturePackDetailsState extends AbstractFetchState {
  featurePackDetails: FeaturePackDetailsResponse;
  uploadSuccess: boolean;
  featurePackDeleted?: boolean;
}

export const initialState: FeaturePackDetailsState = {
  featurePackDetails: null,
  failure: null,
  loading: false,
  uploadSuccess: false,
};

export function featurePackDetailsReducer(state: FeaturePackDetailsState, action: FeaturePackDetailsActions): FeaturePackDetailsState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case FeaturePackDetailsActionTypes.LoadFeaturePackDetailsType:
    case FeaturePackDetailsActionTypes.UploadFeaturePackType:
    case FeaturePackDetailsActionTypes.UpdateFeaturePackType:
      return {
        ...state,
        loading: true,
        failure: null,
        uploadSuccess: false
      };
    case FeaturePackDetailsActionTypes.LoadFeaturePackDetailsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        featurePackDetails: action.payload.response,
      };

      case FeaturePackDetailsActionTypes.DeleteFeaturePackSuccessType:
      return {
        ...state,
        featurePackDeleted: true,
      };
    case FeaturePackDetailsActionTypes.DeleteFeaturePackType:
      return {
        ...state,
        featurePackDeleted: null
      };
    case FeaturePackDetailsActionTypes.UploadFeaturePackSuccessType:
    case FeaturePackDetailsActionTypes.UpdateFeaturePackSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        featurePackDetails: action.payload.response,
        uploadSuccess: true
      };
    case FeaturePackDetailsActionTypes.LoadFeaturePackDetailsFailureType:
    case FeaturePackDetailsActionTypes.UploadFeaturePackFailureType:
    case FeaturePackDetailsActionTypes.UpdateFeaturePackFailureType:
    case FeaturePackDetailsActionTypes.DeleteFeaturePackFailureType:
      return {
        ...state,
        loading: false,
        failure: action.payload.failure,
        featurePackDeleted: false
      };
    case FeaturePackDetailsActionTypes.ClearFailureStateType:
      return {
        ...state,
        uploadSuccess: false,
        failure: null
      };

    default:
      return state;
  }
}
