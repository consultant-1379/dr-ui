
import { initialState } from './application-details.reducer'
import {
  getApplicationDetails,
  getApplicationDetailsLoading,
  getApplicationDetailsFailure,
} from './application-details.selectors';
import { Application } from 'src/app/models/application.model';
import { failureMock } from 'src/app/shared/common.mock';

const responseMock: Application = {
  id: "id",
  name: "name",
  description: "description",
  jobs: undefined
};

describe('Selectors', () => {

    it('getApplicationDetails', () => {
        // WHEN
        const state = {
          applicationDetails: {
                ...initialState,
                application: responseMock
            }
        };

        // THEN
        expect(getApplicationDetails(state)).toEqual(responseMock);
    });

    it('getApplicationDetailsLoading', () => {
        // WHEN
        const state = {
          applicationDetails: {
                ...initialState,
                loading: true
            }
        };

        // THEN
        expect(getApplicationDetailsLoading(state)).toEqual(true);
    });

    it('getApplicationDetailsFailure', () => {
        // WHEN
        const state = {
          applicationDetails: {
                ...initialState,
                failure: failureMock
            }
        };

        // THEN
        expect(getApplicationDetailsFailure(state)).toEqual(state.applicationDetails.failure);
    });
});
