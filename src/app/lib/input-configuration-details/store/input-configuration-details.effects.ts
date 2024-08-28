import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  InputConfigDetailsActionTypes,
  LoadInputConfigDetails,
  LoadInputConfigDetailsFailure,
  LoadInputConfigDetailsSuccess,
} from './input-configuration-details.actions';
import { map, switchMap } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { Injectable } from '@angular/core';

@Injectable()
export class InputConfigDetailsEffects {

  loadAssociationTypes$ = createEffect(() => this.actions$.pipe(
    ofType(InputConfigDetailsActionTypes.LoadInputConfigDetailsType),
    switchMap(action => this.featurePackService.getInputConfiguration(action.payload.featureId, action.payload.configurationId)
      .pipe(
        map(response => new LoadInputConfigDetailsSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(LoadInputConfigDetailsFailure)
      )
    )
  ));

  constructor(
    readonly actions$: Actions<LoadInputConfigDetails>,
    readonly featurePackService: FeaturePackService,
    readonly helper: EffectsHelperService

  ) { }

}
