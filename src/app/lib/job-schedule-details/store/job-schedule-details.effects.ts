import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  CreateJobSchedule,
  CreateJobScheduleFailure,
  CreateJobScheduleSuccess,
  DeleteJobSchedule,
  DeleteJobScheduleFailure,
  DeleteJobScheduleSuccess,
  EnableJobSchedule,
  EnableJobScheduleFailure,
  EnableJobScheduleSuccess,
  JobScheduleDetailsActionTypes,
  LoadJobScheduleDetails,
  LoadJobScheduleDetailsFailure,
  LoadJobScheduleDetailsSuccess,
} from './job-schedule-details.actions';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { map, switchMap } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { Injectable } from '@angular/core';
import { JobScheduleService } from 'src/app/rest-services/job-schedule.service';

@UnsubscribeAware()
@Injectable()
export class JobScheduleDetailsEffects {

  loadScheduleTypes$ = createEffect(() => this.actions$.pipe(
    takeUntilDestroyed(this),
    ofType(JobScheduleDetailsActionTypes.LoadJobScheduleDetailsType),
    switchMap(action => this.jobScheduleService.getJobScheduleById(action.payload.id)
      .pipe(
        map(response => new LoadJobScheduleDetailsSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(LoadJobScheduleDetailsFailure)
      )
    )
  ));

  createJobSchedule$ = createEffect(() => this.createActions$.pipe(
    ofType(JobScheduleDetailsActionTypes.CreateJobScheduleType),
    switchMap(action => this.jobScheduleService.createJobSchedule(
      action.payload.data,
    )
      .pipe(
        map(response => new CreateJobScheduleSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(CreateJobScheduleFailure)
      )
    )
  ));

  enableJobSchedule$ = createEffect(() => this.enableActions$.pipe(
    ofType(JobScheduleDetailsActionTypes.EnableJobScheduleType),
    switchMap((action: any) => this.jobScheduleService.enableJobSchedule(action.payload.id, action.payload.enabled)
      .pipe(
        map(() =>
          this.getEnableSuccess(action.payload)),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(EnableJobScheduleFailure)
      )
    )
  ));

  getEnableSuccess({ id, name, enabled, showSuccessMessage }) {
    if (showSuccessMessage) {
      const msg = (enabled) ? "JOB_SCHEDULE_ENABLE_SUCCESS" : "JOB_SCHEDULE_DISABLE_SUCCESS";
      this.helper.showSuccessMessage('SUCCESS', 'messages.' + msg, { id, name });
    }
    return new EnableJobScheduleSuccess({ id });
  }

  deleteJobSchedule$ = createEffect(() => this.deleteActions$.pipe(
    ofType(JobScheduleDetailsActionTypes.DeleteJobScheduleType),
    switchMap((action:any) => this.jobScheduleService.deleteJobSchedule(action.payload.id)
        .pipe(
          map(() =>
            this.getDeleteSuccess(action.payload)),
            this.helper.showErrorMessage(),
            this.helper.handleFailure(DeleteJobScheduleFailure)
          )
    )
  ));

  getDeleteSuccess({ id, name, showSuccessMessage }) {
    if (showSuccessMessage) {
      this.helper.showSuccessMessage('SUCCESS', 'messages.DELETE_JOB_SCHEDULE_SUCCESS', { id, name } );
    }
    return new DeleteJobScheduleSuccess({ id });
  }

  constructor(
    readonly actions$: Actions<LoadJobScheduleDetails>,
    readonly createActions$: Actions<CreateJobSchedule>,
    readonly enableActions$: Actions<EnableJobSchedule>,
    readonly deleteActions$: Actions<DeleteJobSchedule>,
    readonly jobScheduleService: JobScheduleService,
    readonly helper: EffectsHelperService
  ) { }

}
