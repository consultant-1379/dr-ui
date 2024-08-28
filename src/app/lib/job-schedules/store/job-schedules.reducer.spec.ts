import {
  ClearFailureState,
  LoadJobSchedules,
  LoadJobSchedulesFailure,
  LoadJobSchedulesSuccess
} from './job-schedules.actions';
import { jobSchedulesReducer, initialState, JobSchedulesState } from './job-schedules.reducer';
import { QueryParams } from 'src/app/models/query.params.model';
import { failureMock } from '../../../shared/common.mock';
import { jobScheduleItemsResponseMock } from 'src/app/rest-services/job-schedule.service.mock';

const query: QueryParams = {
  offset: 10,
  limit: 20,
};

describe('JobSchedules Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = jobSchedulesReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('an unknown state', () => {

    it('should return the initial state', () => {
      const action = {} as any;
      const result = jobSchedulesReducer(undefined, action);

      expect(result).toBe(initialState);
    });
  });

  describe('JobSchedules reducer', () => {
    describe('LoadJobSchedules action', () => {
      it('should set loading to true, failure to null', () => {
        // GIVEN
        const action = new LoadJobSchedules({ query });

        // WHEN
        const result = jobSchedulesReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('LoadJobSchedulesSuccess action', () => {
      it('should set loading to false, failure to null and jobs to result', () => {
        // GIVEN
        const action = new LoadJobSchedulesSuccess({ response: jobScheduleItemsResponseMock });

        // WHEN
        const result = jobSchedulesReducer(initialState, action);

        // THEN
        expect(result.failure).toBeFalsy();
        expect(result.jobSchedules).toBe(jobScheduleItemsResponseMock.items);
        expect(result.totalCount).toBe(jobScheduleItemsResponseMock.totalCount);
      });
    });

    describe('LoadJobSchedulesFailure action', () => {
      it('should set loading to false, failure to failure', () => {
        // GIVEN
        const action = new LoadJobSchedulesFailure({ failure: failureMock });

        // WHEN
        const result = jobSchedulesReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBe(false);
      });
    });
  });

  describe('ClearFailureStateType action', () => {
    it('should set loading to false, failure to failure', () => {
      // GIVEN
      const failState: JobSchedulesState = {
        failure: failureMock,
        loading: false,
        totalCount: 0,
        jobSchedules: [],
      };
      const action = new ClearFailureState();

      // WHEN
      const result = jobSchedulesReducer(failState, action);

      // THEN
      expect(result.failure).toBe(null);
      expect(result.loading).toBe(false);
    });
  });
});