import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  DiscoveredObjectsActionTypes,
  LoadDiscoveredObjects,
  LoadDiscoveredObjectsFailure,
  LoadDiscoveredObjectsSuccess,
} from './discovered-objects.actions';
import { map, switchMap } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { Injectable } from '@angular/core';
import { JobsService } from 'src/app/rest-services/jobs.service';

@Injectable()
export class DiscoveredObjectsEffects {

  loadAssociationTypes$ = createEffect(() => this.actions$.pipe(
    ofType(DiscoveredObjectsActionTypes.LoadDiscoveredObjectsType),
    switchMap(action => this.jobsService.getDiscoverdObjects(action.payload.id, {
      limit: action.payload.query?.limit,
      offset: action.payload.query?.offset,
      sort: action.payload.query?.sort,
      filters: action.payload.query?.filters
    })
    .pipe(
        map(response => new LoadDiscoveredObjectsSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(LoadDiscoveredObjectsFailure)
      )
    )
  ));

  constructor(
    readonly actions$: Actions<LoadDiscoveredObjects>,
    readonly jobsService: JobsService,
    readonly helper: EffectsHelperService

  ) { }

}
