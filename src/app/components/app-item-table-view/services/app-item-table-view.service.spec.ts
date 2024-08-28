import { AppItemTableViewService } from '../../app-item-table-view/services/app-item-table-view.service';
import { DatePipe } from '@angular/common';
import { DateUtilsService } from 'src/app/services/date-utils.service';
import { EntityType } from 'src/app/enums/entity-type.enum';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { TableColumnsConfig } from '../app-item-table-view.component.config';
import { TableUtilsService } from 'src/app/services/table-utils.service';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import moment from 'moment';

describe('AppItemTableViewService', () => {
  let service: AppItemTableViewService<any, any>;
  let tableUtils: TableUtilsService<any>;
  let dateUtils: DateUtilsService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        DatePipe,
      ]
    });
    service = new AppItemTableViewService<any, any>(null, null);

    const datePipe = new DatePipe('en-US');

    dateUtils = new DateUtilsService(datePipe);
    tableUtils = new TableUtilsService(translateService);
    service = new AppItemTableViewService(tableUtils, dateUtils);
    service = TestBed.inject(AppItemTableViewService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the entity type correctly', () => {

    //WHEN
    service.entityType = 'FeaturePacks';

    //THEN
    expect(service.entityType).toBe('FeaturePacks');
  });

  it('should return the correct columns configuration on getColumnsConfig', () => {

    //GIVEN
    service.entityType = 'FeaturePacks';

    //WHEN
    const columnsConfig = service.getColumnsConfig();

    //THEN
    expect(columnsConfig).toEqual(TableColumnsConfig.FeaturePacks);
  });

  it('should handle an invalid entity type', () => {

    //GIVEN
    service.entityType = 'NonEntity';

    //WHEN
    const columnsConfig = service.getColumnsConfig();

    //THEN
    expect(columnsConfig).toBeUndefined();
  });


  it('should create a display row for Feature Packs on createDisplayRow if entity type is feature packs (chrome)', () => {

    //GIVEN
    const itemMock = {
      id: 96,
      name: 'Feature pack 1-0-96',
      description: 'Description of feature pack 96',
      createdAt: '2023-05-12T15:15:14Z',
      modifiedAt: '2023-05-12T15:15:14Z'
    };

    const expectedDisplayRowMock = {
      id: 96,
      name: 'Feature pack 1-0-96',
      description: 'Description of feature pack 96',
      createdAt: moment('2023-05-12T15:15:14Z').format('D MMM YYYY, HH:mm:ss'),
      modifiedAt: moment('2023-05-12T15:15:14Z').format('D MMM YYYY, HH:mm:ss'),
    };
    service['_entityType'] = EntityType.FP;

    //WHEN
    const displayRow = service.createDisplayRow(itemMock);

    //THEN
    expect(displayRow).toEqual(expectedDisplayRowMock);
  });

  it('should create a display row for Feature Packs on createDisplayRow if entity type is feature packs (firefox)', () => {

    //GIVEN
    const itemMock = {
      id: 96,
      name: 'Feature pack 1-0-96',
      description: 'Description of feature pack 96',
      createdAt: '2023-05-12T15:15:14Z',
      modifiedAt: '2023-05-12T15:15:14Z'
    };

    const expectedDisplayRowMock = {
      id: 96,
      name: 'Feature pack 1-0-96',
      description: 'Description of feature pack 96',
      createdAt: moment('2023-05-12T15:15:14Z').format('D MMM YYYY, HH:mm:ss'),
      modifiedAt: moment('2023-05-12T15:15:14Z').format('D MMM YYYY, HH:mm:ss'),
    };
    service['_entityType'] = EntityType.FP;

    spyOn(service.dateUtils, '_isFirefox').and.returnValue(true);

    //WHEN
    const displayRow = service.createDisplayRow(itemMock);

    //THEN
    expect(displayRow).toEqual(expectedDisplayRowMock);
  });

  it('should create a display row for Jobs on createDisplayRow if entity type is Jobs', () => {

    //GIVEN
    const itemMock = {
      id: '12345',
      name: 'Analyst 1-0',
      description: 'The Reconciliation Analyst',
      featurePackId: '1',
      featurePackName: 'Feature pack 1-0-XX',
      applicationId: '101',
      applicationName: 'Reconciliation Application 1',
      applicationJobName: 'job1-definition',
      startDate: '2023-05-12T16:12:54Z',
      status: JobStatus.DISCOVERY_FAILED,
      jobScheduleId: '343',

    };
    service['_entityType'] = EntityType.JBS;

    const expectedDisplayRowMock = {
      id: '12345',
      name: 'Analyst 1-0',
      description: 'The Reconciliation Analyst',
      featurePackName: 'Feature pack 1-0-XX',
      featurePackId: '1',
      applicationName: 'Reconciliation Application 1',
      applicationId: '101',
      applicationJobName: 'job1-definition',
      jobScheduleId: '343',
      startDate: moment('2023-05-12T16:12:54Z').format('D MMM YYYY, HH:mm:ss'),
      statusColor: '#ED0E00',
      status: 'state.DISCOVERY_FAILED',
      statusWithoutTranslation: JobStatus.DISCOVERY_FAILED
    };

    //WHEN
    const displayRow = service.createDisplayRow(itemMock);

    //THEN
    expect(displayRow).toEqual(expectedDisplayRowMock);
  });

  it('should create a display row for default if neither Jobs nor feature packs ', () => {

    //GIVEN
    const itemMock = {
      id: '12345',
      name: 'Analyst 1-0',
      description: 'The Reconciliation Analyst',
    };

    const expectedDisplayRowMock = {
      id: '12345',
      name: 'Analyst 1-0',
      description: 'The Reconciliation Analyst',
      createdAt: '-- --',
      modifiedAt: '-- --'    /* see AppConstants.undefinedDisplayValue */
    };
    service['_entityType'] = null;

    //WHEN
    const displayRow = service.createDisplayRow(itemMock);

    //THEN
    expect(displayRow).toEqual(expectedDisplayRowMock);
  })

});
