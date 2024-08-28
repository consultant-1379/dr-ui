import {
  ClearFailureState,
  LoadAllFeaturePacks,
  LoadAllFeaturePacksFailure,
  LoadAllFeaturePacksSuccess,
  LoadFeaturePackApplications,
  LoadFeaturePackApplicationsFailure,
  LoadFeaturePackApplicationsSuccess,
  LoadFeaturePacks,
  LoadFeaturePacksFailure,
  LoadFeaturePacksSuccess
} from './feature-packs.actions';
import { FeaturePacksState, featurePacksReducer, initialState } from './feature-packs.reducer';

import { QueryParams } from 'src/app/models/query.params.model';
import { failureMock } from '../../../shared/common.mock';

const fpsResponseMock = {
  items: [{id:'id', name: 'name', description: 'desc', createdAt: '1', modifiedAt: '2'}],
  totalCount: 1
}

const itemsResponseMock = {
  items: [],
  totalCount: 0
}

const query: QueryParams = {
  offset: 10,
  limit: 20,
};

const featurePackId = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';

describe('FeaturePacks Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = featurePacksReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('an unknown state', () => {

    it('should return the initial state', () => {
      const action = {} as any;
      const result = featurePacksReducer(undefined, action);

      expect(result).toBe(initialState);
    });
  });

  describe('FeaturePacks reducer', () => {
    describe('LoadFeaturePacks action', () => {
      it('should set loading to true, failure to null', () => {
        // GIVEN
        const action = new LoadFeaturePacks({ query });

        // WHEN
        const result = featurePacksReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('LoadFeaturePacksSuccess action', () => {
      it('should set loading to false, failure to null and jobs to result', () => {
        // GIVEN
        const action = new LoadFeaturePacksSuccess({ response: fpsResponseMock });

        // WHEN
        const result = featurePacksReducer(initialState, action);

        // THEN
        expect(result.failure).toBeFalsy();
        expect(result.featurePacks).toBe(fpsResponseMock.items);
        expect(result.totalCount).toBe(fpsResponseMock.totalCount);
      });
    });

    describe('LoadFeaturePackApplications action', () => {
      it('should set loading to true, failure to null', () => {
        // GIVEN
        const action = new LoadFeaturePackApplications({ featurePackId, query });

        // WHEN
        const result = featurePacksReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
      });
    });

    describe('LoadFeaturePackApplicationsSuccess action', () => {
      it('should set loading to false, failure to null and jobs to result', () => {
        // GIVEN
        const action = new LoadFeaturePackApplicationsSuccess({ featurePackId, response: itemsResponseMock });

        // WHEN
        const result = featurePacksReducer(initialState, action);

        // THEN
        expect(result.failure).toBeFalsy();
        expect(result.applications).toBeTruthy();
      });
    });

    describe('LoadFeaturePacksFailure action', () => {
      it('should set loading to false, failure to failure', () => {
        // GIVEN
        const action = new LoadFeaturePacksFailure({ failure: failureMock });

        // WHEN
        const result = featurePacksReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBe(false);
      });
    });

    describe('LoadFeaturePackApplicationsFailure action', () => {
      it('should set loading to false, failure to failure', () => {
        // GIVEN
        const action = new LoadFeaturePackApplicationsFailure({ failure: failureMock });

        // WHEN
        const result = featurePacksReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
      });
    });

    describe('LoadAllFeaturePacks action', () => {
      it('should set loading to false, failure to null and jobs to result', () => {
        // GIVEN
        const action = new LoadAllFeaturePacks();

        // WHEN
        const result = featurePacksReducer(initialState, action);

        // THEN
        expect(result.allLoading).toBe(true);
        expect(result.allFailure).toBeFalsy();
      });
    });

    describe('LoadAllFeaturePacksFailure action', () => {
      it('should set loading to false, failure to failure', () => {
        // GIVEN
        const action = new LoadAllFeaturePacksFailure({ failure: failureMock });

        // WHEN
        const result = featurePacksReducer(initialState, action);

        // THEN
        expect(result.allLoading).toBeFalsy();
        expect(result.allFailure).toBe(failureMock);
      });
    });

    describe('LoadAllFeaturePacksSuccess action', () => {
      it('should set loading to false, failure to null and jobs to result', () => {
        // GIVEN
        const action = new LoadAllFeaturePacksSuccess({ response: itemsResponseMock });

        // WHEN
        const result = featurePacksReducer(initialState, action);

        // THEN
        expect(result.allLoading).toBeFalsy();
        expect(result.allFailure).toBeFalsy();
        expect(result.allFeaturePacks).toBeTruthy();
      });
    });

    describe('ClearFailureState action', () => {
      it('should set failure to null', () => {
        const failureState: FeaturePacksState = {
          featurePacks: [],
          applications: {},
          failure: failureMock,
          loading: false,
          totalCount: 0,
          allLoading: false,
          allFeaturePacks: [],
          allFailure: null,
        }
        // GIVEN
        const action = new ClearFailureState();

        // WHEN
        const result = featurePacksReducer(failureState, action);

        // THEN
        expect(result.failure).toBeFalsy();
      });
    });
  });
});