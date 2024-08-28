import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';

import { Application } from 'src/app/models/application.model';
import { ApplicationsCardViewComponent } from './applications-card-view.component';
import { SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const applications = [
  { id: 'appId1', name: 'appName1', description: 'desc1' },
  { id: 'appId2', name: 'appName2', description: 'desc2' }
];

const appChanges: SimpleChanges = {
  'selectedApplicationId': {
    'currentValue': 'appId2',
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  },
  'applications': {
    'currentValue': applications,
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  }
};

describe('ApplicationsCardViewComponent', () => {

  let component: ApplicationsCardViewComponent;
  let fixture: ComponentFixture<ApplicationsCardViewComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationsCardViewComponent],
      imports: [
        TranslateModuleMock,
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send cardSelected event when card clicked', () => {
    const cardSelected = spyOn(component.applicationCardSelected, 'emit');

    component.applications = applications;
    component.onCardClicked(1);

    expect(cardSelected).toHaveBeenCalled();
    expect(cardSelected).toHaveBeenCalledWith({ id: 'appId2', name: 'appName2', description: 'desc2' });
  });

  it('should NOT send cardSelected event when application selected', () => {
    const cardSelected = spyOn(component.applicationCardSelected, 'emit');
    appChanges.selectedApplicationId = undefined;

    component.ngOnChanges(appChanges);

    expect(cardSelected).toHaveBeenCalledTimes(0);
  });

  it('should scroll to selected card', () => {
    component.ngOnChanges(appChanges);

    const dummyElement = document.createElement('div');
    document.getElementsByClassName = jasmine.createSpy('selectedItemCard').and.returnValue([dummyElement]);
    dummyElement.scrollIntoView = jasmine.createSpy('scrollIntoView')

    component.scrollToSelectedCard();

    expect(dummyElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  });

  it('clearSelection should clear selection', () => {
    // GIVEN
    const selectionCleared = spyOn(component.selectionCleared, 'emit');
    const app1: Application = {id: 'appId1', name: 'appName1', description: 'desc1'};
    const app2: Application = {id: 'appId2', name: 'appName2', description: 'desc2'};
    const app3: Application = {id: 'appId3', name: 'appName3', description: 'desc3'};
    component.applications = [app1, app2, app3];
    component.selectedApplicationId = 'appId2';
    component.selected = [false, true, false];

    // WHEN
    component.clearSelection();

    // THEN
    expect(selectionCleared).toHaveBeenCalled();
    expect(component.selectedApplicationId).toBeNull();
    expect(component.selected).toEqual([false, false, false]);
  });

  it ("_getApplicationIndex should find the application index from an array of applications", () => {
    // GIVEN
    const app1: Application = {id: 'appId1', name: 'appName1', description: 'desc1'};
    const app2: Application = {id: 'findMe', name: 'appName2', description: 'desc2'};
    const app3: Application = {id: 'appId3', name: 'appName3', description: 'desc3'};

    component.selectedApplicationId = 'findMe';
    component.applications = [app1, app2, app3];
    const findMePosition = 1;

    spyOn(component, 'onAppSelect').and.callThrough();

    // WHEN
    component._onApplicationSelection();

    // THEN
    expect(component.onAppSelect).toHaveBeenCalledWith(findMePosition);
  });
});
