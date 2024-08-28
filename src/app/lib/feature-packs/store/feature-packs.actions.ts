import { ApplicationItemsResponse, FeaturePackApplicationPayload } from 'src/app/models/application-items-response.model';

import { Action } from '@ngrx/store';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Failure } from '@erad/utils';
import { FeaturePackItemsResponse } from '../../../models/feature-pack-items-response.model';
import { QueryParams } from 'src/app/models/query.params.model';

export enum FeaturePacksActionTypes {
  LoadFeaturePacksType = '[FeaturePacks] Load Feature Packs',
  LoadFeaturePacksSuccessType = '[FeaturePacks] Load Feature Packs Success',
  LoadFeaturePacksFailureType = '[FeaturePacks] Load Feature Packs Failure',
  LoadFeaturePackApplicationsType = '[FeaturePacks] Load Feature Packs Applications',
  LoadFeaturePackApplicationsSuccessType = '[FeaturePacks] Load Feature Packs Applications Success',
  LoadFeaturePackApplicationsFailureType = '[FeaturePacks] Load Feature Packs Applications Failure',
  LoadAllFeaturePacksType ='[FeaturePacks] Load all Feature Pack for Dropdown ',
  LoadAllFeaturePacksSuccessType = '[FeaturePacks] Load all Feature Packs for Dropdown Success',
  LoadAllFeaturePacksFailureType ='[FeaturePacks] Load all Feature Packs for Dropdown Failure',
  ClearFailureStateType = '[FeaturePacks] Clear Failure from store',
}

export class LoadFeaturePacks implements Action {
  readonly type = FeaturePacksActionTypes.LoadFeaturePacksType;
  constructor(public payload: { query: QueryParams }) { }
}

export class LoadFeaturePacksSuccess implements Action {
  readonly type = FeaturePacksActionTypes.LoadFeaturePacksSuccessType;
  constructor(public payload: { response: FeaturePackItemsResponse }) { }
}

export class LoadFeaturePacksFailure implements Action {
  readonly type = FeaturePacksActionTypes.LoadFeaturePacksFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class LoadFeaturePackApplications implements Action {
  readonly type = FeaturePacksActionTypes.LoadFeaturePackApplicationsType;
  constructor(public payload: FeaturePackApplicationPayload ) { }
}

export class LoadFeaturePackApplicationsSuccess implements Action {
  readonly type = FeaturePacksActionTypes.LoadFeaturePackApplicationsSuccessType;
  constructor(public payload: { featurePackId: string, response: ApplicationItemsResponse }) { }
}

export class LoadFeaturePackApplicationsFailure implements Action {
  readonly type = FeaturePacksActionTypes.LoadFeaturePackApplicationsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class LoadAllFeaturePacks implements Action {
  readonly type = FeaturePacksActionTypes.LoadAllFeaturePacksType;
}

export class LoadAllFeaturePacksSuccess implements Action {
  readonly type = FeaturePacksActionTypes.LoadAllFeaturePacksSuccessType;
  constructor(public payload:{ response: FeaturePackItemsResponse }) { }
}

export class LoadAllFeaturePacksFailure implements Action {
  readonly type = FeaturePacksActionTypes.LoadAllFeaturePacksFailureType;
  constructor(public payload: { failure: DnrFailure }) { }
}

export class ClearFailureState implements Action {
  readonly type = FeaturePacksActionTypes.ClearFailureStateType;
}

export type FeaturePackActions =
  | LoadFeaturePacks
  | LoadFeaturePacksSuccess
  | LoadFeaturePacksFailure
  | LoadFeaturePackApplications
  | LoadFeaturePackApplicationsSuccess
  | LoadFeaturePackApplicationsFailure
  | LoadAllFeaturePacks
  | LoadAllFeaturePacksSuccess
  | LoadAllFeaturePacksFailure
  | ClearFailureState
