import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';

import { ApplicationInformationDetailsComponent } from './application-information-details.component';
import { TranslateService } from '@ngx-translate/core';

describe('ApplicationInformationDetailsComponent', () => {
  let component: ApplicationInformationDetailsComponent;
  let fixture: ComponentFixture<ApplicationInformationDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ApplicationInformationDetailsComponent
      ],
      imports: [
        TranslateModuleMock
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationInformationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit applicationCardSelect on click', () => {
    const cardSelect = spyOn(component.applicationCardSelect, 'emit');

    component.applicationId = "id1";
    component.applicationName = "name1";
    component.applicationDescription = "desc1";

    component.onActionHandler();

    expect(cardSelect).toHaveBeenCalled();
    expect(cardSelect).toHaveBeenCalledWith({
      id: 'id1',
      name: 'name1',
      description: 'desc1'
    })
  });
});
