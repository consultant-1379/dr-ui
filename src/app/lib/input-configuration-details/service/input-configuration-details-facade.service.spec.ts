import { InputConfigDetailsFacadeService } from './input-configuration-details-facade.service';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as InputConfigActions from '../store/input-configuration-details.actions';
import { getInputConfigDetails, getInputConfigDetailsFailure, getInputConfigDetailsLoading } from '../store/input-configuration-details.selectors';

const featureMockId = '1234';
const configurationMockId = '6578';

describe('InputConfigDetailsFacadeService', () => {
  let service: InputConfigDetailsFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(InputConfigDetailsFacadeService);
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

    it('should dispatch the loadInputConfigDetails action', () => {
      service.loadInputConfigDetails(featureMockId, configurationMockId);

      expect(store.dispatch).toHaveBeenCalledWith(
        new InputConfigActions.LoadInputConfigDetails({ featureId: featureMockId, configurationId: configurationMockId })
      );
    });

  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getInputConfigDetails`', () => {
      service.getInputConfigDetails();

      expect(selectSpy).toHaveBeenCalledWith(getInputConfigDetails);
    });

    it('should select `getInputConfigDetailsLoading`', () => {
      service.getInputConfigDetailsLoading();

      expect(selectSpy).toHaveBeenCalledWith(getInputConfigDetailsLoading);
    });

    it('should select `getInputConfigDetailsFailure`', () => {
      service.getInputConfigDetailsFailure();

      expect(selectSpy).toHaveBeenCalledWith(getInputConfigDetailsFailure);
    });

  });

});
