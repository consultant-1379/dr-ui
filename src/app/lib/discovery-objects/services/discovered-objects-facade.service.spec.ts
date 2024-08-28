import { DiscoveredObjectsFacadeService } from './discovered-objects-facade.service';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as DiscoveredObjectsActions from '../store/discovered-objects.actions';
import { getDiscoveredObjects, getDiscoveredObjectsFailure, getDiscoveredObjectsLoading, getDiscoveredObjectsTotalCount } from '../store/discovered-objects.selectors';

const mockId = '12345';

describe('DiscoveredObjectsFacadeService', () => {
  let service: DiscoveredObjectsFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(DiscoveredObjectsFacadeService);
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

    it('should dispatch the loadDiscoveredObjects action', () => {
      service.loadDiscoveredObjects(mockId, undefined);

      expect(store.dispatch).toHaveBeenCalledWith(
        new DiscoveredObjectsActions.LoadDiscoveredObjects({ id: mockId, query: undefined })
      );
    });

    it('should dispatch the clearFailureState action', () => {
      service.ClearFailureState();

      expect(store.dispatch).toHaveBeenCalledWith(
        new DiscoveredObjectsActions.ClearFailureState()
      );
    });

  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getDiscoveredObjects`', () => {
      service.getDiscoveredObjects();

      expect(selectSpy).toHaveBeenCalledWith(getDiscoveredObjects);
    });

    it('should select `getDiscoveredObjectsTotalCount`', () => {
      service.getDiscoveredObjectsTotalCount();

      expect(selectSpy).toHaveBeenCalledWith(getDiscoveredObjectsTotalCount);
    });


    it('should select `getDiscoveredObjectsLoading`', () => {
      service.getDiscoveredObjectsLoading();

      expect(selectSpy).toHaveBeenCalledWith(getDiscoveredObjectsLoading);
    });

    it('should select `getDiscoveredObjectsFailure`', () => {
      service.getDiscoveredObjectsFailure();

      expect(selectSpy).toHaveBeenCalledWith(getDiscoveredObjectsFailure);
    });

  });
});
