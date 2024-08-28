
import { initialState } from './job-schedules.reducer'
import {
  getJobSchedules,
  getJobSchedulesTotalCount,
  getJobSchedulesLoading,
  getJobSchedulesFailure,
} from './job-schedules.selectors';
import { failureMock } from 'src/app/shared/common.mock';
import { jobScheduleDetailsMock } from 'src/app/rest-services/job-schedule.service.mock';

describe('Selectors', () => {

    it('getJobSchedules', () => {
        // WHEN
        const state = {
          jobSchedules: {
                ...initialState,
                jobSchedules: [jobScheduleDetailsMock]
            }
        };

        // THEN
        expect(getJobSchedules(state)).toEqual([jobScheduleDetailsMock]);
    });

    it('getJobSchedulesTotalCount', () => {
      // WHEN
      const state = {
        jobSchedules: {
              ...initialState,
              totalCount: 1
          }
      };

      // THEN
      expect(getJobSchedulesTotalCount(state)).toEqual(1);
    });

    it('getJobSchedulesLoading', () => {
        // WHEN
        const state = {
          jobSchedules: {
                ...initialState,
                loading: true
            }
        };

        // THEN
        expect(getJobSchedulesLoading(state)).toEqual(true);
    });

    it('getJobSchedulesFailure', () => {
        // WHEN
        const state = {
          jobSchedules: {
                ...initialState,
                failure: failureMock
            }
        };

        // THEN
        expect(getJobSchedulesFailure(state)).toEqual(failureMock);
    });
});
