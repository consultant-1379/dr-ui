import {
  ClearFailureState,
  LoadJobs,
  LoadJobsFailure,
  LoadJobsSuccess
} from './jobs.actions';
import { JobsState, initialState, jobsReducer } from './jobs.reducer';

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

const query: QueryParams = {
  offset: 10,
  limit: 20,
};

describe('Jobs Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = jobsReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('an unknown state', () => {

    it('should return the initial state', () => {
      const action = {} as any;
      const result = jobsReducer(undefined, action);

      expect(result).toBe(initialState);
    });
  });

  describe('Jobs reducer', () => {
    describe('LoadJobs action', () => {
      it('should set loading to true, failure to null', () => {
        // GIVEN
        const action = new LoadJobs({ query });

        // WHEN
        const result = jobsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('LoadJobsSuccess action', () => {
      it('should set loading to false, failure to null and jobs to result', () => {
        // GIVEN
        const action = new LoadJobsSuccess({ response: responseMock });

        // WHEN
        const result = jobsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobs).toBe(responseMock.items);
        expect(result.totalCount).toBe(responseMock.totalCount);
      });
    });

    describe('LoadJobsFailure action', () => {
      it('should set loading to false, failure to failure', () => {
        // GIVEN
        const action = new LoadJobsFailure({ failure: failureMock });

        // WHEN
        const result = jobsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBe(false);
      });
    });

    describe('ClearFailureState action', () => {
      it('should set failure to null', () => {
        const failureState: JobsState = {
          failure: failureMock,
          jobs: [],
          loading: false,
          totalCount: 0
        }
        // GIVEN
        const action = new ClearFailureState();

        // WHEN
        const result = jobsReducer(failureState, action);

        // THEN
        expect(result.failure).toBe(null);
      });
    });
  });
});