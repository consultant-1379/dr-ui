
import { initialState } from './jobs.reducer'
import {
  getJobs,
  getJobsTotalCount,
  getJobsLoading,
  getJobsFailure,
} from './jobs.selectors';
import { Job } from 'src/app/models/job.model';
import { failureMock } from 'src/app/shared/common.mock';

const responseMock: Job[] =
  [{
    id: 'id',
    name: 'name',
    description: 'description',
  }];

describe('Selectors', () => {

    it('getJobs', () => {
        // WHEN
        const state = {
          jobs: {
                ...initialState,
                jobs: responseMock
            }
        };

        // THEN
        expect(getJobs(state)).toEqual(responseMock);
    });

    it('getJobsTotalCount', () => {
      // GIVEN

      // WHEN
      const state = {
        jobs: {
              ...initialState,
              totalCount: 1
          }
      };

      // THEN
      expect(getJobsTotalCount(state)).toEqual(1);
  });

    it('getJobsLoading', () => {
        // WHEN
        const state = {
          jobs: {
                ...initialState,
                loading: true
            }
        };

        // THEN
        expect(getJobsLoading(state)).toEqual(true);
    });

    it('getJobsFailure', () => {
        // WHEN
        const state = {
          jobs: {
                ...initialState,
                failure: failureMock
            }
        };

        // THEN
        expect(getJobsFailure(state)).toEqual(state.jobs.failure);
    });
});
