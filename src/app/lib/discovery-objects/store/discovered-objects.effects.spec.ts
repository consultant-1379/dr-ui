import { EffectsHelperService, EffectsHelperServiceMock } from '@erad/smart-components/effects-helper';
import { LoadDiscoveredObjects, LoadDiscoveredObjectsSuccess } from './discovered-objects.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';

import { ActionFilterStatus } from 'src/app/models/enums/action-filter-status.enum';
import { DiscoveredObjectsEffects } from './discovered-objects.effects';
import { DiscoveredObjectsItemsResponse } from 'src/app/models/discovered-objects-items-response.model';
import { DiscoveredObjectsStatus } from 'src/app/models/enums/discovered-objects-status.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JobsService } from 'src/app/rest-services/jobs.service';
import { QueryParams } from 'src/app/models/query.params.model';
import { StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { marbles } from 'rxjs-marbles/marbles';
import { provideMockActions } from '@ngrx/effects/testing';

const mockId = '12345';

const responseMock: DiscoveredObjectsItemsResponse = {
  items: [
    {
      objectId: '1',
      discrepancies: [
        'Missing in ecm'
      ],
      properties: {
        flavorName: 'ECM_CORE',
        ephemeralDiskSize: '0',
        diskSize: '64',
        isPublic: 'false',
        numberOfCPU: '4',
        ramMemorySize: '12288',
        assignedObjectId: '1',
        receivedTransmitFactor: '1.0',
        id: '101'
      },
      filters: [
        {
          name: 'filter one',
          reconcileAction: {
            status: ActionFilterStatus.FAILED,
            command: 'Method: POST',
            commandOutput: 'command output message',
            errorMessage: 'DR-20:Execution step.'
          }
        }
      ],
      errorMessage: '',
      status: DiscoveredObjectsStatus.RECONCILED
    }
  ],
  totalCount: 50
};

const queryParams: QueryParams = {
  offset: 10,
  limit: 10,
  sort: 'ASC',
  filters: 'anyString'
};

describe('DiscoveredObjectsEffects', () => {
  let actions$: Observable<any>;
  let effects: DiscoveredObjectsEffects;
  let jobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DiscoveredObjectsEffects,
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
      ],
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule
      ]
    });
    effects = TestBed.inject(DiscoveredObjectsEffects);
    TestBed.inject(MockStore);
    jobsService = TestBed.inject(JobsService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`should call "getDiscoverdObjects"`, marbles(m => {
    // GIVEN
    const action = new LoadDiscoveredObjects({ query: queryParams, id: mockId });
    const completion = new LoadDiscoveredObjectsSuccess({
      response: responseMock
    });

    spyOn(jobsService, 'getDiscoverdObjects').and.returnValue(
      of(responseMock)
    );

    // WHEN
    actions$ = m.hot('a', { a: action });
    const expected = m.cold('b', { b: completion });

    // THEN
    m.expect(effects.loadAssociationTypes$).toBeObservable(expected);
    effects.loadAssociationTypes$.subscribe(() => {
      expect(jobsService.getDiscoverdObjects).toHaveBeenCalled();
    });
  })
  );

});
