import { Action } from '@ngrx/store';
import { Failure } from '@erad/utils';
import { FeaturePackDetailsResponse } from 'src/app/models/feature-pack-details-response.model';

export enum FeaturePackDetailsActionTypes {
  LoadFeaturePackDetailsType = '[FeaturePackDetails] Load Feature Pack Details',
  LoadFeaturePackDetailsSuccessType = '[FeaturePackDetails] Load Feature Pack Details Success',
  LoadFeaturePackDetailsFailureType = '[FeaturePackDetails] Load Feature Pack Details Failure',

  UploadFeaturePackType = '[FeaturePackDetails] Upload Feature Pack',
  UploadFeaturePackSuccessType = '[FeaturePackDetails] Upload Feature Packs Success',
  UploadFeaturePackFailureType = '[FeaturePackDetails] Upload Feature Packs Failure',

  UpdateFeaturePackType = '[FeaturePackDetails] Update Feature Pack',
  UpdateFeaturePackSuccessType = '[FeaturePackDetails] Update Feature Packs Success',
  UpdateFeaturePackFailureType = '[FeaturePackDetails] Update Feature Packs Failure',

  DeleteFeaturePackType = '[FeaturePackDetails] Delete Feature Pack',
  DeleteFeaturePackSuccessType = '[FeaturePackDetails] Delete Feature Packs Success',
  DeleteFeaturePackFailureType = '[FeaturePackDetails] Delete Feature Packs Failure',

  ClearFailureStateType = '[FeaturePackDetails] Clear Failure from store',
}

export class LoadFeaturePackDetails implements Action {
  readonly type = FeaturePackDetailsActionTypes.LoadFeaturePackDetailsType;
  constructor(public payload: { id: string }) { }
}

export class LoadFeaturePackDetailsSuccess implements Action {
  readonly type = FeaturePackDetailsActionTypes.LoadFeaturePackDetailsSuccessType;
  constructor(public payload: { response: FeaturePackDetailsResponse }) { }
}

export class LoadFeaturePackDetailsFailure implements Action {
  readonly type = FeaturePackDetailsActionTypes.LoadFeaturePackDetailsFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class UploadFeaturePack implements Action {
  readonly type = FeaturePackDetailsActionTypes.UploadFeaturePackType;
  constructor(public payload: {
    name: string,
    description: string,
    file: File,
    showSuccessMessage: boolean
  }) { }
}

export class UploadFeaturePackSuccess implements Action {
  readonly type = FeaturePackDetailsActionTypes.UploadFeaturePackSuccessType;
  constructor(public payload: { response: FeaturePackDetailsResponse }) { }
}

export class UploadFeaturePackFailure implements Action {
  readonly type = FeaturePackDetailsActionTypes.UploadFeaturePackFailureType;
  constructor(public payload: { failure: Failure }) { }
}

export class UpdateFeaturePack implements Action {
  readonly type = FeaturePackDetailsActionTypes.UpdateFeaturePackType;
  constructor(public payload: {
    id: string,
    description: string,
    file: File,
    showSuccessMessage: boolean
  }) { }
}

export class UpdateFeaturePackSuccess implements Action {
  readonly type = FeaturePackDetailsActionTypes.UpdateFeaturePackSuccessType;
  constructor(public payload: { response: FeaturePackDetailsResponse }) { }
}

export class UpdateFeaturePackFailure implements Action {
  readonly type = FeaturePackDetailsActionTypes.UpdateFeaturePackFailureType;
  constructor(public payload: { failure: Failure }) { }
}


export class DeleteFeaturePack implements Action {
  readonly type = FeaturePackDetailsActionTypes.DeleteFeaturePackType;
  constructor(public payload: { id: string, name: string, showSuccessMessage?: boolean }) { }
}

export class DeleteFeaturePackSuccess implements Action {
  readonly type = FeaturePackDetailsActionTypes.DeleteFeaturePackSuccessType;
  constructor(public payload: { id: string }) { }
}

export class DeleteFeaturePackFailure implements Action {
  readonly type = FeaturePackDetailsActionTypes.DeleteFeaturePackFailureType;
  constructor(public payload: { failure: Failure }) { }
}


export class ClearFailureState implements Action {
  readonly type = FeaturePackDetailsActionTypes.ClearFailureStateType;
}

export type FeaturePackDetailsActions =
  | LoadFeaturePackDetails
  | LoadFeaturePackDetailsSuccess
  | LoadFeaturePackDetailsFailure
  | UploadFeaturePack
  | UploadFeaturePackSuccess
  | UploadFeaturePackFailure
  | UpdateFeaturePack
  | UpdateFeaturePackSuccess
  | UpdateFeaturePackFailure
  | DeleteFeaturePack
  | DeleteFeaturePackSuccess
  | DeleteFeaturePackFailure
  | ClearFailureState
