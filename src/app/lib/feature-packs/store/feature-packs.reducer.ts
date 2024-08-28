import { FeaturePackActions, FeaturePacksActionTypes } from './feature-packs.actions';

import { AbstractFetchState } from '@erad/core';
import { Application } from 'src/app/models/application.model';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { DropdownOption } from 'src/app/models/dropdown-option.model';
import { FeaturePack } from 'src/app/models/feature-pack.model';

export const featurePacksFeatureKey = 'featurePacks';

export interface FeaturePacksState extends AbstractFetchState { // TODO AbstractFetchState has Failure not DnrFailure (but seems to work)

  featurePacks: FeaturePack[];

  applications: {
    items?: Application[],
    totalCount?: number
  }

  totalCount: number;
  featurePackDeleted?: boolean;
  allFeaturePacks: DropdownOption [];
  allLoading: boolean;
  allFailure: DnrFailure;
}

export const initialState: FeaturePacksState = {
  featurePacks: [],
  applications: {},
  failure: null,
  loading: false,
  totalCount: 0,
  allLoading: false,
  allFeaturePacks: [],
  allFailure: null,
};

export function featurePacksReducer(state: FeaturePacksState, action: FeaturePackActions): FeaturePacksState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case FeaturePacksActionTypes.LoadFeaturePacksType:
      return {
        ...state,
        loading: true,
        failure: null,
      }
    case FeaturePacksActionTypes.LoadFeaturePacksSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        featurePacks: action.payload.response.items,
        totalCount: action.payload.response.totalCount,
      }
    case FeaturePacksActionTypes.LoadFeaturePackApplicationsType:
      return {
        ...state,
        failure: null,
      }
    case FeaturePacksActionTypes.LoadFeaturePackApplicationsSuccessType:
      return {
        ...state,
        failure: null,
        applications: {
          items: action.payload.response.items,
          totalCount: action.payload.response.totalCount
        }
      }
    case FeaturePacksActionTypes.LoadFeaturePacksFailureType:
      return {
        ...state,
        loading: false,
        failure: action.payload.failure,
        featurePackDeleted: false,
      }
    case FeaturePacksActionTypes.LoadFeaturePackApplicationsFailureType:
      return {
        ...state,
        failure: action.payload.failure
      }
    case FeaturePacksActionTypes.LoadAllFeaturePacksType:
      return {
        ...state,
        allLoading: true,
        failure: null,
      }
    case FeaturePacksActionTypes.LoadAllFeaturePacksFailureType:
      return {
        ...state,
        allLoading: false,
        allFailure: action.payload.failure,
      }
    case FeaturePacksActionTypes.LoadAllFeaturePacksSuccessType: {
      return {
        ...state,
        allLoading: false,
        allFailure: null,
        allFeaturePacks: action.payload.response.items.map((item) => {
          return { /* all Feature packs for dropdown only */
            value: item.id,
            label: item.name,
            description: item.description
          }
        })
      }
    }
    case FeaturePacksActionTypes.ClearFailureStateType: {
      return {
        ...state,
        failure: null
      }
    }
    default:
      return state;
  }
}
