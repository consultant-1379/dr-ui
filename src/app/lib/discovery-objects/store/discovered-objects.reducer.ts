import { DiscoveredObjectsActionTypes, DiscoveredObjectsActions } from './discovered-objects.actions';

import { AbstractFetchState } from '@erad/core';
import { DiscoveredObjects } from 'src/app/models/discovered-objects.model';

export const discoveredObjectsFeatureKey = 'discoveredObjects';

export interface DiscoveredObjectsState extends AbstractFetchState {
  discoveredObjects: DiscoveredObjects[];
  totalCount: number;
}

export const initialState: DiscoveredObjectsState = {
  discoveredObjects: null,
  failure: null,
  loading: false,
  totalCount: 0
};

export function discoveredObjectsReducer(state: DiscoveredObjectsState, action: DiscoveredObjectsActions): DiscoveredObjectsState {
  if (typeof state === 'undefined'){
    state = initialState; // avoid "Default parameter should be last" SONAR issue if were to set via a default parameter
  }
  switch (action.type) {
    case DiscoveredObjectsActionTypes.LoadDiscoveredObjectsType:
      return {
        ...state,
        loading: true,
        failure: null,
        // need to set to -1 as subscribers only called if count changes,
        // so if go from 1 table to another and count is the same on both tables, the sub won't be informed.
        // Setting to -1 means, sub will be called as e.g. going from 50 -> -1 -> 50
        totalCount: -1,
      };
    case DiscoveredObjectsActionTypes.LoadDiscoveredObjectsSuccessType:
      return {
        ...state,
        loading: false,
        failure: null,
        discoveredObjects: action.payload.response.items,
        totalCount: action.payload.response.totalCount
      };
    case DiscoveredObjectsActionTypes.LoadDiscoveredObjectsFailureType:
      return {
        ...state,
        loading: false,
        failure: action.payload.failure
      };
    case DiscoveredObjectsActionTypes.ClearFailureStateType:
      return {
        ...state,
        failure: null
      };

    default:
      return state;
  }
}
