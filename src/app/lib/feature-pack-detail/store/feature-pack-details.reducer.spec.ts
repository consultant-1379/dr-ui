import {
  ClearFailureState,
  DeleteFeaturePack,
  DeleteFeaturePackFailure,
  DeleteFeaturePackSuccess,
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
import { FeaturePackDetailsState, featurePackDetailsReducer, initialState } from './feature-pack-details.reducer';

import { FeaturePackDetailsResponse } from 'src/app/models/feature-pack-details-response.model';
import { failureMock } from '../../../shared/common.mock';

const responseMock: FeaturePackDetailsResponse = {
  id: "id",
  name: "name",
  description: "desc",
  createdAt: "123",
  modifiedAt: "345",
  applications: [],
  listeners: [],
  inputs: [],
  assets: []
}

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const description = "desc";
const file = new File([], "name");
const showSuccessMessage = true;

describe('FeaturePacks Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = featurePackDetailsReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('an unknown state', () => {

    it('should return the initial state', () => {
      const action = {} as any;
      const result = featurePackDetailsReducer(undefined, action);

      expect(result).toBe(initialState);
    });
  });

  describe('FeaturePackDetails reducer', () => {
    describe('LoadFeaturePackDetails action', () => {
      it('should set loading to true, and failure, uploadSuccess to null', () => {
        // GIVEN
        const action = new LoadFeaturePackDetails({ id });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBeFalsy();
        expect(result.uploadSuccess).toBeFalsy();
        expect(result.loading).toBe(true);
      });
    });

    describe('UploadFeaturePack action', () => {
      it('should set loading to true, and failure, uploadSuccess to null', () => {
        // GIVEN
        const action = new UploadFeaturePack({ name: "name", description, file, showSuccessMessage });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBeFalsy();
        expect(result.uploadSuccess).toBeFalsy();
        expect(result.loading).toBe(true);
      });
    });

    describe('UpdateFeaturePack action', () => {
      it('should set loading to true, and failure, uploadSuccess to null', () => {
        // GIVEN
        const action = new UpdateFeaturePack({ id, description, file, showSuccessMessage });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBeFalsy();
        expect(result.uploadSuccess).toBeFalsy();
        expect(result.loading).toBe(true);
      });
    });

    describe('LoadFeaturePackDetailsSuccess action', () => {
      it('should set loading to false, failure to null and featurePackDetails to result', () => {
        // GIVEN
        const action = new LoadFeaturePackDetailsSuccess({ response: responseMock });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBeFalsy();
        expect(result.loading).toBeFalsy();
        expect(result.featurePackDetails).toBe(responseMock);
      });
    });

    describe('DeleteFeaturePackSuccess action', () => {
      it('should set featurePackDeleted to true', () => {
        // GIVEN
        const action = new DeleteFeaturePackSuccess({ id: 'id' });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.featurePackDeleted).toBe(true);
      });
    });

    describe('DeleteFeaturePack action', () => {
      it('should set featurePackDeleted to true', () => {
        // GIVEN
        const action = new DeleteFeaturePack({ id: 'id', name: "name1" });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.featurePackDeleted).toBeFalsy();
      });
    });

    describe('UploadFeaturePackSuccess action', () => {
      it('should set featurePackDetails to response', () => {
        // GIVEN
        const action = new UploadFeaturePackSuccess({ response: responseMock });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.uploadSuccess).toBeTruthy();
        expect(result.loading).toBeFalsy();
        expect(result.failure).toBeFalsy();
        expect(result.featurePackDetails).toBe(responseMock);
      });
    });

    describe('UpdateFeaturePackSuccess action', () => {
      it('should set featurePackDetails to response', () => {
        // GIVEN
        const action = new UpdateFeaturePackSuccess({ response: responseMock });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.uploadSuccess).toBeTruthy();
        expect(result.loading).toBeFalsy();
        expect(result.failure).toBeFalsy();
        expect(result.featurePackDetails).toBe(responseMock);
      });
    });

    describe('LoadFeaturePackDetailsFailure action', () => {
      it('should set loading to false, failure to failure and job to null', () => {
        // GIVEN
        const action = new LoadFeaturePackDetailsFailure({ failure: failureMock });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBeFalsy();
        expect(result.featurePackDeleted).toBeFalsy();
      });
    });

    describe('UploadFeaturePackFailure action', () => {
      it('should set loading to false, failure to failure and job to null', () => {
        // GIVEN
        const action = new UploadFeaturePackFailure({ failure: failureMock });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBeFalsy();
        expect(result.featurePackDeleted).toBeFalsy();
      });
    });

    describe('UpdateFeaturePackFailure action', () => {
      it('should set loading to false, failure to failure and job to null', () => {
        // GIVEN
        const action = new UpdateFeaturePackFailure({ failure: failureMock });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBeFalsy();
        expect(result.featurePackDeleted).toBeFalsy();
      });
    });

    describe('DeleteFeaturePackFailure action', () => {
      it('should set loading to false, failure to failure and job to null', () => {
        // GIVEN
        const action = new DeleteFeaturePackFailure({ failure: failureMock });

        // WHEN
        const result = featurePackDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBeFalsy();
        expect(result.featurePackDeleted).toBeFalsy();
      });
    });

    describe('ClearFailureState action', () => {
      it('should set failure to null', () => {
        const failureState: FeaturePackDetailsState = {
          failure: failureMock,
          loading: false,
          uploadSuccess: null,
          featurePackDetails: null,
        };
        // GIVEN
        const action = new ClearFailureState();

        // WHEN
        const result = featurePackDetailsReducer(failureState, action);

        // THEN
        expect(result.failure).toBe(null);
      });
    });
  });
});
