import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ApplicationDetailsActionTypes,
  LoadApplicationDetails,
  LoadApplicationDetailsFailure,
  LoadApplicationDetailsSuccess,
} from './application-details.actions';
import { map, switchMap } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ApplicationDetailsEffects {

  loadAssociationTypes$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationDetailsActionTypes.LoadApplicationDetailsType),
    switchMap(action => this.featurePackService.getApplication(action.payload.featureId, action.payload.appId)
      .pipe(
        map(response => new LoadApplicationDetailsSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(LoadApplicationDetailsFailure)
      )
    )
  ));

  constructor(
    readonly actions$: Actions<LoadApplicationDetails>,
    readonly featurePackService: FeaturePackService,
    readonly helper: EffectsHelperService

  ) { }

}
