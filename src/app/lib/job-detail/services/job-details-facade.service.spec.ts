import * as JobDetailsActions from '../store/job-details.actions';

import {
  getFilteredJobsDeleted,
  getJobDeleted,
  getJobDetails,
  getJobDetailsFailure,
  getJobDetailsLoading,
  getJobDuplicated,
  getJobId,
  getJobReconciled
} from '../store/job-details.selectors';

import { JobDetailsFacadeService } from './job-details-facade.service';
import { QueryParams } from 'src/app/models/query.params.model';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const name = "My job name"
describe('JobDetailsFacadeService', () => {
  let service: JobDetailsFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(JobDetailsFacadeService);
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

    it('should dispatch the LoadJobDetails action', () => {
      service.loadDetails(id);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.LoadJobDetails({ id })
      );
    });

    it('should dispatch the CreateJob action', () => {
      const data = {
        featurePackId: "12",
        applicationId: "123",
        applicationJobName: "name"
      };

      service.createJob(data);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.CreateJob({ data })
      );
    });

    it('should dispatch the ClearFailureState action', () => {
      service.clearFailureState();

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.ClearFailureState()
      );
    });

    it('should dispatch the ReconcileJob action', () => {
      const data = { inputs: {}, objects: [] };
      service.reconcileJob(id, data);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.ReconcileJob({id, data, showSuccessMessage: false})
      );
    });

    it('should dispatch the ReconcileAllJob action', () => {
      const data = { inputs: {} };
      service.reconcileAllJob(id, data);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.ReconcileAllJob({id, data, showSuccessMessage: false})
      );
    });

    it('should dispatch the duplicate job action', () => {
      service.duplicateJob(id, name);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.DuplicateJob({id, name, showSuccessMessage: false})
      );
    });

    it('should dispatch the DeleteJob action', () => {
      service.deleteJob(id, name);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.DeleteJob({id, name, showSuccessMessage: false})
      );
    });


    it('should dispatch the DeleteFilteredJobs action', () => {

      const data: QueryParams = { filters: `jobScheduleId==55` };
      service.deleteFilteredJobs(data);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.DeleteFilteredJobs({ query: data, showSuccessMessage: false })
      );
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getJobDetails`', () => {
      service.getJobDetails();

      expect(selectSpy).toHaveBeenCalledWith(getJobDetails);
    });

    it('should select `getJobId`', () => {
      service.getJobId();

      expect(selectSpy).toHaveBeenCalledWith(getJobId);
    });

    it('should select `getJobDetailsLoading`', () => {
      service.getJobDetailsLoading();

      expect(selectSpy).toHaveBeenCalledWith(getJobDetailsLoading);
    });

    it('should select `getJobDeleted`', () => {
      service.getJobDeleted();

      expect(selectSpy).toHaveBeenCalledWith(getJobDeleted);
    });

    it('should select `getJobReconciled`', () => {
      service.getJobReconciled();

      expect(selectSpy).toHaveBeenCalledWith(getJobReconciled);
    });

    it('should select `getJobDetailsFailure`', () => {
      service.getJobDetailsFailure();

      expect(selectSpy).toHaveBeenCalledWith(getJobDetailsFailure);
    });

    it('should select `getJobDuplicated`', () => {
      service.getJobDuplicated();
      expect(selectSpy).toHaveBeenCalledWith(getJobDuplicated);
    });

    it('should select `getFilteredJobsDeleted`', () => {
      service.getFilteredJobsDeleted();
      expect(selectSpy).toHaveBeenCalledWith(getFilteredJobsDeleted);
    });
  });
});
