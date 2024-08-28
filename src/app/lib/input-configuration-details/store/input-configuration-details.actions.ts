import { Action } from '@ngrx/store';
import { Failure } from '@erad/utils';
import { InputConfigurationDetails } from 'src/app/models/input-configuration-details.model';

export enum InputConfigDetailsActionTypes {
  LoadInputConfigDetailsType = '[InputConfigDetails] Load Input Config Details',
  LoadInputConfigDetailsSuccessType = '[InputConfigDetails] Load Input Config Details Success',
  LoadInputConfigDetailsFailureType = '[InputConfigDetails] Load Input Config Details Failure',
  ClearFailureStateType = '[InputConfigDetails] Clear Failure from store',
}

export class LoadInputConfigDetails implements Action {
  readonly type = InputConfigDetailsActionTypes.LoadInputConfigDetailsType;
  constructor(public payload: { featureId: string, configurationId: string }) { }
}

export class LoadInputConfigDetailsSuccess implements Action {
  readonly type = InputConfigDetailsActionTypes.LoadInputConfigDetailsSuccessType;
  constructor(public payload: { response: InputConfigurationDetails }) { }
}

export class LoadInputConfigDetailsFailure implements Action {
  readonly type = InputConfigDetailsActionTypes.LoadInputConfigDetailsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class ClearFailureState implements Action {
  readonly type = InputConfigDetailsActionTypes.ClearFailureStateType;
}

export type InputConfigDetailsActions =
  | LoadInputConfigDetails
  | LoadInputConfigDetailsSuccess
  | LoadInputConfigDetailsFailure
  | ClearFailureState;
