import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { JobScheduleDetailsFacadeService } from 'src/app/lib/job-schedule-details/services/job-schedule-details-facade.service';
import { JobScheduleDetailsFacadeServiceMock } from 'src/app/lib/job-schedule-details/services/job-schedule-facade.service.mock';
import { RbacService } from 'src/app/services/rbac.service';
import { RbacServiceMock } from 'src/app/services/rbac.service.mock';
import { Router } from '@angular/router';
import { RoutingPathContent } from 'src/app/enums/routing-path-content.enum';
import { ScheduleDetailColumnViewComponent } from './schedule-detail-column-view.component';
import { SimpleChanges } from '@angular/core';
import { TranslateServiceMock } from '@erad/utils';
import { jobScheduleDetailsMock } from 'src/app/rest-services/job-schedule.service.mock';
import { provideMockStore } from '@ngrx/store/testing';

const RouterSpy = jasmine.createSpyObj(
  'Router',
  ['navigate']
);

describe('ScheduleDetailColumnViewComponent', () => {
  let component: ScheduleDetailColumnViewComponent;
  let fixture: ComponentFixture<ScheduleDetailColumnViewComponent>;

  const scheduleChange: SimpleChanges = {
    'schedule': {
      'currentValue': jobScheduleDetailsMock,
      'firstChange': true,
      previousValue: undefined,
      isFirstChange() { return true }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleDetailColumnViewComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: RouterSpy
        },
        {
          provide: RbacService,
          useClass: RbacServiceMock
        },
        provideMockStore(),
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provide: JobScheduleDetailsFacadeService,
          useClass: JobScheduleDetailsFacadeServiceMock
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDetailColumnViewComponent);
    component = fixture.componentInstance;
    component.schedule = jobScheduleDetailsMock;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to FeaturePack table with for Feature Pack type', () => {

    //GIVEN
    component.ngOnChanges(scheduleChange);
    spyOn(component, '_navigateAway').and.callThrough();

    //WHEN
    component.onHyperlinkClicked({ label: "schedule.FEATURE_PACK" });

    //THEN
    expect(component._navigateAway).toHaveBeenCalledWith({},  RoutingPathContent.FeaturePacks);
    expect(RouterSpy.navigate).toHaveBeenCalledWith([RoutingPathContent.FeaturePacks], {
      queryParams: {
      },
    });
  });

  it('should navigate to FeaturePackDetail with proper query params for Application type', () => {

    //GIVEN
    component.ngOnChanges(scheduleChange);
    spyOn(component, '_navigateAway').and.callThrough();

    //WHEN
    component.onHyperlinkClicked({ label: "job.APPLICATION" });

    //THEN
    expect(component._navigateAway).toHaveBeenCalledWith({
      id: jobScheduleDetailsMock.jobSpecification.featurePackId,
      applicationId: jobScheduleDetailsMock.jobSpecification.applicationId,
      linkAwaySection: "APPLICATIONS",
    }, RoutingPathContent.FeaturePackDetail);
    expect(RouterSpy.navigate).toHaveBeenCalledWith([RoutingPathContent.FeaturePackDetail], {
      queryParams: {
        id: jobScheduleDetailsMock.jobSpecification.featurePackId,
        applicationId: jobScheduleDetailsMock.jobSpecification.applicationId,
        linkAwaySection: "APPLICATIONS"
      },
    });
  });

  describe('ngOnChanges tests', () => {

    it('should create informationItems if schedule data set 1 (disable case)', () => {
      // WHEN

      scheduleChange.schedule.currentValue.enabled = false;
      scheduleChange.schedule.currentValue.description = null;

      component.ngOnChanges(scheduleChange);

      // THEN
      expect(component.informationItems).not.toEqual([]);
      expect(component.informationItems[0].label).toEqual("schedule.SCHEDULE_NAME");
      expect(component.informationItems[0].value).toEqual("schedule1");

      const descriptionItem = component.informationItems.find(item => item.label === "schedule.DESCRIPTION");
      expect(descriptionItem.value).toEqual("-- --");

      // execution switch component test - enabled false
      const executionItem = component.informationItems.find(item => item.label === "schedule.EXECUTION");
      expect(executionItem.componentSelectorName).toEqual("dnr-enable-switch");
      expect(executionItem.value).toEqual("false");
      expect(executionItem.tooltip).toEqual("schedule.ENABLE_TOOLTIP");
      expect(executionItem.hyperlink).toEqual(false);
      expect(executionItem.isDate).toEqual(undefined);
      expect(executionItem.isBold).toEqual(undefined);
    });

    it('should create informationItems if schedule data set 2 (enable case)', () => {
      // WHEN
      scheduleChange.schedule.currentValue.enabled = true;
      scheduleChange.schedule.currentValue.description = "some text for schedule description";
      scheduleChange.schedule.currentValue.jobSpecification.description = "some text for job description";
      component.ngOnChanges(scheduleChange);

      // THEN
      const descriptionItem = component.informationItems.find(item => item.label === "schedule.DESCRIPTION");
      expect(descriptionItem.value).toEqual("some text for schedule description");

      const jobDescriptionItem = component.informationItems.find(item => item.label === "schedule.JOB_DESCRIPTION");
      expect(jobDescriptionItem.value).toEqual("some text for job description");


      // execution switch component test - enabled true
      const executionItem = component.informationItems.find(item => item.label === "schedule.EXECUTION");
      expect(executionItem.componentSelectorName).toEqual("dnr-enable-switch");
      expect(executionItem.value).toEqual("true");
      expect(executionItem.tooltip).toEqual("schedule.DISABLE_TOOLTIP");
      expect(executionItem.hyperlink).toEqual(false);
      expect(executionItem.isDate).toEqual(undefined);
      expect(executionItem.isBold).toEqual(undefined);
    });

    it('should not show an enable switch if user only has readOnly access', () => {
      //GIVEN
      scheduleChange.schedule.currentValue.enabled = true;
      component.ngOnChanges(scheduleChange);
      spyOn(component.rbacService, 'isReadWrite').and.returnValue(false);

      //WHEN
      component.ngOnChanges(scheduleChange);

      //THEN
      const executionItem = component.informationItems.find(item => item.label === "schedule.EXECUTION");
      expect(executionItem.componentSelectorName).toEqual(null);
      expect(executionItem.value).toEqual("ENABLED");
      expect(executionItem.tooltip).toEqual(null);
      expect(executionItem.hyperlink).toEqual(false);
      expect(executionItem.isDate).toEqual(undefined);
      expect(executionItem.isBold).toEqual(undefined);
    });

    it('should clear informationItems if schedule unselected', () => {

      //GIVEN
      const unselectChange: SimpleChanges = {
        'schedule': {
          'currentValue': jobScheduleDetailsMock,
          'firstChange': true,
          previousValue: undefined,
          isFirstChange() { return true }
        }
      };

      // WHEN
      component.schedule = undefined;
      component.ngOnChanges(unselectChange);

      // THEN
      expect(component.informationItems).toEqual([]);
    });
  });


  describe('onComponentEvent tests', () => {

    beforeEach(() => {
      spyOn(component.jobScheduleDetailsFacadeService, 'clearFailureState');
      spyOn(component.jobScheduleDetailsFacadeService, 'enableJobSchedule');
    });

    it('should send call to disable schedule', () => {

      //WHEN
      component.onComponentEvent({
        value: false, 'informationItem': {
          componentSelectorName: "dnr-enable-switch",
          hyperlink: false,
          isBold: false,
          label: 'Execution',
          value: 'true',
          tooltip: "schedule.DISABLE_TOOLTIP"
        }
      });

      //THEN
      const disableSchedule = false;
      expect(component.jobScheduleDetailsFacadeService.clearFailureState).toHaveBeenCalled();
      expect(component.jobScheduleDetailsFacadeService.enableJobSchedule).toHaveBeenCalledWith
        (jobScheduleDetailsMock.id, jobScheduleDetailsMock.name, disableSchedule, true);
    });

    it('should send call to enable schedule', () => {

      //WHEN
      component.onComponentEvent({
        value: true, 'informationItem': {
          componentSelectorName: "dnr-enable-switch",
          hyperlink: false,
          isBold: false,
          label: 'Execution',
          value: 'false',
          tooltip: "schedule.ENABLE_TOOLTIP"
        }
      });

      //THEN
      const enableSchedule = true;
      expect(component.jobScheduleDetailsFacadeService.clearFailureState).toHaveBeenCalled();
      expect(component.jobScheduleDetailsFacadeService.enableJobSchedule).toHaveBeenCalledWith
        (jobScheduleDetailsMock.id, jobScheduleDetailsMock.name, enableSchedule, true);
    });


    it('should not send call if component is not schedule enable switcher', () => {

      spyOn(component, '_sendCallToEnableSchedule');
      //WHEN
      component.onComponentEvent({
        value: true, 'informationItem': {
          componentSelectorName: "dnr-some-other-component",
          hyperlink: false,
          isBold: false,
          label: 'Some other label',
          value: 'false',
        }
      });

      //THEN
      expect(component._sendCallToEnableSchedule).not.toHaveBeenCalled();
    });
  });
})
