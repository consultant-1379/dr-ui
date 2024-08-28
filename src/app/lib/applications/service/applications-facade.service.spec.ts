import { ApplicationsFacadeService } from './applications-facade.service';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as ApplicationActions from '../store/applications.actions';
import {
  getApplications,
  getApplicationsTotalCount,
  getApplicationsLoading,
  getApplicationsFailure
} from '../store/applications.selectors';
import { QueryParams } from 'src/app/models/query.params.model';

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const query: QueryParams = {
  offset: 10,
  limit: 20
}

describe('ApplicationsFacadeService', () => {
  let service: ApplicationsFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(ApplicationsFacadeService);
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

    it('should dispatch the loadApplications action', () => {
      service.loadApplications(id, query);

      expect(store.dispatch).toHaveBeenCalledWith(
        new ApplicationActions.LoadApplications({ id, query })
      );
    });

    it('should dispatch the clearFailureState action', () => {
      service.ClearFailureState();

      expect(store.dispatch).toHaveBeenCalledWith(
        new ApplicationActions.ClearFailureState()
      );
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getApplications`', () => {
      service.getApplications();

      expect(selectSpy).toHaveBeenCalledWith(getApplications);
    });

    it('should select `getApplicationsTotalCount`', () => {
      service.getApplicationsTotalCount();

      expect(selectSpy).toHaveBeenCalledWith(getApplicationsTotalCount);
    });

    it('should select `getApplicationsLoading`', () => {
      service.getApplicationsLoading();

      expect(selectSpy).toHaveBeenCalledWith(getApplicationsLoading);
    });

    it('should select `getApplicationsFailure`', () => {
      service.getApplicationsFailure();

      expect(selectSpy).toHaveBeenCalledWith(getApplicationsFailure);
    });
  });
});
