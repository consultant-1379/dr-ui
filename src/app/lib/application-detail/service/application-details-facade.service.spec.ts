import { ApplicationDetailsFacadeService } from './application-details-facade.service';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as ApplicationActions from '../store/application-details.actions';
import {
  getApplicationDetails,
  getApplicationDetailsLoading,
  getApplicationDetailsFailure
} from '../store/application-details.selectors';

const mockFpId = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const mockAppId = 'ab54cb71-5444-59bs-247f-b8288be8c78e';

describe('ApplicationDetailsFacadeService', () => {
  let service: ApplicationDetailsFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(ApplicationDetailsFacadeService);
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

    it('should dispatch the loadApplicationDetails action', () => {
      service.loadApplicationDetails(mockFpId, mockAppId);

      expect(store.dispatch).toHaveBeenCalledWith(
        new ApplicationActions.LoadApplicationDetails({ featureId: mockFpId, appId: mockAppId })
      );
    });

    it('should dispatch the clearFailureState action', () => {
      service.clearFailureState();

      expect(store.dispatch).toHaveBeenCalledWith(
        new ApplicationActions.ClearFailureState()
      );
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getApplicationDetails`', () => {
      service.getApplicationDetails();

      expect(selectSpy).toHaveBeenCalledWith(getApplicationDetails);
    });

    it('should select `getApplicationDetailsLoading`', () => {
      service.getApplicationDetailsLoading();

      expect(selectSpy).toHaveBeenCalledWith(getApplicationDetailsLoading);
    });

    it('should select `getApplicationDetailsFailure`', () => {
      service.getApplicationDetailsFailure();

      expect(selectSpy).toHaveBeenCalledWith(getApplicationDetailsFailure);
    });
  });
});
