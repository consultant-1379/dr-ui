import {
  getFilteredJobsDeleted,
  getJobDeleted,
  getJobDetails,
  getJobDetailsFailure,
  getJobDetailsLoading,
  getJobDuplicated,
  getJobId,
  getJobReconciled,
} from './job-details.selectors';

import { Job } from 'src/app/models/job.model';
import { failureMock } from 'src/app/shared/common.mock';
import { initialState } from './job-details.reducer'

const responseMock: Job = {
  id: "id",
  name: "name",
  description: "description",
};

describe('Selectors', () => {

  it('getJobDetails', () => {
    // WHEN
    const state = {
      jobDetails: {
        ...initialState,
        job: responseMock
      }
    };

    // THEN
    expect(getJobDetails(state)).toEqual(responseMock);
  });

  it('getJobId', () => {
    // WHEN
    const state = {
      jobDetails: {
        ...initialState,
        id: "id",
      }
    };

    // THEN
    expect(getJobId(state)).toEqual("id");
  });

  it('getJobDetailsLoading', () => {
    // WHEN
    const state = {
      jobDetails: {
        ...initialState,
        loading: true
      }
    };

    // THEN
    expect(getJobDetailsLoading(state)).toEqual(true);
  });

  it('getJobDetailsFailure', () => {
    // WHEN
    const state = {
      jobDetails: {
        ...initialState,
        failure: failureMock
      }
    };

    // THEN
    expect(getJobDetailsFailure(state)).toEqual(state.jobDetails.failure);
  });

  it('getJobDeleted', () => {
    // WHEN
    const state = {
      jobDetails: {
        ...initialState,
        jobDeleted: true,
      }
    };

    // THEN
    expect(getJobDeleted(state)).toEqual(true);
  });

  it('getFilteredJobsDeleted ', () => {
    // WHEN
    const state = {
      jobDetails: {
        ...initialState,
        jobDeleted: false,
        deletedCount: 4
      }
    };

    // THEN
    expect(getFilteredJobsDeleted (state)).toEqual(4);
  });

  it('getJobDuplicated', () => {
    // WHEN
    const state = {
      jobDetails: {
        ...initialState,
        jobDuplicated: true,
      }
    };

    // THEN
    expect(getJobDuplicated(state)).toEqual(true);
  });

  it('getJobReconciled', () => {
    // WHEN
    const state = {
      jobDetails: {
        ...initialState,
        jobReconciled: true,
      }
    };

    // THEN
    expect(getJobReconciled(state)).toEqual(true);
  });
});
