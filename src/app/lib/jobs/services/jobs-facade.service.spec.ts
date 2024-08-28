import { JobsFacadeService } from './jobs-facade.service';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { QueryParams } from 'src/app/models/query.params.model';
import * as JobDetailsActions from '../store/jobs.actions';
import {
  getJobs,
  getJobsTotalCount,
  getJobsLoading,
  getJobsFailure
} from '../store/jobs.selectors';

const query: QueryParams = {
  offset: 10,
  limit: 20
}

describe('JobsFacadeService', () => {
  let service: JobsFacadeService<any>;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(JobsFacadeService);
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

    it('should dispatch the LoadJobs action', () => {
      service.loadItems(query);

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.LoadJobs({ query })
      );
    });

    it('should dispatch the clearFailureState action', () => {
      service.ClearFailureState();

      expect(store.dispatch).toHaveBeenCalledWith(
        new JobDetailsActions.ClearFailureState()
      );
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getJobs`', () => {
      service.getItems();

      expect(selectSpy).toHaveBeenCalledWith(getJobs);
    });

    it('should select `getJobsTotalCount`', () => {
      service.getItemsTotalCount();

      expect(selectSpy).toHaveBeenCalledWith(getJobsTotalCount);
    });

    it('should select `getJobsLoading`', () => {
      service.getItemsLoading();

      expect(selectSpy).toHaveBeenCalledWith(getJobsLoading);
    });

    it('should select `getJobsFailure`', () => {
      service.getItemsFailure();

      expect(selectSpy).toHaveBeenCalledWith(getJobsFailure);
    });
  });
});
