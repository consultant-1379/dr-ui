import {
  ClearFailureState,
  CreateJobFailure,
  CreateJobSuccess,
  DeleteFilteredJobs,
  DeleteFilteredJobsFailure,
  DeleteFilteredJobsSuccess,
  DeleteJob,
  DeleteJobFailure,
  DeleteJobSuccess,
  DuplicateJob,
  DuplicateJobFailure,
  DuplicateJobSuccess,
  LoadJobDetails,
  LoadJobDetailsFailure,
  LoadJobDetailsSuccess,
  ReconcileAllJob,
  ReconcileJob,
  ReconcileJobFailure,
  ReconcileJobSuccess
} from './job-details.actions';
import { JobDetailsState, initialState, jobDetailsReducer } from './job-details.reducer';

import { Job } from 'src/app/models/job.model';
import { failureMock } from '../../../shared/common.mock';

const responseMock: Job = {
  id: 'id',
  name: 'name',
  description: 'description',
};

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';

describe('Jobs Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = jobDetailsReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('an unknown state', () => {

    it('should return the initial state', () => {
      const action = {} as any;
      const result = jobDetailsReducer(undefined, action);

      expect(result).toBe(initialState);
    });
  });

  describe('JobDetails reducer', () => {
    describe('LoadJobDetails action', () => {
      it('should set loading to true, failure to null and job to null', () => {
        // GIVEN
        const action = new LoadJobDetails({ id });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.job).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('ReconcileAllJob action', () => {
      it('should set loading to true, failure to null and job to null', () => {
        // GIVEN
        const action = new ReconcileAllJob({ id: 'id', data: { inputs: [] } });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.job).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('ReconcileJob action', () => {
      it('should set loading to true, failure to null and job to null', () => {
        // GIVEN
        const action = new ReconcileJob({ id: 'id', data: { inputs: [], objects: [] } });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.job).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('DeleteJob action', () => {
      it('should set loading to true, failure to null and jobDeleted to null', () => {
        // GIVEN
        const action = new DeleteJob({ id: 'id', name: 'my job name' });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobDeleted).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(true);
      });
    });


    describe('DuplicateJob action', () => {
      it('should set loading to true, failure to null and jobDuplicated to null', () => {
        // GIVEN
        const action = new DuplicateJob({ id: 'id', name: 'my job name' });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobDuplicated).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('DuplicateJob success action', () => {
      it('should set loading to true, failure to null and jobDuplicated to null', () => {
        // GIVEN
        const action = new DuplicateJobSuccess({ id: 'id', showSuccessMessage: true });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.jobDuplicated).toBe(true);
        expect(result.id).toBe('id');
        expect(result.loading).toBe(false);
      });
    });

    describe('DuplicateJob fail action', () => {
      it('should set loading to false, failure to failed and jobDuplicated to false', () => {
        // GIVEN
        const action = new DuplicateJobFailure({ failure: failureMock });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.job).toBe(null);
        expect(result.loading).toBe(false);
        expect(result.jobReconciled).toBe(false);
        expect(result.jobDeleted).toBe(false);
        expect(result.jobDuplicated).toBe(false);
      });
    });

    describe('DeleteFilteredJobs  action', () => {
      it('should set loading to true, failure to null, and deleteCount to null', () => {
        // GIVEN
        const action = new DeleteFilteredJobs({ query: { filters: 'jobScheduleId==55' } });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.deletedCount).toBe(null);
        expect(result.failure).toBe(null);
        expect(result.job).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(true);
      });
    });

    describe('DeleteFilteredJobs fail action', () => {
      it('should set loading to false, failure to failed and deletedCount to null', () => {
        // GIVEN
        const action = new DeleteFilteredJobsFailure({ failure: failureMock });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.job).toBe(null);
        expect(result.loading).toBe(false);
        expect(result.jobReconciled).toBe(false);
        expect(result.jobDeleted).toBe(false);
        expect(result.jobDuplicated).toBe(false);
        expect(result.deletedCount).toBe(null);
      });
    });

    describe('DeleteFilteredJobs success action', () => {
      it('should set loading to false, deleteCount to result', () => {
        // GIVEN
        const action = new DeleteFilteredJobsSuccess({ deleted: 4 });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.deletedCount).toBe(4);
        expect(result.failure).toBe(null);
        expect(result.job).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(false);
      });
    });


    describe('LoadJobDetailsSuccess action', () => {
      it('should set loading to false, failure to null and job to result', () => {
        // GIVEN
        const action = new LoadJobDetailsSuccess({ response: responseMock });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.job).toBe(responseMock);
        expect(result.id).toBe('id');
        expect(result.loading).toBe(false);
      });
    });

    describe('CreateJobSuccess action', () => {
      it('should set loading to false, failure to null and id to result', () => {
        // GIVEN
        const action = new CreateJobSuccess({ response: { id: 'id' } });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.job).toBe(null);
        expect(result.id).toBe('id');
        expect(result.loading).toBe(false);
      });
    });

    describe('ReconcileJobSuccess action', () => {
      it('should set loading to false, failure to null and jobReconciled to true', () => {
        // GIVEN
        const action = new ReconcileJobSuccess({ id: 'id' });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.job).toBe(null);
        expect(result.id).toBe(null);
        expect(result.loading).toBe(false);
        expect(result.jobDeleted).toBeFalsy();
        expect(result.jobReconciled).toBe(true);
      });
    });

    describe('DeleteJobSuccess action', () => {
      it('should set loading to false, failure to null and jobDeleted to true', () => {
        // GIVEN
        const action = new DeleteJobSuccess({ id: 'id' });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(null);
        expect(result.job).toBe(null);
        expect(result.id).toBe('id');
        expect(result.loading).toBe(false);
        expect(result.jobReconciled).toBeFalsy();
        expect(result.jobDeleted).toBe(true);
      });
    });

    describe('LoadJobDetailsFailure action', () => {
      it('should set loading to false, failure to failure and job to null', () => {
        // GIVEN
        const action = new LoadJobDetailsFailure({ failure: failureMock });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.job).toBe(null);
        expect(result.loading).toBe(false);
        expect(result.jobReconciled).toBe(false);
        expect(result.jobDeleted).toBe(false);
      });
    });

    describe('DeleteJobFailure action', () => {
      it('should set loading to false, failure to failure and jobDeleted to false', () => {
        // GIVEN
        const action = new DeleteJobFailure({ failure: failureMock });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBe(false);
        expect(result.jobDeleted).toBe(false);
      });
    });

    describe('ReconcileJobFailure action', () => {
      it('should set loading to false, failure to failure and jobReconciled to false', () => {
        // GIVEN
        const action = new ReconcileJobFailure({ failure: failureMock });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBe(false);
        expect(result.jobReconciled).toBe(false);
      });
    });

    describe('CreateJobFailure action', () => {
      it('should set loading to false, failure to failure and jobReconciled to false', () => {
        // GIVEN
        const action = new CreateJobFailure({ failure: failureMock });

        // WHEN
        const result = jobDetailsReducer(initialState, action);

        // THEN
        expect(result.failure).toBe(failureMock);
        expect(result.loading).toBe(false);
        expect(result.job).toBe(null);
      });
    });

    describe('ClearFailureState action', () => {
      it('should set failure to null', () => {
        const failureState: JobDetailsState = {
          failure: failureMock,
          loading: false,
        };
        // GIVEN
        const action = new ClearFailureState();

        // WHEN
        const result = jobDetailsReducer(failureState, action);

        // THEN
        expect(result.failure).toBe(null);
      });
    });
  });
});
