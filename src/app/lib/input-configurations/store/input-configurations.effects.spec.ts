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
import { LoadInputConfigs, LoadInputConfigsSuccess } from './input-configurations.actions';
import { InputConfigsEffects } from './input-configurations.effects';
import { marbles } from 'rxjs-marbles/marbles';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { FeaturePackServiceMock } from 'src/app/rest-services/feature-pack.service.mock';
import { InputConfigurationsItemsResponses } from 'src/app/models/input-configurations-items-response.model';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';

const responseMock: InputConfigurationsItemsResponses = {
  items: [{
    id: "id",
    name: "name",
    description: "description"
  }],
  totalCount: 1
};

const mockId = 'c96fd466-1052-4ab3-be2d-9c172d9fe511';

describe('InputConfigsEffects', () => {
  let actions$: Observable<any>;
  let effects: InputConfigsEffects;
  let featurePackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InputConfigsEffects,
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
    effects = TestBed.inject(InputConfigsEffects);
    TestBed.inject(MockStore);
    featurePackService = TestBed.inject(FeaturePackService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`should call "getInputConfigurations"`, marbles(m => {
    // GIVEN
    const action = new LoadInputConfigs({ query: undefined, id: mockId });
    const completion = new LoadInputConfigsSuccess({
      response: responseMock
    });

    spyOn(featurePackService, 'getInputConfigurations').and.returnValue(
      of(responseMock)
    );

    // WHEN
    actions$ = m.hot('a', { a: action });
    const expected = m.cold('b', { b: completion });

    // THEN
    m.expect(effects.loadAssociationTypes$).toBeObservable(expected);
    effects.loadAssociationTypes$.subscribe(() => {
      expect(featurePackService.getInputConfigurations).toHaveBeenCalled();
    });
  })
  );

});
