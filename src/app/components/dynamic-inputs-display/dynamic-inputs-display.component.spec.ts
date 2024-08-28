import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DynamicInputsDisplayComponent } from './dynamic-inputs-display.component';
import { changesMock, dropdownsForNameCacheMockWithoutSelect, dropdownsForNameCacheMockWithSelect, eventDropDownValueMock, inputDataArrayMandatoryFalseMock, inputDataArrayMock, inputDataMock, preloadedValueMock, preloadedValuesMock, preloadedValuesWithoutPicklistMock } from './dynamic-inputs-display.component.mock.data';

describe('DynamicInputsDisplayComponent', () => {
  let component: DynamicInputsDisplayComponent;
  let fixture: ComponentFixture<DynamicInputsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicInputsDisplayComponent],
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
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicInputsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('ngOnChanges', () => {

    it('should clean out any cached value if input data current value is empty on ngOnChanges', () => {

      component.ngOnChanges(changesMock);

      expect(component.formData).toEqual({});
      expect(component.dropdownsForNameCache).toEqual({});
    });

    it('should set the formdata if preloaded values on ngOnChanges', () => {

      component.inputDataArray = inputDataArrayMock;

      component.ngOnChanges(preloadedValueMock);

      expect(component.formData).toEqual({ vimZone: 'cork', 'vimProjectName': 'erad', userName: 'joe', stepValue: null });
      expect(component.dropdownsForNameCache).toEqual({});
    });

  });



  it('should set the dropdown options removing select option on onDropDownOptionChange', () => {

    component.dropdownsForNameCache = dropdownsForNameCacheMockWithSelect;

    component.onDropDownOptionChange(eventDropDownValueMock, inputDataMock);

    expect(component.dropdownsForNameCache).toEqual(dropdownsForNameCacheMockWithoutSelect);
  });

  it('should check for the drop down values presence on hasPickListValues', () => {

    component.preloadedValues = preloadedValuesMock;

    var hasPickListValues = component.hasPickListValues(inputDataMock);

    expect(hasPickListValues).toBeTruthy();
  });

  it('shpuld check for no drop down values on hasPickListValues', () => {

    component.preloadedValues = preloadedValuesWithoutPicklistMock;

    var hasPickListValues = component.hasPickListValues(inputDataMock);

    expect(hasPickListValues).toBeFalsy();
  });


  it('should create drop down options on createDropDownOptions', () => {

    var dropDownOptions = component.createDropDownOptions(inputDataMock);

    expect(dropDownOptions).toEqual([Object({ value: null, label: 'SELECT' })]);
  });


  it('should check for invalid form if mandatory is true', () => {

    component.inputDataArray = inputDataArrayMock;

    var isFormValidMock = component.isFormValid();

    expect(isFormValidMock).toBeFalsy();
  });

  it('should check for valid form if mandatory is false', () => {

    component.inputDataArray = inputDataArrayMandatoryFalseMock;

    var isFormValidMock = component.isFormValid();

    expect(isFormValidMock).toBeTruthy();
  });
});
