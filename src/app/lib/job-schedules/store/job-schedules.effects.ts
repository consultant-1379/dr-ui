import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  JobSchedulesActionTypes,
  LoadJobSchedules,
  LoadJobSchedulesFailure,
  LoadJobSchedulesSuccess
} from './job-schedules.actions';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { JobScheduleService } from 'src/app/rest-services/job-schedule.service';
import { Injectable } from '@angular/core';

@Injectable()
export class JobSchedulesEffects {
  loadJobSchedules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobSchedulesActionTypes.LoadJobSchedulesType),
      switchMap((action) =>
        this.jobScheduleService
          .getJobSchedules({
            limit: action.payload.query?.limit,
            offset: action.payload.query?.offset,
            sort: action.payload.query?.sort || '-id',
            filters: action.payload.query?.filters,
          })
          .pipe(
            filter((response) => !!response),
            take(1),
            map((response) => new LoadJobSchedulesSuccess({ response })),
            this.helper.showErrorMessage(),
            this.helper.handleFailure(LoadJobSchedulesFailure)
          )
      )
    )
  );

  constructor(
    readonly actions$: Actions<LoadJobSchedules>,
    readonly jobScheduleService: JobScheduleService,
    readonly helper: EffectsHelperService) { }
}
