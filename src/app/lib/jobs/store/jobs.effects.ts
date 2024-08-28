import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  JobsActionTypes,
  LoadJobs,
  LoadJobsFailure,
  LoadJobsSuccess,
} from './jobs.actions';
import { map, switchMap } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { Injectable } from '@angular/core';
import { JobsService } from 'src/app/rest-services/jobs.service';

@Injectable()
export class JobsEffects {
  loadAssociationTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobsActionTypes.LoadJobsType),
      switchMap((action) =>
        this.jobsService
          .getDiscoveryJobs({
            limit: action.payload.query?.limit,
            offset: action.payload.query?.offset,
            sort: action.payload.query?.sort || '-id',
            filters: action.payload.query?.filters,
          })
          .pipe(
            map((response) => new LoadJobsSuccess({ response })),
            this.helper.showErrorMessage(),
            this.helper.handleFailure(LoadJobsFailure)
          )
      )
    )
  );

  constructor(
    readonly actions$: Actions<LoadJobs>,
    readonly jobsService: JobsService,
    readonly helper: EffectsHelperService
  ) {}
}
