
import { failureMock } from 'src/app/shared/common.mock';
import { initialState } from './applications.reducer'
import {
  getApplications,
  getApplicationsTotalCount,
  getApplicationsLoading,
  getApplicationsFailure,
} from './applications.selectors';
import { Application } from 'src/app/models/application.model';

const responseMock: Application[] =
  [{
    id: 'id',
    name: 'name',
    description: 'description',
  }];

describe('Selectors', () => {

    it('getApplications', () => {
        // WHEN
        const state = {
          applications: {
                ...initialState,
                applications: responseMock
            }
        };

        // THEN
        expect(getApplications(state)).toEqual(responseMock);
    });

    it('getApplicationsTotalCount', () => {
      // GIVEN

      // WHEN
      const state = {
        applications: {
              ...initialState,
              totalCount: 1
          }
      };

      // THEN
      expect(getApplicationsTotalCount(state)).toEqual(1);
  });

    it('getApplicationsLoading', () => {
        // WHEN
        const state = {
          applications: {
                ...initialState,
                loading: true
            }
        };

        // THEN
        expect(getApplicationsLoading(state)).toEqual(true);
    });

    it('getApplicationsFailure', () => {
        // WHEN
        const state = {
          applications: {
                ...initialState,
                failure: failureMock
            }
        };

        // THEN
        expect(getApplicationsFailure(state)).toEqual(state.applications.failure);
    });
});
