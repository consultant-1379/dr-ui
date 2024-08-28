import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';

import { AppConstants } from 'src/app/constants';
import { DatePipe } from "@angular/common";
import { GeneralInformationMainPanelComponent } from './general-information-main-panel.component';
import { Icon } from '@eui/theme';
import { InformationItemModel } from 'src/app/models/information-item.model';
import { TranslateService } from '@ngx-translate/core';

const itemMockDate: InformationItemModel =
{
  'label': 'Creation date',
  'value': '2023-05-12T15:15:14Z',
  'isDate': true
};

const itemMock: InformationItemModel =
{
  'label': 'job1 definition',
  'value': 'job 1 definition',
  'isDate': false,
  'hyperlink': true,
  'tooltip': 'my-tooltip'
};
const itemValueUndefinedMock: InformationItemModel =
{
  'label': 'Creation date',
  'value': undefined,
  'isDate': false
};

const itemValueEmptyStringMock: InformationItemModel =
{
  'label': 'Creation date',
  'value': '',
  'isDate': false
};

describe('GeneralInformationMainPanelComponent', () => {
  let component: GeneralInformationMainPanelComponent;
  let fixture: ComponentFixture<GeneralInformationMainPanelComponent>;

  function _registerEUIElements() {
    if (!customElements.get('eui-icon')) {
      customElements.define('eui-icon', Icon as unknown as CustomElementConstructor);
    }
  }

  beforeEach(async () => {
    _registerEUIElements();

    await TestBed.configureTestingModule({
      declarations: [GeneralInformationMainPanelComponent],
      imports: [
        TranslateModuleMock,
      ],
      providers: [
        DatePipe,
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInformationMainPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date on formatValue', () => {
    var formattedDate = component.formatValue(itemMockDate);
    expect(formattedDate).toContain('May');
  });

  it('should not format date and return value as it is on formatValue', () => {
    var formattedDate = component.formatValue(itemMock);

    expect(formattedDate).toEqual(itemMock.value);
  });

  it('should return "-- --" on formatValue if item value is undefined', () => {
    var formattedDate = component.formatValue(itemValueUndefinedMock);

    expect(formattedDate).toEqual('-- --');
  });

  it('should return "-- --" on formatValue if item value is an empty string', () => {
    var formattedDate = component.formatValue(itemValueEmptyStringMock);
    expect(formattedDate).toEqual('-- --');
  });

  it('should set tooltip icon color to blue on mouseenter on hover', () => {

    //GIVEN
    const Icon = customElements.get('eui-icon');
    const iconComponent = new Icon();
    iconComponent.setAttribute("class", "tooltip-icon");

    spyOn(iconComponent, 'addEventListener').and.callFake((event, callback) => {
      if (event === 'mouseenter') {
        callback();
      }
    });

    //WHEN
    component._addHoverColorChange([iconComponent]);

    // THEN
    expect(iconComponent.getAttribute('color')).toBe(AppConstants.colors.blue);
  });

  it('should set tooltip icon color to black on mouseleave on hover', () => {

    //GIVEN
    const Icon = customElements.get('eui-icon');
    const iconComponent = new Icon();
    iconComponent.setAttribute("class", "tooltip-icon");

    spyOn(iconComponent, 'addEventListener').and.callFake((event, callback) => {
      if (event === 'mouseleave') {
        callback();
      }
    });

    //WHEN
    component._addHoverColorChange([iconComponent]);

    // THEN
    expect(iconComponent.getAttribute('color')).toBe(AppConstants.colors.black);
  });

  it('should send event when hyperlink clicked', () => {

    //GIVEN
    const emit = spyOn(component.hyperlinkClicked, 'emit');
    const info = { label: "name", value: "val" };

    //WHEN
    component.onClickHandler(info);

    // THEN
    expect(emit).toHaveBeenCalled();
    expect(emit).toHaveBeenCalledOnceWith(info);
  });

  it('should send event when embedded component event occurs', () => {

    //GIVEN
    const emit = spyOn(component.componentEvent, 'emit');
    const info = { label: "name", value: "val", componentSelectorName: "dnr-enable-switch"};

    //WHEN
    component.onComponentEvent(true, info);

    // THEN
    expect(emit).toHaveBeenCalledOnceWith({value:true, informationItem: info});
  });
});
