import { ApplicationsState, applicationsReducer, initialState } from './applications.reducer';
import {
  ClearFailureState,
  LoadApplications,
  LoadApplicationsFailure,
  LoadApplicationsSuccess
} from './applications.actions';

import { ApplicationItemsResponse } from 'src/app/models/application-items-response.model';
import { QueryParams } from 'src/app/models/query.params.model';
import { failureMock } from '../../../shared/common.mock';

const responseMock: ApplicationItemsResponse = {
  items: [
    {
      id: 'id',
      name: 'name',
      description: 'description',
    },
  ],
  totalCount: 1,
};

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const query: QueryParams = {
  offset: 10,
  limit: 20,
};

describe('Applications Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = applicationsReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('an unknown state', () => {

    it('should return the initial state', () => {
      const action = {} as any;
      const result = applicationsReducer(undefined, action);

      expect(result).toBe(initialState);
    });
  });

  describe('Applications reducer', () => {
    describe('LoadApplications action', () => {
      it('should set loading to true, failure to null and applications to null', () => {
        // GIVEN
        const action = new LoadApplications({ id, query });

        // WHEN
        const result = applicationsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.applications).toBe(null);
      });
    });

    describe('LoadApplicationsSuccess action', () => {
      it('should set loading to false, failure to null and applications to result', () => {
        // GIVEN
        const action = new LoadApplicationsSuccess({ response: responseMock });

        // WHEN
        const result = applicationsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.applications).toBe(responseMock.items);
        expect(result.totalCount).toBe(responseMock.totalCount);
      });
    });

    describe('LoadApplicationsFailure action', () => {
      it('should set loading to false, failure to failure and application to null', () => {
        // GIVEN
        const action = new LoadApplicationsFailure({ failure: failureMock });

        // WHEN
        const result = applicationsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.applications).toBe(null);
        expect(result.loading).toBe(false);
      });
    });

    describe('ClearFailureState action', () => {
      it('should set failure to null', () => {
        const failureState: ApplicationsState = {
          failure: failureMock,
          applications: null,
          loading: false,
          totalCount: 0
        }
        // GIVEN
        const action = new ClearFailureState();

        // WHEN
        const result = applicationsReducer(failureState, action);

        // THEN
        expect(result.failure).toBe(null);
      });
    });
  });
});