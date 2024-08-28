import * as FeaturePackDetailsActions from '../store/feature-pack-details.actions';

import { getFeaturePackDeleted, getFeaturePackDetailSuccess, getFeaturePackDetails, getFeaturePackDetailsFailure, getFeaturePackDetailsLoading, getFeaturePackUploadSuccess } from '../store/feature-pack-details.selectors';

import { FeaturePackDetailsFacadeService } from './feature-pack-details-facade.service';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const description = "desc";
const name = "name1";
const showSuccessMessage = true;
const file = new File([], "name");

describe('FeaturePackDetailsFacadeService', () => {
  let service: FeaturePackDetailsFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(FeaturePackDetailsFacadeService);
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

    it('should dispatch the LoadFeaturePackDetails action', () => {
      service.loadDetails(id);
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackDetailsActions.LoadFeaturePackDetails({ id })
      );
    });

    it('should dispatch the UploadFeaturePack action', () => {
      const name = "name";
      service.uploadFeaturePack(name, description, file);
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackDetailsActions.UploadFeaturePack({ name, description, file, showSuccessMessage: false })
      );
    });

    it('should dispatch the UpdateFeaturePack action', () => {
      service.updateFeaturePack(id, description, file, showSuccessMessage);
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackDetailsActions.UpdateFeaturePack({ id, description, file, showSuccessMessage })
      );

      service.updateFeaturePack(id, description, file);
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackDetailsActions.UpdateFeaturePack({ id, description, file, showSuccessMessage: false })
      );
    });

    it('should dispatch the DeleteFeaturePack action', () => {
      service.deleteFeaturePack(id, name, showSuccessMessage);
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackDetailsActions.DeleteFeaturePack({ id, name,showSuccessMessage })
      );

      service.deleteFeaturePack(id, name);
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackDetailsActions.DeleteFeaturePack({ id, name, showSuccessMessage: false })
      );
    });

    it('should dispatch the ClearFailureState action', () => {
      service.clearFailureState();
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackDetailsActions.ClearFailureState()
      );
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getFeaturePackDeleted`', () => {
      service.getFeaturePackDeleted();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePackDeleted);
    });

    it('should select `getFeaturePackUploadSuccess`', () => {
      service.getFeaturePackUploadSuccess();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePackUploadSuccess);
    });

    it('should select `getFeaturePackDetailSuccess`', () => {
      service.getFeaturePackDetailSuccess();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePackDetailSuccess);
    });

    it('should select `getFeaturePackDetails`', () => {
      service.getFeaturePackDetails();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePackDetails);
    });

    it('should select `getFeaturePackDetailsLoading`', () => {
      service.getFeaturePackDetailsLoading();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePackDetailsLoading);
    });

    it('should select `getFeaturePackDetailsFailure`', () => {
      service.getFeaturePackDetailsFailure();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePackDetailsFailure);
    });
  });
});
