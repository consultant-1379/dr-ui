import { Action } from '@ngrx/store';
import { DiscoveredObjectsItemsResponse } from 'src/app/models/discovered-objects-items-response.model';
import { Failure } from '@erad/utils';
import { QueryParams } from 'src/app/models/query.params.model';

export enum DiscoveredObjectsActionTypes {
  LoadDiscoveredObjectsType = '[DiscoveredObjects] Load Discovered Objects',
  LoadDiscoveredObjectsSuccessType = '[DiscoveredObjects] Load Discovered Objects Success',
  LoadDiscoveredObjectsFailureType = '[DiscoveredObjects] Load Discovered Objects Failure',
  ClearFailureStateType = '[DiscoveredObjects] Clear Failure from store',
}

export class LoadDiscoveredObjects implements Action {
  readonly type = DiscoveredObjectsActionTypes.LoadDiscoveredObjectsType;
  constructor(public payload: { query: QueryParams, id: string }) { }
}

export class LoadDiscoveredObjectsSuccess implements Action {
  readonly type = DiscoveredObjectsActionTypes.LoadDiscoveredObjectsSuccessType;
  constructor(public payload: { response: DiscoveredObjectsItemsResponse }) { }
}

export class LoadDiscoveredObjectsFailure implements Action {
  readonly type = DiscoveredObjectsActionTypes.LoadDiscoveredObjectsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class ClearFailureState implements Action {
  readonly type = DiscoveredObjectsActionTypes.ClearFailureStateType;
}

export type DiscoveredObjectsActions =
  | LoadDiscoveredObjects
  | LoadDiscoveredObjectsSuccess
  | LoadDiscoveredObjectsFailure
  | ClearFailureState;
