
import { Failure } from '@erad/utils';
import { Action } from '@ngrx/store';
import { JobScheduleItemsResponse } from 'src/app/models/job-schedule-items-response.model';
import { QueryParams } from 'src/app/models/query.params.model';

export enum JobSchedulesActionTypes {
  LoadJobSchedulesType = '[JobSchedules] Load Feature Packs',
  LoadJobSchedulesSuccessType = '[JobSchedules] Load Feature Packs Success',
  LoadJobSchedulesFailureType = '[JobSchedules] Load Feature Packs Failure',
  ClearFailureStateType = '[JobSchedules] Clear Failure from store',
}

export class LoadJobSchedules implements Action {
  readonly type = JobSchedulesActionTypes.LoadJobSchedulesType;
  constructor(public payload: { query: QueryParams }) { }
}

export class LoadJobSchedulesSuccess implements Action {
  readonly type = JobSchedulesActionTypes.LoadJobSchedulesSuccessType;
  constructor(public payload: { response: JobScheduleItemsResponse }) { }
}

export class LoadJobSchedulesFailure implements Action {
  readonly type = JobSchedulesActionTypes.LoadJobSchedulesFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class ClearFailureState implements Action {
  readonly type = JobSchedulesActionTypes.ClearFailureStateType;
}

export type JobScheduleActions =
  | LoadJobSchedules
  | LoadJobSchedulesSuccess
  | LoadJobSchedulesFailure
  | ClearFailureState
