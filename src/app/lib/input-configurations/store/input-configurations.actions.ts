import { Action } from '@ngrx/store';
import { Failure } from '@erad/utils';
import { InputConfigurationsItemsResponses } from 'src/app/models/input-configurations-items-response.model';
import { QueryParams } from 'src/app/models/query.params.model';

export enum InputConfigsActionTypes {
  LoadInputConfigsType = '[Input Configs] Load Input Configs',
  LoadInputConfigsSuccessType = '[Input Configs] Load Input Configs Success',
  LoadInputConfigsFailureType = '[Input Configs] Load Input Configs Failure',
  ClearFailureStateType = '[Input Configs] Clear Failure from store',
}

export class LoadInputConfigs implements Action {
  readonly type = InputConfigsActionTypes.LoadInputConfigsType;
  constructor(public payload: { query: QueryParams, id: string }) { }
}

export class LoadInputConfigsSuccess implements Action {
  readonly type = InputConfigsActionTypes.LoadInputConfigsSuccessType;
  constructor(public payload: { response: InputConfigurationsItemsResponses }) { }
}

export class LoadInputConfigsFailure implements Action {
  readonly type = InputConfigsActionTypes.LoadInputConfigsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class ClearFailureState implements Action {
  readonly type = InputConfigsActionTypes.ClearFailureStateType;
}

export type InputConfigsActions =
  | LoadInputConfigs
  | LoadInputConfigsSuccess
  | LoadInputConfigsFailure
  | ClearFailureState;
