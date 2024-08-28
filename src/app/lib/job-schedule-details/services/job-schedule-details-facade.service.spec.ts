import * as JobScheduleDetailsActions from '../store/job-schedule-details.actions';

import {
  getJobScheduleDeleted,
  getJobScheduleDetails,
  getJobScheduleDetailsFailure,
  getJobScheduleEnabledSet,
  getJobScheduleEnabledSetFailure,
  getJobScheduleId,
  getJobScheduleLoading
} from '../store/job-schedule-details.selectors';

import { JobScheduleDetailsFacadeService } from './job-schedule-details-facade.service';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { jobScheduleCreateMock } from 'src/app/rest-services/job-schedule.service.mock';
import { provideMockStore } from '@ngrx/store/testing';

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const name = "jobSchedule1";

describe('JobScheduleDetailsFacadeService', () => {
  let service: JobScheduleDetailsFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(JobScheduleDetailsFacadeService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('dispatchers', () => {
    beforeEach(() => {
      // GIVEN
      spyOn(store, 'dispatch');
    });

    it('should dispatch the LoadJobScheduleDetails action', () => {
      service.loadDetails(id);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobScheduleDetailsActions.LoadJobScheduleDetails({ id })
      );
    });

    it('should dispatch the CreateJobSchedule action', () => {

      service.createJobSchedule(jobScheduleCreateMock);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobScheduleDetailsActions.CreateJobSchedule({ data: jobScheduleCreateMock })
      );
    });

    it('should dispatch the ClearFailureState action', () => {
      service.clearFailureState();

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobScheduleDetailsActions.ClearFailureState()
      );
    });

    it('should dispatch the DeleteJobSchedule action', () => {
      service.deleteJobSchedule(id, name);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobScheduleDetailsActions.DeleteJobSchedule({id, name, showSuccessMessage: false})
      );
    });

    it('should dispatch the EnableJobSchedule action', () => {
      service.enableJobSchedule(id, name, true);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobScheduleDetailsActions.EnableJobSchedule({id, name, enabled: true, showSuccessMessage: false})
      );
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getJobScheduleDetails`', () => {
      service.getJobScheduleDetails();

      expect(selectSpy).toHaveBeenCalledWith(getJobScheduleDetails);
    });

    it('should select `getJobScheduleId`', () => {
      service.getJobScheduleId();

      expect(selectSpy).toHaveBeenCalledWith(getJobScheduleId);
    });

    it('should select `getJobScheduleLoading`', () => {
      service.getJobScheduleLoading();

      expect(selectSpy).toHaveBeenCalledWith(getJobScheduleLoading);
    });

    it('should select `getJobScheduleDeleted`', () => {
      service.getJobScheduleDeleted();

      expect(selectSpy).toHaveBeenCalledWith(getJobScheduleDeleted);
    });

    it('should select `getJobScheduleEnabledSet`', () => {
      service.getJobScheduleEnabledSet();

      expect(selectSpy).toHaveBeenCalledWith(getJobScheduleEnabledSet);
    });

    it('should select `getJobScheduleDetailsFailure`', () => {
      service.getJobScheduleFailure();

      expect(selectSpy).toHaveBeenCalledWith(getJobScheduleDetailsFailure);
    });

    it('should select `getJobScheduleEnabledSetFailure`', () => {
      service.getJobScheduleEnabledSetFailure();

      expect(selectSpy).toHaveBeenCalledWith(getJobScheduleEnabledSetFailure);
    });
  });
});
