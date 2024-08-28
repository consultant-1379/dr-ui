import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ApplicationsActionTypes,
  LoadApplications,
  LoadApplicationsFailure,
  LoadApplicationsSuccess,
} from './applications.actions';
import { map, switchMap } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ApplicationsEffects {

  loadAssociationTypes$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationsActionTypes.LoadApplicationsType),
    switchMap(action => this.featurePackService.getApplications(action.payload.id, {
      limit: action.payload.query?.limit,
      offset: action.payload.query?.offset,
      sort: action.payload.query?.sort,
      filters: action.payload.query?.filters
    })
      .pipe(
        map(response => new LoadApplicationsSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(LoadApplicationsFailure)
      )
    )
  ));

  constructor(
    readonly actions$: Actions<LoadApplications>,
    readonly featurePackService: FeaturePackService,
    readonly helper: EffectsHelperService

  ) { }

}
