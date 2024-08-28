import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';

import { IconSize } from './icon-size.enum';
import { InfoMessageComponent } from './info-message.component';
import { TranslateService } from '@ngx-translate/core';

describe('InfoMessageComponent', () => {
  let component: InfoMessageComponent;
  let fixture: ComponentFixture<InfoMessageComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoMessageComponent],
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
    fixture = TestBed.createComponent(InfoMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set titleIcon size to 24px on ngOnInit for small icon', () => {
    //GIVEN
    component.showTopIcon = true;
    component.topIconSize = IconSize.small;
    component.titleIconSize = null;

    //WHEN
    component.ngOnInit();

    //THEN
    expect(component.titleIconSize).toEqual('24px');
  });


  it('should set titleIcon size to 32px on ngOnInit for large icon', () => {
    //GIVEN
    component.showTopIcon = true;
    component.topIconSize = IconSize.large;
    component.titleIconSize = null;

    //WHEN
    component.ngOnInit();

    //THEN
    expect(component.titleIconSize).toEqual('32px');
  });


  it('should over-ride titleIcon size method setting, if set via an input parameter', () => {
    //GIVEN
    component.showTopIcon = true;
    component.topIconSize = IconSize.large;
    component.titleIconSize = "300px";

    //WHEN
    component.ngOnInit();

    //THEN
    expect(component.titleIconSize).toEqual('300px');
  });
});
