import { JobReconcileAllData, JobReconcileData } from 'src/app/models/job-reconcile.model';

import { Action } from '@ngrx/store';
import { ExecutionJob } from 'src/app/models/execute-job.model';
import { Failure } from '@erad/utils';
import { Job } from 'src/app/models/job.model';
import { QueryParams } from 'src/app/models/query.params.model';

export enum JobDetailsActionTypes {
  LoadJobDetailsType = '[JobDetails] Load Job Details',
  LoadJobDetailsSuccessType = '[JobDetails] Load Job Details Success',
  LoadJobDetailsFailureType = '[JobDetails] Load Job Details Failure',

  CreateJobType = '[Jobs] Create Job',
  CreateJobSuccessType = '[Jobs] Create Jobs Success',
  CreateJobFailureType = '[Jobs] Create Jobs Failure',

  ReconcileJobType = '[Jobs] Reconcile Job',
  ReconcileAllJobType = '[Jobs] Reconcile All Job',
  ReconcileJobSuccessType = '[Jobs] Reconcile Jobs Success',
  ReconcileJobFailureType = '[Jobs] Reconcile Jobs Failure',

  DuplicateJobType = '[Jobs] Duplicate Job',
  DuplicateJobSuccessType = '[Jobs] Duplicate Jobs Success',
  DuplicateJobFailureType = '[Jobs] Duplicate Jobs Failure',

  DeleteJobType = '[Jobs] Delete Job',
  DeleteJobSuccessType = '[Jobs] Delete Jobs Success',
  DeleteJobFailureType = '[Jobs] Delete Jobs Failure',

  DeleteFilteredJobsType = '[Jobs] Delete Filtered Jobs',
  DeleteFilteredJobsSuccessType = '[Jobs] Delete Filtered Jobs Success',
  DeleteFilteredJobsFailureType = '[Jobs] Delete Filtered Jobs Failure',

  ClearFailureStateType = '[Jobs] Clear Failure from store',
}

export class LoadJobDetails implements Action {
  readonly type = JobDetailsActionTypes.LoadJobDetailsType;
  constructor(public payload: { id: string }) { }
}

export class LoadJobDetailsSuccess implements Action {
  readonly type = JobDetailsActionTypes.LoadJobDetailsSuccessType;
  constructor(public payload: { response: Job }) { }
}

export class LoadJobDetailsFailure implements Action {
  readonly type = JobDetailsActionTypes.LoadJobDetailsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class CreateJob implements Action {
  readonly type = JobDetailsActionTypes.CreateJobType;
  constructor(public payload: { data: ExecutionJob }) { }
}

export class CreateJobSuccess implements Action {
  readonly type = JobDetailsActionTypes.CreateJobSuccessType;
  constructor(public payload: { response: { id: string } }) { }
}

export class CreateJobFailure implements Action {
  readonly type = JobDetailsActionTypes.CreateJobFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class ReconcileJob implements Action {
  readonly type = JobDetailsActionTypes.ReconcileJobType;
  constructor(public payload: { id: string, data: JobReconcileData, showSuccessMessage?: boolean }) { }
}

export class ReconcileAllJob implements Action {
  readonly type = JobDetailsActionTypes.ReconcileAllJobType;
  constructor(public payload: { id: string, data: JobReconcileAllData, showSuccessMessage?: boolean }) { }
}

export class ReconcileJobSuccess implements Action {
  readonly type = JobDetailsActionTypes.ReconcileJobSuccessType;
  constructor(public payload: { id: string }) { }
}

export class ReconcileJobFailure implements Action {
  readonly type = JobDetailsActionTypes.ReconcileJobFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class DeleteJob implements Action {
  readonly type = JobDetailsActionTypes.DeleteJobType;
  constructor(public payload: {
    id: string,
    name: string,
    showSuccessMessage?: boolean
  }) { }
}

export class DeleteFilteredJobs implements Action {
  readonly type = JobDetailsActionTypes.DeleteFilteredJobsType;
  constructor(public payload: { query: QueryParams,  showSuccessMessage?: boolean }) {}
}

export class DeleteFilteredJobsSuccess implements Action {
  readonly type = JobDetailsActionTypes.DeleteFilteredJobsSuccessType;
  constructor(public payload: { deleted: number, showSuccessMessage?: boolean }) { }
}

export class DeleteFilteredJobsFailure implements Action {
  readonly type = JobDetailsActionTypes.DeleteFilteredJobsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class DeleteJobSuccess implements Action {
  readonly type = JobDetailsActionTypes.DeleteJobSuccessType;
  constructor(public payload: { id: string }) { }
}

export class DeleteJobFailure implements Action {
  readonly type = JobDetailsActionTypes.DeleteJobFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class DuplicateJob implements Action {
  readonly type = JobDetailsActionTypes.DuplicateJobType;

  /* job name is not unique and will be duplicated (good to have
     id of job being duplicated and name (same) of job being created
     in the success message when duplicating) */
  constructor(public payload: {
    id: string,
    name: string,
    showSuccessMessage?: boolean
  }) { }
}

export class DuplicateJobSuccess implements Action {
  readonly type = JobDetailsActionTypes.DuplicateJobSuccessType;
  constructor(public payload: { id: string, showSuccessMessage?: boolean }) { }
}

export class DuplicateJobFailure implements Action {
  readonly type = JobDetailsActionTypes.DuplicateJobFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class ClearFailureState implements Action {
  readonly type = JobDetailsActionTypes.ClearFailureStateType;
}

export type JobDetailsActions =
  | LoadJobDetails
  | LoadJobDetailsSuccess
  | LoadJobDetailsFailure
  | CreateJob
  | CreateJobSuccess
  | CreateJobFailure
  | ReconcileJob
  | ReconcileAllJob
  | ReconcileJobSuccess
  | ReconcileJobFailure
  | DeleteJob
  | DeleteJobSuccess
  | DeleteJobFailure
  | DeleteFilteredJobs
  | DeleteFilteredJobsSuccess
  | DeleteFilteredJobsFailure
  | DuplicateJob
  | DuplicateJobSuccess
  | DuplicateJobFailure
  | ClearFailureState;
