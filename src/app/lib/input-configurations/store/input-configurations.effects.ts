import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  InputConfigsActionTypes,
  LoadInputConfigs,
  LoadInputConfigsFailure,
  LoadInputConfigsSuccess,
} from './input-configurations.actions';
import { map, switchMap } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { Injectable } from '@angular/core';

@Injectable()
export class InputConfigsEffects {

  loadAssociationTypes$ = createEffect(() => this.actions$.pipe(
    ofType(InputConfigsActionTypes.LoadInputConfigsType),
    switchMap(action => this.featurePackService.getInputConfigurations(action.payload.id, {
      limit: action.payload.query?.limit,
      offset: action.payload.query?.offset,
      sort: action.payload.query?.sort,
      filters: action.payload.query?.filters
    })
      .pipe(
        map(response => new LoadInputConfigsSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(LoadInputConfigsFailure)
      )
    )
  ));

  constructor(
    readonly actions$: Actions<LoadInputConfigs>,
    readonly featurePackService: FeaturePackService,
    readonly helper: EffectsHelperService

  ) { }

}
