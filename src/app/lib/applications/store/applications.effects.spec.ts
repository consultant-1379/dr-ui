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
import { LoadApplications, LoadApplicationsSuccess } from './applications.actions';
import { ApplicationsEffects } from './applications.effects';
import { marbles } from 'rxjs-marbles/marbles';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { FeaturePackServiceMock } from 'src/app/rest-services/feature-pack.service.mock';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { QueryParams } from 'src/app/models/query.params.model';
import { ApplicationItemsResponse } from 'src/app/models/application-items-response.model';

const responseMock: ApplicationItemsResponse = {
  items: [{
    id: "id",
    name: "name",
    description: "description",
    jobs: undefined
  }],
  totalCount: 1
};

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const query: QueryParams = {
  offset: 10,
  limit: 20
}

describe('ApplicationsEffects', () => {
  let actions$: Observable<any>;
  let effects: ApplicationsEffects;
  let featurePackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationsEffects,
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
    effects = TestBed.inject(ApplicationsEffects);
    TestBed.inject(MockStore);
    featurePackService = TestBed.inject(FeaturePackService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`should call "getApplications"`, marbles(m => {
    // GIVEN
    const action = new LoadApplications({ id, query });
    const completion = new LoadApplicationsSuccess({
      response: responseMock
    });

    spyOn(featurePackService, 'getApplications').and.returnValue(
      of(responseMock)
    );

    // WHEN
    actions$ = m.hot('a', { a: action });
    const expected = m.cold('b', { b: completion });

    // THEN
    m.expect(effects.loadAssociationTypes$).toBeObservable(expected);
    effects.loadAssociationTypes$.subscribe(() => {
      expect(featurePackService.getApplications).toHaveBeenCalled();
    });
  })
  );

});
