import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  FeaturePacksActionTypes,
  LoadAllFeaturePacksFailure,
  LoadAllFeaturePacksSuccess,
  LoadFeaturePackApplications,
  LoadFeaturePackApplicationsFailure,
  LoadFeaturePackApplicationsSuccess,
  LoadFeaturePacks,
  LoadFeaturePacksFailure,
  LoadFeaturePacksSuccess
} from './feature-packs.actions';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable()
export class FeaturePackEffects {
  loadFeaturePacks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeaturePacksActionTypes.LoadFeaturePacksType),
      switchMap((action) =>
        this.featurePackService
          .getItems({
            limit: action.payload.query?.limit,
            offset: action.payload.query?.offset,
            sort: action.payload.query?.sort || '-id',
            filters: action.payload.query?.filters,
          })
          .pipe(
            filter((response) => !!response),
            take(1),
            map((response) => new LoadFeaturePacksSuccess({ response })),
            this.helper.showErrorMessage(),
            this.helper.handleFailure(LoadFeaturePacksFailure)
          )
      )
    )
  );

  loadFeaturePackApplications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeaturePacksActionTypes.LoadFeaturePackApplicationsType),
      switchMap((action: LoadFeaturePackApplications) => {
        return this.featurePackService.getApplications(action?.payload?.featurePackId, action.payload.query)
          .pipe(
            map(response => new LoadFeaturePackApplicationsSuccess({ featurePackId: action?.payload?.featurePackId, response })),
            catchError(err => {
              return throwError(() => new Error(err));
            }),
            this.helper.handleFailure(LoadFeaturePackApplicationsFailure)
          );
      })
    );
  });

  loadAllFeaturePackInfo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeaturePacksActionTypes.LoadAllFeaturePacksType),
      switchMap(() => {
        return this.featurePackService.getAllFeaturePacks()
          .pipe(
            filter((response) => !!response),
            take(1),
            map((response) => new LoadAllFeaturePacksSuccess({ response })),
            this.helper.showErrorMessage(),
            this.helper.handleFailure(LoadAllFeaturePacksFailure)
          );
      })
    );
  });

  constructor(
    readonly actions$: Actions<LoadFeaturePacks>,
    readonly featurePackService: FeaturePackService,
    readonly helper: EffectsHelperService) { }
}
