import { JobSchedulesFacadeService } from './job-schedules-facade.service';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { QueryParams } from 'src/app/models/query.params.model';
import * as JobScheduleActions from '../store/job-schedules.actions';
import {
  getJobSchedules,
  getJobSchedulesFailure,
  getJobSchedulesLoading,
  getJobSchedulesTotalCount,
} from '../store/job-schedules.selectors';

const query: QueryParams = {
  offset: 10,
  limit: 20
}

describe('JobSchedulesFacadeService', () => {
  let service: JobSchedulesFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(JobSchedulesFacadeService);
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

    it('should dispatch the LoadJobSchedules action', () => {
      service.loadItems(query);
      expect(store.dispatch).toHaveBeenCalledWith(
        new JobScheduleActions.LoadJobSchedules({ query })
      );
    });

    it('should dispatch the ClearFailureState action', () => {
      service.clearFailureState();

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobScheduleActions.ClearFailureState()
      );
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getJobs`', () => {
      service.getItems();
      expect(selectSpy).toHaveBeenCalledWith(getJobSchedules);
    });

    it('should select `getJobSchedulesTotalCount`', () => {
      service.getItemsTotalCount();
      expect(selectSpy).toHaveBeenCalledWith(getJobSchedulesTotalCount);
    });

    it('should select `getJobSchedulesLoading`', () => {
      service.getItemsLoading();
      expect(selectSpy).toHaveBeenCalledWith(getJobSchedulesLoading);
    });

    it('should select `getJobSchedulesFailure`', () => {
      service.getItemsFailure();
      expect(selectSpy).toHaveBeenCalledWith(getJobSchedulesFailure);
    });
  });
});
