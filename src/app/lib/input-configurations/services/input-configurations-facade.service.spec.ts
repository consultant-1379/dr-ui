import { InputConfigsFacadeService } from './input-configurations-facade.service';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as InputConfigsActions from '../store/input-configurations.actions';
import { getInputConfigs, getInputConfigsFailure, getInputConfigsLoading, getInputConfigsTotalCount } from '../store/input-configurations.selectors';

const mockId = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';

describe('InputConfigsFacadeService', () => {
  let service: InputConfigsFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]    });
    service = TestBed.inject(InputConfigsFacadeService);
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

    it('should dispatch the loadInputConfigurations action', () => {
      service.loadInputConfigurations(mockId, undefined);

      expect(store.dispatch).toHaveBeenCalledWith(
        new InputConfigsActions.LoadInputConfigs({ id: mockId, query: undefined })
      );
    });

  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getInputConfigs`', () => {
      service.getInputConfigurations();

      expect(selectSpy).toHaveBeenCalledWith(getInputConfigs);
    });

    it('should select `getInputConfigsTotalCount`', () => {
      service.getInputConfigurationsTotalCount();

      expect(selectSpy).toHaveBeenCalledWith(getInputConfigsTotalCount);
    });


    it('should select `getInputConfigsLoading`', () => {
      service.getInputConfigurationsLoading();

      expect(selectSpy).toHaveBeenCalledWith(getInputConfigsLoading);
    });

    it('should select `getInputConfigsFailure`', () => {
      service.getInputConfigurationsFailure();

      expect(selectSpy).toHaveBeenCalledWith(getInputConfigsFailure);
    });

  });

});
