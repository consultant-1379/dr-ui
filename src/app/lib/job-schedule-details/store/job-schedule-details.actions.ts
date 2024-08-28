import { Action } from '@ngrx/store';
import { Failure } from '@erad/utils';
import { JobSchedule } from 'src/app/models/job-schedule.model';
import { JobScheduleCreateData } from 'src/app/models/job-schedule-create.model';

export enum JobScheduleDetailsActionTypes {
  LoadJobScheduleDetailsType = '[JobSchedules] Load Job Details',
  LoadJobScheduleDetailsSuccessType = '[JobSchedules] Load Job Details Success',
  LoadJobScheduleDetailsFailureType = '[JobSchedules] Load Job Details Failure',

  CreateJobScheduleType = '[JobSchedules] Create JobSchedule',
  CreateJobScheduleSuccessType = '[JobSchedules] Create Job Schedule Success',
  CreateJobScheduleFailureType = '[JobSchedules] Create Job Schedule Failure',

  DeleteJobScheduleType = '[JobSchedules] Delete Job Schedule',
  DeleteJobScheduleSuccessType = '[JobSchedules] Delete Job Schedule Success',
  DeleteJobScheduleFailureType = '[JobSchedules] Delete Job Schedule Failure',

  EnableJobScheduleType = '[JobSchedules] Enable Job Schedule',
  EnableJobScheduleSuccessType = '[JobSchedules] Enable Job Schedule Success',
  EnableJobScheduleFailureType = '[JobSchedules] Enable Job Schedule Failure',

  ClearFailureStateType = '[JobSchedules] Clear Failure from store',
}

export class LoadJobScheduleDetails implements Action {
  readonly type = JobScheduleDetailsActionTypes.LoadJobScheduleDetailsType;
  constructor(public payload: { id: string }) { }
}

export class LoadJobScheduleDetailsSuccess implements Action {
  readonly type = JobScheduleDetailsActionTypes.LoadJobScheduleDetailsSuccessType;
  constructor(public payload: { response: JobSchedule }) { }
}

export class LoadJobScheduleDetailsFailure implements Action {
  readonly type = JobScheduleDetailsActionTypes.LoadJobScheduleDetailsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class CreateJobSchedule implements Action {
  readonly type = JobScheduleDetailsActionTypes.CreateJobScheduleType;
  constructor(public payload: { data: JobScheduleCreateData }) { }
}

export class CreateJobScheduleSuccess implements Action {
  readonly type = JobScheduleDetailsActionTypes.CreateJobScheduleSuccessType;
  constructor(public payload: { response: {id: string} }) { }
}

export class CreateJobScheduleFailure implements Action {
  readonly type = JobScheduleDetailsActionTypes.CreateJobScheduleFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class DeleteJobSchedule implements Action {
  readonly type = JobScheduleDetailsActionTypes.DeleteJobScheduleType;
  constructor(public payload: { id: string, name: string, showSuccessMessage?: boolean }) { }
}

export class DeleteJobScheduleSuccess implements Action {
  readonly type = JobScheduleDetailsActionTypes.DeleteJobScheduleSuccessType;
  constructor(public payload: { id: string }) { }
}

export class DeleteJobScheduleFailure implements Action {
  readonly type = JobScheduleDetailsActionTypes.DeleteJobScheduleFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class EnableJobSchedule implements Action {
  readonly type = JobScheduleDetailsActionTypes.EnableJobScheduleType;
  constructor(public payload: { id: string, name: string, enabled: boolean, showSuccessMessage?: boolean }) { }
}

export class EnableJobScheduleSuccess implements Action {
  readonly type = JobScheduleDetailsActionTypes.EnableJobScheduleSuccessType;
  constructor(public payload: { id: string }) { }
}

export class EnableJobScheduleFailure implements Action {
  readonly type = JobScheduleDetailsActionTypes.EnableJobScheduleFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class ClearFailureState implements Action {
  readonly type = JobScheduleDetailsActionTypes.ClearFailureStateType;
}

export type JobScheduleDetailsActions =
  | LoadJobScheduleDetails
  | LoadJobScheduleDetailsSuccess
  | LoadJobScheduleDetailsFailure
  | CreateJobSchedule
  | CreateJobScheduleSuccess
  | CreateJobScheduleFailure
  | EnableJobSchedule
  | EnableJobScheduleSuccess
  | EnableJobScheduleFailure
  | DeleteJobSchedule
  | DeleteJobScheduleSuccess
  | DeleteJobScheduleFailure
  | ClearFailureState;
