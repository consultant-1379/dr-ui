import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ConfigCacheHeaderService,
  ConfigCacheHeaderServiceMock,
  ConfigLoaderService,
  ConfigLoaderServiceMock,
  HttpCacheService,
  HttpCacheServiceMock
} from '@erad/core';
import {
  EffectsHelperService,
  EffectsHelperServiceMock
} from '@erad/smart-components/effects-helper';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import {
  DeleteFeaturePack,
  LoadFeaturePackDetails,
  LoadFeaturePackDetailsSuccess,
  UpdateFeaturePackSuccess,
  UploadFeaturePack,
  UploadFeaturePackSuccess,
  UpdateFeaturePack,
  DeleteFeaturePackSuccess
} from './feature-pack-details.actions';
import { FeaturePackDetailsEffects } from './feature-pack-details.effects';
import { marbles } from 'rxjs-marbles/marbles';
import { FeaturePackServiceMock } from 'src/app/rest-services/feature-pack.service.mock';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { FeaturePackDetailsResponse } from 'src/app/models/feature-pack-details-response.model';

const responseMock: FeaturePackDetailsResponse = {
  id: "id",
  name: "name",
  description: "desc",
  createdAt: "123",
  modifiedAt: "345",
  applications: [],
  listeners: [],
  inputs: [],
  assets: []
}

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const description = "desc";
const file = new File([], "name");
const showSuccessMessage = true;

describe('InputConfigsEffects', () => {
  let actions$: Observable<any>;
  let effects: FeaturePackDetailsEffects;
  let featurePackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeaturePackDetailsEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: EffectsHelperService,
          useClass: EffectsHelperServiceMock,
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: FeaturePackService,
          useClass: FeaturePackServiceMock,
        },
        {
          provide: ConfigCacheHeaderService,
          useClass: ConfigCacheHeaderServiceMock,
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock,
        },
        {
          provide: HttpCacheService,
          useClass: HttpCacheServiceMock,
        },
      ],
      imports: [StoreModule.forRoot({}), HttpClientTestingModule],
    });
    effects = TestBed.inject(FeaturePackDetailsEffects);
    TestBed.inject(MockStore);
    featurePackService = TestBed.inject(FeaturePackService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`LoadFeaturePackDetails should call job service "getFeaturePackById"`,
    marbles((m) => {
      // GIVEN
      const action = new LoadFeaturePackDetails({ id });
      const completion = new LoadFeaturePackDetailsSuccess({
        response: responseMock,
      });

      spyOn(featurePackService, 'getFeaturePackById').and.returnValue(of(responseMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.loadFeaturePackDetails$).toBeObservable(expected);
      effects.loadFeaturePackDetails$.subscribe(() => {
        expect(featurePackService.getFeaturePackById).toHaveBeenCalled();
      });
    })
  );

  it(`should call job service "uploadFeaturePack"`,
    marbles((m) => {
      // GIVEN
      const action = new UploadFeaturePack({ name: "name", description, file, showSuccessMessage });
      const completion = new UploadFeaturePackSuccess({
        response: responseMock,
      });

      spyOn(featurePackService, 'uploadFeaturePack').and.returnValue(of(responseMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.uploadFeaturePack$).toBeObservable(expected);
      effects.uploadFeaturePack$.subscribe(() => {
        expect(featurePackService.uploadFeaturePack).toHaveBeenCalled();
      });
    })
  );

  it(`should call job service "updateFeaturePack"`,
    marbles((m) => {
      // GIVEN
      const action = new UpdateFeaturePack({ id, description, file, showSuccessMessage });
      const completion = new UpdateFeaturePackSuccess({
        response: responseMock,
      });

      spyOn(featurePackService, 'updateFeaturePack').and.returnValue(of(responseMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.updateFeaturePack$).toBeObservable(expected);
      effects.updateFeaturePack$.subscribe(() => {
        expect(featurePackService.updateFeaturePack).toHaveBeenCalled();
      });
    })
  );

  it(`should call job service "deleteFeaturePack"`,
    marbles((m) => {
      // GIVEN
      const action = new DeleteFeaturePack({ id, name: "name1" });
      const completion = new DeleteFeaturePackSuccess({
        id
      });

      spyOn(featurePackService, 'deleteFeaturePack').and.returnValue(of(id));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.deleteFeaturePack$).toBeObservable(expected);
      effects.deleteFeaturePack$.subscribe(() => {
        expect(featurePackService.deleteFeaturePack).toHaveBeenCalled();
      });
    })
  );
});
