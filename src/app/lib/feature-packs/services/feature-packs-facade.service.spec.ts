import { FeaturePackFacadeService } from './feature-packs-facade.service';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { QueryParams } from 'src/app/models/query.params.model';
import * as FeaturePackActions from '../store/feature-packs.actions';
import {
  getFeaturePacks,
  getFeaturePacksFailure,
  getFeaturePacksLoading,
  getFeaturePacksTotalCount,
  getFeaturePackApplications,
  getFeaturePackApplicationsTotalCount,
  getFeaturePackApplicationsFailure,
  getAllFeaturePacksFailure,
  getAllFeaturePacksLoading,
  getAllFeaturePacks
} from '../store/feature-packs.selectors';

const query: QueryParams = {
  offset: 10,
  limit: 20
}

const featurePackId = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';

describe('FeaturePackFacadeService', () => {
  let service: FeaturePackFacadeService;
  let store: Store<any>;
  let selectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore()
      ]
    });
    service = TestBed.inject(FeaturePackFacadeService);
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

    it('should dispatch the LoadFeaturePacks action', () => {
      service.loadItems(query);
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackActions.LoadFeaturePacks({ query })
      );
    });

    it('should dispatch the LoadFeaturePackApplications action', () => {
      service.loadApplications(featurePackId, query);
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackActions.LoadFeaturePackApplications({ featurePackId, query })
      );
    });

    it('should dispatch the LoadAllFeaturePacks action', () => {
      service.loadAllFeaturePacks();
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackActions.LoadAllFeaturePacks()
      );
    });

    it('should dispatch the ClearFailureState action', () => {
      service.clearFailureState();
      expect(store.dispatch).toHaveBeenCalledWith(
        new FeaturePackActions.ClearFailureState()
      );
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      selectSpy = spyOn(store, 'select');
    });

    it('should select `getJobs`', () => {
      service.getItems();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePacks);
    });

    it('should select `getFeaturePacksTotalCount`', () => {
      service.getItemsTotalCount();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePacksTotalCount);
    });

    it('should select `getFeaturePacksLoading`', () => {
      service.getItemsLoading();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePacksLoading);
    });

    it('should select `getFeaturePacksFailure`', () => {
      service.getItemsFailure();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePacksFailure);
    });

    xit('should select `getFeaturePackApplications`', () => {
      service.getApplications();
      expect(selectSpy).toHaveBeenCalledWith(
        getFeaturePackApplications);
    });

    xit('should select `getFeaturePackApplicationsTotalCount`', () => {
      service.getFeaturePackApplicationsTotalCount();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePackApplicationsTotalCount);
    });

    xit('should select `getFeaturePackApplicationsFailure`', () => {
      service.getFeaturePackApplicationsFailure();
      expect(selectSpy).toHaveBeenCalledWith(getFeaturePackApplicationsFailure);
    });

    it('should select `getAllFeaturePacksLoading`', () => {
      service.getAllFeaturePacksLoading();
      expect(selectSpy).toHaveBeenCalledWith(getAllFeaturePacksLoading);
    });

    it('should select `getAllFeaturePacks`', () => {
      service.getAllFeaturePacks();
      expect(selectSpy).toHaveBeenCalledWith(getAllFeaturePacks);
    });

    it('should select `getAllFeaturePacksFailure`', () => {
      service.getAllFeaturePacksFailure();
      expect(selectSpy).toHaveBeenCalledWith(getAllFeaturePacksFailure);
    });
  });
});
