import {
  ClearFailureState,
  CreateJobScheduleFailure,
  CreateJobScheduleSuccess,
  DeleteJobSchedule,
  DeleteJobScheduleFailure,
  DeleteJobScheduleSuccess,
  EnableJobSchedule,
  EnableJobScheduleFailure,
  EnableJobScheduleSuccess,
  LoadJobScheduleDetails,
  LoadJobScheduleDetailsFailure,
  LoadJobScheduleDetailsSuccess,
} from './job-schedule-details.actions';
import { JobScheduleDetailsReducer, JobScheduleDetailsState, initialState } from './job-schedule-details.reducer';

import { failureMock } from '../../../shared/common.mock';
import { jobScheduleDetailsMock } from 'src/app/rest-services/job-schedule.service.mock';

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const name = "jobSchedule-name";

describe('Jobs Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = JobScheduleDetailsReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('an unknown state', () => {
    it('should return the initial state', () => {
      const action = {} as any;
      const result = JobScheduleDetailsReducer(undefined, action);

      expect(result).toBe(initialState);
    });
  });

  describe('JobScheduleDetails reducer', () => {
    describe('LoadJobScheduleDetails action', () => {
      it('should set loading to true, failure to null and job to null', () => {
        // GIVEN
        const action = new LoadJobScheduleDetails({ id });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobSchedule).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('LoadJobScheduleDetailsSuccess action', () => {
      it('should set loading to false, failure to null and job to result', () => {
        // GIVEN
        const action = new LoadJobScheduleDetailsSuccess({ response: jobScheduleDetailsMock });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobSchedule).toBe(jobScheduleDetailsMock);
        expect(result.id).toBe(jobScheduleDetailsMock.id);
        expect(result.loading).toBe(false);
      });
    });

    describe('LoadJobScheduleDetailsFailure action', () => {
      it('should set loading to false, failure to failure and job to null', () => {
        // GIVEN
        const action = new LoadJobScheduleDetailsFailure({ failure: failureMock });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.jobSchedule).toBe(null);
        expect(result.loading).toBe(false);
        expect(result.jobScheduleEnabledStateChanged).toBe(false);
        expect(result.jobScheduleDeleted).toBe(false);
      });
    });

    describe('CreateJobScheduleSuccess action', () => {
      it('should set loading to false, failure to null and id to result', () => {
        // GIVEN
        const action = new CreateJobScheduleSuccess({ response: { id } });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobSchedule).toBe(null);
        expect(result.id).toBe(id);
        expect(result.loading).toBe(false);
      });
    });

    describe('CreateJobScheduleFailure action', () => {
      it('should set loading to false, failure to failure and jobReconciled to false', () => {
        // GIVEN
        const action = new CreateJobScheduleFailure({ failure: failureMock });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBe(false);
        expect(result.jobSchedule).toBe(null);
      });
    });

    describe('EnableJobSchedule action', () => {
      it('should set loading to true, failure to null and job to null', () => {
        // GIVEN
        const action = new EnableJobSchedule({ id, name, enabled: true });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobScheduleEnabledStateChanged).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('EnableJobScheduleSuccess action', () => {
      it('should set loading to false, failure to null and jobScheduleDeleted to true', () => {
        // GIVEN
        const action = new EnableJobScheduleSuccess({ id });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobSchedule).toBe(null);
        expect(result.id).toBe(id);
        expect(result.loading).toBe(false);
        expect(result.jobScheduleEnabledStateChanged).toBe(true);
      });
    });

    describe('EnableJobScheduleFailure action', () => {
      it('should set loading to false, failure to null, bespoke failure to the failure and jobScheduleEnabledStateChanged to false', () => {
        // GIVEN
        const action = new EnableJobScheduleFailure({ failure: failureMock });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.enableDisableFailure).toEqual(failureMock);
        expect(result.loading).toBe(false);
        expect(result.jobScheduleEnabledStateChanged).toBe(false);
      });
    });

    describe('DeleteJob action', () => {
      it('should set loading to true, failure to null and job to null', () => {
        // GIVEN
        const action = new DeleteJobSchedule({ id, name });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobScheduleDeleted).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('DeleteJobScheduleSuccess action', () => {
      it('should set loading to false, failure to null and jobScheduleDeleted to true', () => {
        // GIVEN
        const action = new DeleteJobScheduleSuccess({ id });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobSchedule).toBe(null);
        expect(result.id).toBe(id);
        expect(result.loading).toBe(false);
        expect(result.jobScheduleDeleted).toBe(true);
      });
    });

    describe('DeleteJobScheduleFailure action', () => {
      it('should set loading to false, failure to failure and jobScheduleDeleted to false', () => {
        // GIVEN
        const action = new DeleteJobScheduleFailure({ failure: failureMock });

        // WHEN
        const result = JobScheduleDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBe(false);
        expect(result.jobScheduleDeleted).toBe(false);
      });
    });

    describe('ClearFailureState action', () => {
      it('should set failure to null', () => {
        const failureState: JobScheduleDetailsState = {
          failure: failureMock,
          loading: false,
          enableDisableFailure: null
        };
        // GIVEN
        const action = new ClearFailureState();

        // WHEN
        const result = JobScheduleDetailsReducer(failureState, action);

        // THEN
        expect(result.failure).toBe(null);
      });
    });
  });
});
