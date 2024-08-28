
import { Application } from 'src/app/models/application.model';
import { initialState } from './feature-packs.reducer'
import {
  getFeaturePacks,
  getFeaturePacksTotalCount,
  getFeaturePacksLoading,
  getFeaturePacksFailure,
  getFeaturePackDeleted,
  getFeaturePackApplications,
  getFeaturePackApplicationsTotalCount,
  getFeaturePackApplicationsFailure,
  getAllFeaturePacks,
  getAllFeaturePacksFailure,
  getAllFeaturePacksLoading,
} from './feature-packs.selectors';
import { FeaturePack } from 'src/app/models/feature-pack.model';
import { failureMock } from 'src/app/shared/common.mock';
import { DropdownOption } from 'src/app/models/dropdown-option.model';

const responseMock: FeaturePack[] =
  [{
    id: "id",
    name: "name",
    description: "desc",
    createdAt: "1",
    modifiedAt: "2",
    applications: [],
    listeners: [],
    inputs: [],
    assets: []
  }];

describe('Selectors', () => {

    it('getFeaturePacks', () => {
        // WHEN
        const state = {
          featurePacks: {
                ...initialState,
                featurePacks: responseMock
            }
        };

        // THEN
        expect(getFeaturePacks(state)).toEqual(responseMock);
    });

    it('getFeaturePackDeleted', () => {
      // WHEN
      const state = {
        featurePacks: {
              ...initialState,
              featurePackDeleted: true
          }
      };

      // THEN
      expect(getFeaturePackDeleted(state)).toEqual(true);
    });

    it('getFeaturePacksTotalCount', () => {
      // GIVEN

      // WHEN
      const state = {
        featurePacks: {
              ...initialState,
              totalCount: 1
          }
      };

      // THEN
      expect(getFeaturePacksTotalCount(state)).toEqual(1);
    });

    it('getFeaturePacksLoading', () => {
        // WHEN
        const state = {
          featurePacks: {
                ...initialState,
                loading: true
            }
        };

        // THEN
        expect(getFeaturePacksLoading(state)).toEqual(true);
    });

    it('getFeaturePacksFailure', () => {
        // WHEN
        const state = {
          featurePacks: {
                ...initialState,
                failure: failureMock
            }
        };

        // THEN
        expect(getFeaturePacksFailure(state)).toEqual(failureMock);
    });

    it('getFeaturePackApplications', () => {
      const app: Application = {
        id: "id",
        name: "name",
        description: "desc"
      }
      // WHEN
      const state = {
        featurePacks: {
              ...initialState,
          applications: { items: [app] }
          }
      };

      // THEN
      let getApps = getFeaturePackApplications;
      expect(getApps(state)).toEqual([app]);
    });

    it('getFeaturePackApplicationsTotalCount', () => {
      // WHEN
      const state = {
        featurePacks: {
              ...initialState,
          applications: { totalCount: 1}
          }
      };

      // THEN
      let getAppCount = getFeaturePackApplicationsTotalCount;
      expect(getAppCount(state)).toEqual(1);
    });

    it('getFeaturePackApplicationsFailure', () => {
      // WHEN
      const state = {
        featurePacks: {
              ...initialState,
              failure: failureMock
          }
      };

      // THEN
      expect(getFeaturePackApplicationsFailure(state)).toEqual(failureMock);
    });

    it('getAllFeaturePacks', () => {
      const dropDownOptions: DropdownOption[] = [{
        value: "1",
        label: "option"
      }];
      // WHEN
      const state = {
        featurePacks: {
              ...initialState,
              allFeaturePacks: dropDownOptions
          }
      };

      // THEN
      expect(getAllFeaturePacks(state)).toEqual(dropDownOptions);
    });

    it('getAllFeaturePacksLoading', () => {
      // WHEN
      const state = {
        featurePacks: {
              ...initialState,
              allLoading: true
          }
      };

      // THEN
      expect(getAllFeaturePacksLoading(state)).toEqual(true);
    });

    it('getAllFeaturePacksFailure', () => {
      // WHEN
      const state = {
        featurePacks: {
              ...initialState,
              allFailure: failureMock
          }
      };

      // THEN
      expect(getAllFeaturePacksFailure(state)).toEqual(failureMock);
    });
});
