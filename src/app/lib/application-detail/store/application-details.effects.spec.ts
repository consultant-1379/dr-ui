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
import { LoadApplicationDetails, LoadApplicationDetailsSuccess } from './application-details.actions';
import { ApplicationDetailsEffects } from './application-details.effects';
import { marbles } from 'rxjs-marbles/marbles';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { FeaturePackServiceMock } from 'src/app/rest-services/feature-pack.service.mock';
import { Application } from 'src/app/models/application.model';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';

const responseMock: Application = {
  id: "id",
  name: "name",
  description: "description",
  jobs: undefined
};

const mockFpId = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const mockAppId = 'ab54cb71-5444-59bs-247f-b8288be8c78e';

describe('InputConfigsEffects', () => {
  let actions$: Observable<any>;
  let effects: ApplicationDetailsEffects;
  let featurePackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationDetailsEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: EffectsHelperService,
          useClass: EffectsHelperServiceMock
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provide: FeaturePackService,
          useClass: FeaturePackServiceMock
        },
        {
          provide: ConfigCacheHeaderService,
          useClass: ConfigCacheHeaderServiceMock
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
        },
        {
          provide: HttpCacheService,
          useClass: HttpCacheServiceMock
        }
      ],
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule
      ]
    });
    effects = TestBed.inject(ApplicationDetailsEffects);
    TestBed.inject(MockStore);
    featurePackService = TestBed.inject(FeaturePackService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`should call "getApplication"`, marbles(m => {
    // GIVEN
    const action = new LoadApplicationDetails({ featureId: mockFpId, appId: mockAppId });
    const completion = new LoadApplicationDetailsSuccess({
      response: responseMock
    });

    spyOn(featurePackService, 'getApplication').and.returnValue(
      of(responseMock)
    );

    // WHEN
    actions$ = m.hot('a', { a: action });
    const expected = m.cold('b', { b: completion });

    // THEN
    m.expect(effects.loadAssociationTypes$).toBeObservable(expected);
    effects.loadAssociationTypes$.subscribe(() => {
      expect(featurePackService.getApplication).toHaveBeenCalled();
    });
  })
  );

});
