import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock, ErrorType } from '@erad/core';
import { Observable, of } from 'rxjs';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { JobDetailsColumnContainerComponent } from './job-details-column-container.component';
import { JobDetailsFacadeService } from 'src/app/lib/job-detail/services/job-details-facade.service';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleChanges } from '@angular/core';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { jobDetailsMock } from '../reconcile-job-dialog/reconcile-job-dialog.component.mock.data';
import { provideMockStore } from '@ngrx/store/testing';

describe('JobDetailsColumnContainerComponent', () => {
  let component: JobDetailsColumnContainerComponent;
  let fixture: ComponentFixture<JobDetailsColumnContainerComponent>;
  let router: Router;
  let jobDetailsFacadeService: JobDetailsFacadeService;
  let tabsService: TabsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetailsColumnContainerComponent ],
      imports: [
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: TabsService,
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
          ,
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailsColumnContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    tabsService = TestBed.inject(TabsService);
    jobDetailsFacadeService = TestBed.inject(JobDetailsFacadeService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit tests', () => {
    beforeEach(() => {
      spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(false));
      spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(of(null));
    });

    it('should remove OBJECTS nav link WHEN showObjectsLink false', () => {
      // GIVEN
      component.showObjectsLink = false;

      // WHEN
      component.ngOnInit();

      // THEN
      const showNavigationIcon = component.selectableItems.find(config => config.id === 'OBJECTS').showNavigationIcon;
      expect(showNavigationIcon).toBeFalse();
    });

    it('should show OBJECTS nav link WHEN showObjectsLink true', () => {
      // GIVEN
      component.showObjectsLink = true;

      // WHEN
      component.ngOnInit();

      // THEN
      const showNavigationIcon = component.selectableItems.find(config => config.id === 'OBJECTS').showNavigationIcon;
      expect(showNavigationIcon).toBeTrue();
    });
  });

  describe('ngOnChange tests', () => {
    it('should loadJobDetails when jobId changes', () => {
      const jobIdChange: SimpleChanges = {
        'jobId': {
          'currentValue': "123",
          'firstChange': false,
          previousValue: "321",
          isFirstChange() { return false }
        }
      };

      // GIVEN
      const loadItems = spyOn(component.jobDetailsFacadeService, 'loadDetails');
      component.jobId = "123";

      // WHEN
      component.ngOnChanges(jobIdChange);

      // THEN
      expect(loadItems).toHaveBeenCalled();
      expect(loadItems).toHaveBeenCalledWith("123");
    });
  });

  describe('onLinkAwayClick tests', () => {

    it('should navigate to Jobs entity when canCreateNewTab is true on onLinkAwayClick', () => {
      // GIVEN
      component.job = jobDetailsMock;
      const spyNavigate = spyOn(router, 'navigate');
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(true);

      // WHEN
      component.onLinkAwayToDiscoveredObjects(jobDetailsMock.id);

      // THEN
      expect(spyNavigate).toHaveBeenCalledWith(['job-detail'],
        Object({ queryParams: Object({ id: jobDetailsMock.id, linkAwaySection: jobDetailsMock.id }) }));
    });

    it('should NOT navigate to Jobs entity when canCreateNewTab is false on onLinkAwayClick', () => {
      // GIVEN
      component.job = jobDetailsMock;
      const spyNavigate = spyOn(router, 'navigate');
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(false);

      // WHEN
      component.onLinkAwayToDiscoveredObjects(jobDetailsMock.id);

      // THEN
      expect(spyNavigate).not.toHaveBeenCalled();
    });
  });

  describe('jobDetailsFacadeService subscribe tests tests', () => {
    it('should set job when getJobDetails received', () => {
      // GIVEN
      spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of(jobDetailsMock));
      spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(false));
      spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(new Observable());

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.job).toEqual(jobDetailsMock);
    });

    it('should set loading when getJobDetailsLoading received', () => {
      // GIVEN
      spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of(jobDetailsMock));
      spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(true));
      spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(new Observable());

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.loading).toEqual(true);
    });

    it('should set failure when getJobDetailsFailure received', () => {
      // GIVEN
      const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
      spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of(jobDetailsMock));
      spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(true));
      spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(of(mockFailure));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.failure).toEqual(mockFailure);
    });
  });

  describe('_hideObjectsAccordionIfDiscoveryFailed tests', () => {

    beforeEach(async () => {
      spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(false));
      spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(new Observable());
    });

    it('should update jobDetailsConfig to hide accordion for jobs whose status is discovery failed', () => {
      // GIVEN
      jobDetailsMock.status = JobStatus.DISCOVERY_FAILED;
      spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of(jobDetailsMock));
      expect(component.selectableItems.length).toBe(3);

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.selectableItems.length).toBe(2);
    });

    it('should update jobDetailsConfig to show accordion for jobs whose status is NOT discovery failed', () => {
      // GIVEN
      jobDetailsMock.status = JobStatus.COMPLETED;
      spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of(jobDetailsMock));
      expect(component.selectableItems.length).toBe(3);

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.selectableItems.length).toBe(3);
    });
  });
});
