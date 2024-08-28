import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  CreateJob,
  CreateJobFailure,
  CreateJobSuccess,
  DeleteFilteredJobs,
  DeleteFilteredJobsFailure,
  DeleteFilteredJobsSuccess,
  DeleteJob,
  DeleteJobFailure,
  DeleteJobSuccess,
  DuplicateJob,
  DuplicateJobFailure,
  DuplicateJobSuccess,
  JobDetailsActionTypes,
  LoadJobDetails,
  LoadJobDetailsFailure,
  LoadJobDetailsSuccess,
  ReconcileAllJob,
  ReconcileJob,
  ReconcileJobFailure,
  ReconcileJobSuccess,
}
  from './job-details.actions';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { map, switchMap } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { Injectable } from '@angular/core';
import { JobsService } from 'src/app/rest-services/jobs.service';

@UnsubscribeAware()
@Injectable()
export class JobDetailsEffects {

  loadAssociationTypes$ = createEffect(() => this.actions$.pipe(
    takeUntilDestroyed(this),
    ofType(JobDetailsActionTypes.LoadJobDetailsType),
    switchMap(action => this.jobsService.getDiscoveryJobById(action.payload.id)
      .pipe(
        map(response => new LoadJobDetailsSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(LoadJobDetailsFailure)
      )
    )
  ));

  createJob$ = createEffect(() => this.createActions$.pipe(
    ofType(JobDetailsActionTypes.CreateJobType),
    switchMap(action => this.jobsService.createJob(
      action.payload.data,
    )
      .pipe(
        map(response => new CreateJobSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(CreateJobFailure)
      )
    )
  ));

  reconcileAllJob$ = createEffect(() => this.reconcileAllActions$.pipe(
    ofType(JobDetailsActionTypes.ReconcileAllJobType),
    switchMap(action => this.jobsService.reconcileAllJob(
      action.payload.id,
      action.payload.data,
    )
      .pipe(
        map(() =>
          this.getReconcileSuccess(action.payload.id, action.payload.showSuccessMessage)),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(ReconcileJobFailure)
      )
    )
  ));

  reconcileJob$ = createEffect(() => this.reconcileActions$.pipe(
    ofType(JobDetailsActionTypes.ReconcileJobType),
    switchMap(action => this.jobsService.reconcileJob(
      action.payload.id,
      action.payload.data,
    )
      .pipe(
        map(() =>
          this.getReconcileSuccess(action.payload.id, action.payload.showSuccessMessage)),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(ReconcileJobFailure)
      )
    )
  ));

  duplicateJob$ = createEffect(() => this.duplicateActions$.pipe(
    ofType(JobDetailsActionTypes.DuplicateJobType),
    switchMap((action: any) => this.jobsService.duplicateJob(
      action.payload.id
    )
      .pipe(
        map(() =>
          this.getDuplicateJobSuccess(action.payload.id,
            action.payload.name,
            action.payload.showSuccessMessage)),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(DuplicateJobFailure)
      )
    )
  ));

  deleteJob$ = createEffect(() => this.deleteActions$.pipe(
    ofType(JobDetailsActionTypes.DeleteJobType),
    switchMap((action: any) => this.jobsService.deleteJob(action.payload.id)
      .pipe(
        map(() =>
          this.getDeleteSuccess(action.payload.id,
            action.payload.name,
            action.payload.showSuccessMessage)),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(DeleteJobFailure)
      )
    )
  ));

  deleteFilteredJobs$ = createEffect(() => this.deleteFilteredJobsActions$.pipe(
    ofType(JobDetailsActionTypes.DeleteFilteredJobsType),
    switchMap((action: any) => this.jobsService.deleteFilteredJobs(action.payload.query)
      .pipe(
        map((response) => this.getDeleteFilteredJobSuccess (response.deleted, action.payload.showSuccessMessage)),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(DeleteFilteredJobsFailure)
      )
    )
  ));

  getReconcileSuccess(id: string, showSuccessMessage?: boolean) {
    if (showSuccessMessage) {
      this.helper.showSuccessMessage('SUCCESS', 'messages.RECONCILE_SUCCESS');
    }
    return new ReconcileJobSuccess({ id });
  }

  getDeleteSuccess(id: string, name: string, showSuccessMessage?: boolean) {
    if (showSuccessMessage) {
      this.helper.showSuccessMessage('SUCCESS', 'messages.DELETE_JOB_SUCCESS', { id, name });
    }
    return new DeleteJobSuccess({ id });
  }

  getDeleteFilteredJobSuccess(deleted: number, showSuccessMessage?: boolean) {
    if (showSuccessMessage) {
      this.helper.showSuccessMessage('SUCCESS', 'messages.DELETE_FILTERED_JOBS_SUCCESS', { deleted });
    }
    return new DeleteFilteredJobsSuccess({ deleted });
  }

  getDuplicateJobSuccess(id: string, name: string, showSuccessMessage?: boolean) {
    if (showSuccessMessage) {
      this.helper.showSuccessMessage('SUCCESS', 'messages.DUPLICATE_JOB_SUCCESS', { id, name });
    }
    return new DuplicateJobSuccess({ id });
  }

  constructor(
    readonly actions$: Actions<LoadJobDetails>,
    readonly createActions$: Actions<CreateJob>,
    readonly reconcileActions$: Actions<ReconcileJob>,
    readonly reconcileAllActions$: Actions<ReconcileAllJob>,
    readonly deleteActions$: Actions<DeleteJob>,
    readonly deleteFilteredJobsActions$: Actions<DeleteFilteredJobs>,
    readonly duplicateActions$: Actions<DuplicateJob>,
    readonly jobsService: JobsService,
    readonly helper: EffectsHelperService
  ) { }

}
