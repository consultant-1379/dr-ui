import {
  getJobScheduleDeleted,
  getJobScheduleDetails,
  getJobScheduleDetailsFailure,
  getJobScheduleEnabledSet,
  getJobScheduleEnabledSetFailure,
  getJobScheduleId,
  getJobScheduleLoading,
} from './job-schedule-details.selectors';

import { failureMock } from 'src/app/shared/common.mock';
import { initialState } from './job-schedule-details.reducer'
import { jobScheduleDetailsMock } from 'src/app/rest-services/job-schedule.service.mock';

describe('Selectors', () => {

    it('getJobScheduleDetails', () => {
        // WHEN
        const state = {
          jobScheduleDetails: {
                ...initialState,
                jobSchedule: jobScheduleDetailsMock
            }
        };

        // THEN
        expect(getJobScheduleDetails(state)).toEqual(jobScheduleDetailsMock);
    });

    it('getJobScheduleId', () => {
      // WHEN
      const state = {
        jobScheduleDetails: {
          ...initialState,
          id: "id",
          }
      };

      // THEN
      expect(getJobScheduleId(state)).toEqual("id");
  });

    it('getJobScheduleLoading', () => {
        // WHEN
        const state = {
          jobScheduleDetails: {
                ...initialState,
                loading: true
            }
        };

        // THEN
        expect(getJobScheduleLoading(state)).toEqual(true);
    });

    it('getJobScheduleDetailsFailure', () => {
        // WHEN
        const state = {
          jobScheduleDetails: {
                ...initialState,
                failure: failureMock
            }
        };

        // THEN
        expect(getJobScheduleDetailsFailure(state)).toEqual(state.jobScheduleDetails.failure);
    });

    it('getJobScheduleDeleted', () => {
      // WHEN
      const state = {
        jobScheduleDetails: {
          ...initialState,
          jobScheduleDeleted: true,
          }
      };

      // THEN
      expect(getJobScheduleDeleted(state)).toEqual(true);
    });

    it('getJobScheduleEnabledSet', () => {
      // WHEN
      const state = {
        jobScheduleDetails: {
          ...initialState,
          jobScheduleEnabledStateChanged: true,
          }
      };

      // THEN
      expect(getJobScheduleEnabledSet(state)).toEqual(true);
    });

    it('getJobScheduleEnabledSetFailure', () => {
      // WHEN
      const state = {
        jobScheduleDetails: {
              ...initialState,
              enableDisableFailure:failureMock,
              failure: null
          }
      };

      // THEN
      expect(getJobScheduleEnabledSetFailure(state)).toEqual(state.jobScheduleDetails.enableDisableFailure);
  });
});
