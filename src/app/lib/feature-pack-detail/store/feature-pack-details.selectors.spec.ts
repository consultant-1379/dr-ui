
import { failureMock } from 'src/app/shared/common.mock';
import { initialState } from './feature-pack-details.reducer'
import {
  getFeaturePackDeleted,
  getFeaturePackDetails,
  getFeaturePackDetailsLoading,
  getFeaturePackDetailsFailure,
  getFeaturePackDetailSuccess,
  getFeaturePackUploadSuccess,
} from './feature-pack-details.selectors';
import { FeaturePackDetailsResponse } from 'src/app/models/feature-pack-details-response.model';

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

describe('Selectors', () => {
  it('getFeaturePackDetails', () => {
    // WHEN
    const state = {
      featurePack: {
        ...initialState,
        featurePackDetails: responseMock,
      },
    };

    // THEN
    expect(getFeaturePackDetails(state)).toEqual(responseMock);
  });

  it('getFeaturePackDetailSuccess', () => {
    // WHEN
    const state = {
      featurePack: {
        ...initialState,
        loading: true,
        featurePackDetails: responseMock
      },
    };

    // THEN
    expect(getFeaturePackDetailSuccess(state)).toEqual(responseMock);
  });

  it('getFeaturePackDetailsLoading', () => {
    // WHEN
    const state = {
      featurePack: {
        ...initialState,
        loading: true,
      },
    };

    // THEN
    expect(getFeaturePackDetailsLoading(state)).toBeTrue()
  });

  it('getFeaturePackDetailsFailure', () => {
      // WHEN
      const state = {
        featurePack: {
              ...initialState,
              failure: failureMock
          }
      };

      // THEN
      expect(getFeaturePackDetailsFailure(state)).toEqual(failureMock);
  });

  it('getFeaturePackUploadSuccess', () => {
    // WHEN
    const state = {
      featurePack: {
            ...initialState,
            uploadSuccess: true
        }
    };

    // THEN
    expect(getFeaturePackUploadSuccess(state)).toBeTrue()
  });

  it('getFeaturePackDeleted', () => {
    // WHEN
    const state = {
      featurePack: {
        ...initialState,
        featurePackDeleted: true,
        }
    };

    // THEN
    expect(getFeaturePackDeleted(state)).toEqual(true);
  });
});
