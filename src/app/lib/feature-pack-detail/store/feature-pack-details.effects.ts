import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  DeleteFeaturePackFailure,
  DeleteFeaturePackSuccess,
  FeaturePackDetailsActionTypes,
  LoadFeaturePackDetails,
  LoadFeaturePackDetailsFailure,
  LoadFeaturePackDetailsSuccess,
  UpdateFeaturePack,
  UpdateFeaturePackFailure,
  UpdateFeaturePackSuccess,
  UploadFeaturePack,
  UploadFeaturePackFailure,
  UploadFeaturePackSuccess,
} from './feature-pack-details.actions';
import { map, switchMap } from 'rxjs/operators';

import { EffectsHelperService } from 'src/app/rest-services/effects-helper/effects-helper.service';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { Injectable } from '@angular/core';

@Injectable()
export class FeaturePackDetailsEffects {

  loadFeaturePackDetails$ = createEffect(() => this.actions$.pipe(
    ofType(FeaturePackDetailsActionTypes.LoadFeaturePackDetailsType),
    switchMap(action => this.featurePackService.getFeaturePackById(action.payload.id)
      .pipe(
        map(response => new LoadFeaturePackDetailsSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(LoadFeaturePackDetailsFailure)
      )
    )
  ));

  uploadFeaturePack$ = createEffect(() => this.uploadAction$.pipe(
    ofType(FeaturePackDetailsActionTypes.UploadFeaturePackType),
    switchMap(action => this.featurePackService.uploadFeaturePack(
      action.payload.name,
      action.payload.description,
      action.payload.file,
    )
      .pipe(
        map(response => new UploadFeaturePackSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(UploadFeaturePackFailure)
      )
    )
  ));

  updateFeaturePack$ = createEffect(() => this.updateAction$.pipe(
    ofType(FeaturePackDetailsActionTypes.UpdateFeaturePackType),
    switchMap(action => this.featurePackService.updateFeaturePack(
      action.payload.id,
      action.payload.description,
      action.payload.file,
    )
      .pipe(
        map(response => new UpdateFeaturePackSuccess({ response })),
        this.helper.showErrorMessage(),
        this.helper.handleFailure(UpdateFeaturePackFailure)
      )
    )
  ));

  deleteFeaturePack$ = createEffect(() => this.actions$.pipe(
    ofType(FeaturePackDetailsActionTypes.DeleteFeaturePackType),
    switchMap(
      (action: any) => this.featurePackService.deleteFeaturePack(action.payload.id)
        .pipe(
          map(() => this.getDeleteSuccess(action.payload.id, action.payload.name, action.payload.showSuccessMessage)),
          this.helper.showErrorMessage(),
          this.helper.handleFailure(DeleteFeaturePackFailure)
          )
    )
  ));

  getDeleteSuccess( id: string, name: string, showSuccessMessage?: boolean) {
    if (showSuccessMessage) {
      this.helper.showSuccessMessage('SUCCESS', 'messages.FEATURE_PACK_UNINSTALL_SUCCESS', { name });
    }
    return new DeleteFeaturePackSuccess({ id });
  }

  constructor(
    readonly actions$: Actions<LoadFeaturePackDetails>,
    readonly uploadAction$: Actions<UploadFeaturePack>,
    readonly updateAction$: Actions<UpdateFeaturePack>,
    readonly featurePackService: FeaturePackService,
    readonly helper: EffectsHelperService
  ) { }

}
