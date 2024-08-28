import { Action } from '@ngrx/store';
import { Failure } from '@erad/utils';
import { JobsItemsResponse } from 'src/app/models/jobs-items-response.model';
import { QueryParams } from 'src/app/models/query.params.model';

export enum JobsActionTypes {
  LoadJobsType = '[Discovery Jobs] Load Jobs',
  LoadJobsSuccessType = '[Discovery Jobs] Load Jobs Success',
  LoadJobsFailureType = '[Discovery Jobs] Load Jobs Failure',

  ClearFailureStateType = '[Discovery Jobs] Clear Failure from store',
}

export class LoadJobs implements Action {
  readonly type = JobsActionTypes.LoadJobsType;
  constructor(public payload: { query: QueryParams }) {}
}

export class LoadJobsSuccess implements Action {
  readonly type = JobsActionTypes.LoadJobsSuccessType;
  constructor(public payload: { response: JobsItemsResponse }) {}
}

export class LoadJobsFailure implements Action {
  readonly type = JobsActionTypes.LoadJobsFailureType;
  constructor(public payload: { failure: Failure }) {}
}


export class ClearFailureState implements Action {
  readonly type = JobsActionTypes.ClearFailureStateType;
}

export type JobsActions =
  LoadJobs |
  LoadJobsSuccess |
  LoadJobsFailure |
  ClearFailureState;
