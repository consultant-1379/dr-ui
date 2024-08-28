import { ApplicationDetailsMock, filterOptionsFromAppMockData, jobDefinitionsMock, jobDefinitionsOptionAllMock, jobDefinitionsOptionSelectMock, selectOptionsFromAppMockData, simpleChangesCurrentValueMock, typeMock } from './job-definition-dropdown.mock.data';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { JobDefinitionDropdownComponent } from './job-definition-dropdown.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('JobDefinitionDropdownComponent', () => {
  let component: JobDefinitionDropdownComponent;
  let fixture: ComponentFixture<JobDefinitionDropdownComponent>;
  let applicationDetailsFacadeService: ApplicationDetailsFacadeService;

  let spyGetApplicationDetails: jasmine.Spy;
  let spyGetApplicationDetailsLoading: jasmine.Spy;
  let spyClearFailureState: jasmine.Spy;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobDefinitionDropdownComponent],
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
          provide: TranslateService,
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDefinitionDropdownComponent);
    applicationDetailsFacadeService = TestBed.inject(ApplicationDetailsFacadeService);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyGetApplicationDetails = spyOn(applicationDetailsFacadeService, 'getApplicationDetails').and.returnValue(of(ApplicationDetailsMock));
    spyGetApplicationDetailsLoading = spyOn(applicationDetailsFacadeService, 'getApplicationDetailsLoading').and.returnValue(new Observable());
    spyClearFailureState = spyOn(applicationDetailsFacadeService, 'clearFailureState');

  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getApplicationDetails, getApplicationDetailsLoading and clearFailureState should be called on ngOnInit', () => {
    // GIVEN
    component.jobDefinitionOptions = null;
    component.isFilter = true;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(spyGetApplicationDetails).toHaveBeenCalled();
    expect(spyGetApplicationDetailsLoading).toHaveBeenCalled();
    expect(spyClearFailureState).toHaveBeenCalled();
    expect(component.jobDefinitionOptions).toEqual(filterOptionsFromAppMockData);
  });

  it('when filter false, ngOnInit subscribe should create expected dropdown values', (() => {

     // GIVEN
    component.jobDefinitionOptions = null;
    component.isFilter = false;

     // WHEN
    component.ngOnInit();

    // THEN
    expect(component.jobDefinitionOptions).toEqual(selectOptionsFromAppMockData);
  }));

  it('loadApplicationDetails of applicationDetailsFacadeService should be called on ngOnChanges', () => {

    component.featurePackId = '1234';
    component.applicationId = '12';

    const spyLoadApplicationDetails = spyOn(applicationDetailsFacadeService, 'loadApplicationDetails');

    component.ngOnChanges(simpleChangesCurrentValueMock);

    expect(spyLoadApplicationDetails).toHaveBeenCalled();
  });


  it('should emit an event on selection drop down Change', () => {
    //GIVEN
    component.isFilter = true;
    component.jobDefinitionOptions = jobDefinitionsOptionAllMock;
    const spyFilterChange = spyOn(component.filterChange, 'emit');

    //WHEN
    component.onSelectionChange(typeMock);

    //THEN
    expect(spyFilterChange).toHaveBeenCalled();
    expect(component.jobDefinitionOptions).toEqual(jobDefinitionsOptionAllMock);
  });


  it('should remove select option for isFilter false on selection drop down Change', () => {
    //GIVEN
    component.isFilter = false;
    component.jobDefinitionOptions = jobDefinitionsOptionSelectMock;

    //WHEN
    component.onSelectionChange(typeMock);

    //THEN
    expect(component.jobDefinitionOptions).toEqual(jobDefinitionsMock);
  });
});
