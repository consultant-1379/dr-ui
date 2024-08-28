import { Action } from '@ngrx/store';
import { Application } from 'src/app/models/application.model';
import { Failure } from '@erad/utils';

export enum ApplicationDetailsActionTypes {
  LoadApplicationDetailsType = '[ApplicationDetails] Load Application Details',
  LoadApplicationDetailsSuccessType = '[ApplicationDetails] Load Application Details Success',
  LoadApplicationDetailsFailureType = '[ApplicationDetails] Load Application Details Failure',
  ClearFailureStateType = '[ApplicationDetails] Clear Failure from store',
}

export class LoadApplicationDetails implements Action {
  readonly type = ApplicationDetailsActionTypes.LoadApplicationDetailsType;
  constructor(public payload: { featureId: string, appId: string }) { }
}

export class LoadApplicationDetailsSuccess implements Action {
  readonly type = ApplicationDetailsActionTypes.LoadApplicationDetailsSuccessType;
  constructor(public payload: { response: Application }) { }
}

export class LoadApplicationDetailsFailure implements Action {
  readonly type = ApplicationDetailsActionTypes.LoadApplicationDetailsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class ClearFailureState implements Action {
  readonly type = ApplicationDetailsActionTypes.ClearFailureStateType;
}

export type ApplicationDetailsActions =
  | LoadApplicationDetails
  | LoadApplicationDetailsSuccess
  | LoadApplicationDetailsFailure
  | ClearFailureState;
