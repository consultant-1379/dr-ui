import { Action } from '@ngrx/store';
import { ApplicationItemsResponse } from 'src/app/models/application-items-response.model';
import { Failure } from '@erad/utils';
import { QueryParams } from 'src/app/models/query.params.model';

export enum ApplicationsActionTypes {
  LoadApplicationsType = '[Applications] Load Applications',
  LoadApplicationsSuccessType = '[Applications] Load Applications Success',
  LoadApplicationsFailureType = '[Applications] Load Applications Failure',
  ClearFailureStateType = '[Applications] Clear Failure from store',
}

export class LoadApplications implements Action {
  readonly type = ApplicationsActionTypes.LoadApplicationsType;
  constructor(public payload: { query: QueryParams, id: string }) { }
}

export class LoadApplicationsSuccess implements Action {
  readonly type = ApplicationsActionTypes.LoadApplicationsSuccessType;
  constructor(public payload: { response: ApplicationItemsResponse }) { }
}

export class LoadApplicationsFailure implements Action {
  readonly type = ApplicationsActionTypes.LoadApplicationsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class ClearFailureState implements Action {
  readonly type = ApplicationsActionTypes.ClearFailureStateType;
}

export type ApplicationsActions =
  | LoadApplications
  | LoadApplicationsSuccess
  | LoadApplicationsFailure
  | ClearFailureState;
