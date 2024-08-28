import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";

import { DatePipe } from "@angular/common";
import { ErrorType } from '@erad/utils';
import { Job } from 'src/app/models/job.model';
import { JobsFacadeService } from 'src/app/lib/jobs/services/jobs-facade.service';
import { JobsListColumnViewComponent } from './jobs-list-column-view.component';
import { SimpleChanges } from '@angular/core';
import { jobMock } from 'src/app/lib/app-jobs-table/app-job-table.mock.data';
import { provideMockStore } from "@ngrx/store/testing";

const mockFailure = { errorCode: "500", errorMessage: "Server error", type: ErrorType.BackEnd };

const simpleChangesCurrentValueMock: SimpleChanges = {
  'showJobDefinitionFilter': {
    'currentValue': true,
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  },
  'featurePackId': {
    'currentValue': '1',
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  },
  'applicationId': {
    'currentValue': '101',
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  }
};

const simpleChangesCurrentValueEmptyMock: SimpleChanges = {
  'showJobDefinitionFilter': {
    'currentValue': true,
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  },
  'featurePackId': {
    'currentValue': '1',
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  },
  'applicationId': {
    'currentValue': '',
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  }
}

const jobScheduleIdChangesMock: SimpleChanges = {
  'jobScheduleId': {
    'currentValue': '1',
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  },
}

describe('JobsListColumnViewComponent', () => {
  let component: JobsListColumnViewComponent;
  let fixture: ComponentFixture<JobsListColumnViewComponent>;
  let jobsFacadeService: JobsFacadeService<Job>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsListColumnViewComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        DatePipe,
        {
          provide: TranslateService,
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsListColumnViewComponent);
    jobsFacadeService = TestBed.inject(JobsFacadeService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('getItemsLoading, getItems and getItemsFailure of jobsFacadeService should be called on ngOnInit', () => {
    spyOn(jobsFacadeService, 'getItemsLoading').and.returnValue(of(true));
    spyOn(jobsFacadeService, 'getItems').and.returnValue(of([jobMock]));
    spyOn(jobsFacadeService, 'getItemsFailure').and.returnValue(new Observable());

    component.ngOnInit();

    expect(jobsFacadeService.getItemsLoading).toHaveBeenCalled();
    expect(jobsFacadeService.getItems).toHaveBeenCalled();
    expect(jobsFacadeService.getItemsFailure).toHaveBeenCalled();
  });

  it('should set failure if getItemsFailure returns failure', () => {
    // GIVEN
    spyOn(jobsFacadeService, 'getItemsLoading').and.returnValue(new Observable());
    spyOn(jobsFacadeService, 'getItems').and.returnValue(new Observable());
    spyOn(jobsFacadeService, 'getItemsFailure').and.returnValue(of(mockFailure));
    component.failure = null;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(jobsFacadeService.getItemsFailure).toHaveBeenCalled();
    expect(component.failure).toBe(mockFailure);
  });

  it('should clear failure if getItemsFailure returns with no failure', () => {
    // GIVEN
    spyOn(jobsFacadeService, 'getItemsLoading').and.returnValue(new Observable());
    spyOn(jobsFacadeService, 'getItems').and.returnValue(new Observable());
    spyOn(jobsFacadeService, 'getItemsFailure').and.returnValue(of(undefined));
    component.failure = mockFailure;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(jobsFacadeService.getItemsFailure).toHaveBeenCalled();
    expect(component.failure).toBeUndefined;
  });


  it('loadItems of jobsFacadeService should be called if currentValue is true on ngOnChanges', () => {
    spyOn(jobsFacadeService, 'loadItems').and.returnValue(null);

    component.ngOnChanges(simpleChangesCurrentValueMock);

    expect(jobsFacadeService.loadItems).toHaveBeenCalled();
  });

  it('loadItems of jobsFacadeService should not be called if currentValue is false on ngOnChanges', () => {
    spyOn(jobsFacadeService, 'loadItems').and.returnValue(null);

    component.ngOnChanges(simpleChangesCurrentValueEmptyMock);

    expect(jobsFacadeService.loadItems).not.toHaveBeenCalled();
  });

  it('loadItems of jobsFacadeService should not be called if currentValue is false on ngOnChangesxxxx', () => {
    spyOn(jobsFacadeService, 'loadItems').and.returnValue(null);

    component.jobScheduleId = '1';
    component.ngOnChanges(jobScheduleIdChangesMock);

    expect(jobsFacadeService.loadItems).toHaveBeenCalledWith({ limit: 200, offset: 0, filters: 'jobScheduleId==1', sort: '-startDate' });
  });

  it('should format date on ngOnChanges', () => {

    const dateMock = '2023-06-12T16:12:54Z';

    var formattedDate = component.formatDateValue(dateMock);

    // not comparing exact time for test to run in different timezones
    expect(formattedDate).toContain('Jun ');  // 3 letter medium date format
  });


  it('should format date on onFilterChange', () => {

    const eventMock: any = {
      value: {
        value: 'all'
      }
    };

    component.onFilterChange(eventMock);

    expect(component.applicationJobName).toBe('');
  });


  it('should format date on onFilterChange', () => {

    const eventMock: any = {
      value: {
        value: 'value'
      }
    };

    component.onFilterChange(eventMock);

    expect(component.applicationJobName).toBe('value');
  });

  it('should set filter to applicationJobName and Id for applicationJobName', () => {
    // GIVEN
    spyOn(jobsFacadeService, 'loadItems').and.returnValue(null);

    const eventMock: any = {
      value: {
        value: 'value'
      }
    };
    component.applicationId = '1';

    // WHEN
    component.onFilterChange(eventMock);

    // THEN
    expect(jobsFacadeService.loadItems).toHaveBeenCalled();
    expect(jobsFacadeService.loadItems).toHaveBeenCalledWith({ limit: 200, offset: 0, filters: 'applicationId==1;applicationJobName==value', sort: '-startDate' });
  });

  it('should set filter to applicationId and applicationId', () => {
    // GIVEN
    spyOn(jobsFacadeService, 'loadItems').and.returnValue(null);

    const eventMock: any = {
      value: {
        value: undefined
      }
    };
    component.applicationId = '1';
    component.jobScheduleId = undefined;

    // WHEN
    component.onFilterChange(eventMock);

    // THEN
    expect(jobsFacadeService.loadItems).toHaveBeenCalled();
    expect(jobsFacadeService.loadItems).toHaveBeenCalledWith({ limit: 200, offset: 0, filters: 'applicationId==1', sort: '-startDate' });
  });

  it('should set filter to applicationJobName for applicationJobName', () => {
    // GIVEN
    spyOn(jobsFacadeService, 'loadItems').and.returnValue(null);

    const eventMock: any = {
      value: {
        value: 'value'
      }
    };
    component.jobScheduleId = undefined;
    component.applicationId = undefined;

    // WHEN
    component.onFilterChange(eventMock);

    // THEN
    expect(jobsFacadeService.loadItems).toHaveBeenCalled();
    expect(jobsFacadeService.loadItems).toHaveBeenCalledWith({ limit: 200, offset: 0, filters: 'applicationJobName==value', sort: '-startDate' });
  });

  it('should emit an event on job selection', () => {
    //GIVEN
    const spyJobSelection = spyOn(component.jobSelection, 'emit');

    //WHEN
    component.onJobSelection(jobMock);

    //THEN
    expect(spyJobSelection).toHaveBeenCalled();
  });

  describe("job definition (application job name) displaying filter component tests", () => {

    beforeEach(() => {
      component.featurePackId = '1';
      component.jobs = [jobMock];
    });

    function isFilterComponentDisplayed(): boolean {
      let isDisplayed: boolean = false;
      fixture.detectChanges();

      tick();

      // asynchronous check - to wait for the job definition dropdown to be rendered
      setTimeout(() => {
        const compiled = fixture.nativeElement;
        const dropdownComponent = compiled.querySelector('dnr-job-definition-dropdown');
        isDisplayed = dropdownComponent !== null;
      }, 0);

      tick(1);
      return isDisplayed;
    }

    it('should hide the filter component when showJobDefinitionFilter is not set', fakeAsync(() => {
      component.showJobDefinitionFilter = false;
      expect(isFilterComponentDisplayed()).toBeFalse();
    }));

    it('should show the filter component when showJobDefinitionFilter is set', fakeAsync(() => {
      component.showJobDefinitionFilter = true;
      expect(isFilterComponentDisplayed()).toBeTrue();
    }));

    it('should hide the filter component and show empty message when no jobs', fakeAsync(() => {
      component.showJobDefinitionFilter = true;
      component.jobs = [];
      expect(isFilterComponentDisplayed()).toBeFalse();

       // would like to find job.NO_JOB_SPECIFICATIONS
       expect(fixture.nativeElement.querySelector("dnr-info-message")).toBeDefined();
    }));

    it('should hide the filter component and show schedule empty message when no jobs and jobScheduleId set', fakeAsync(() => {
      component.jobScheduleId = '1';
      component.showJobDefinitionFilter = true;
      component.jobs = [];
      expect(isFilterComponentDisplayed()).toBeFalse();

      // would like to find schedule.EMPTY_MESSAGE_NO_JOBS_FOR_SCHEDULE_ID
      expect(fixture.nativeElement.querySelector("dnr-info-message")).toBeDefined();
    }));

    it('should show filter component when there are jobs', fakeAsync(() => {
      component.showJobDefinitionFilter = true;
      component.jobs = [jobMock];
      expect(isFilterComponentDisplayed()).toBeTrue();
    }));

    it('should show filter component when no jobs is due to filter setting, and change empty message', fakeAsync(() => {
      component.showJobDefinitionFilter = true;
      component.jobs = [];
      component.applicationJobName = 'job-definition-name';
      expect(isFilterComponentDisplayed()).toBeTrue();

      // would like to find 'job.EMPTY_MESSAGE_DUE_TO_CURRENT_JOB_DEFINITION_FILTER_SELECTION'
      expect(fixture.nativeElement.querySelector("dnr-info-message")).toBeDefined();
    }));
  });

});
