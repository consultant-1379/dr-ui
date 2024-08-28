import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnRMainMenuLeftPanelComponent } from './main-menu-left-panel.component';
import { MainMenuLeftPanelDataPipe } from './pipes/main-menu-left-panel-data.pipe';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { selectedItemMock } from './main-menu-left-panel.component.data.mock';
import { ListInfoData, ListInfoItem } from 'src/app/models';
import { EntityType } from 'src/app/enums/entity-type.enum';
import { Router } from '@angular/router';
import { RoutingPathContent } from 'src/app/enums/routing-path-content.enum';

const routerSpy = jasmine.createSpyObj(
  'Router',
  ['navigate', 'navigateByUrl'],
);

describe('DnRMainMenuLeftPanelComponent', () => {
  let component: DnRMainMenuLeftPanelComponent;
  let fixture: ComponentFixture<DnRMainMenuLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [DnRMainMenuLeftPanelComponent],
      providers: [
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provide: MainMenuLeftPanelDataPipe
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DnRMainMenuLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    routerSpy.navigate.calls.reset();
    routerSpy.navigateByUrl.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit itemSelected when click', () => {

    // GIVEN
    const selectedEmitterSpy = spyOn(component.itemSelected, 'emit');

    // WHEN
    component.onSelection(selectedItemMock);

    // THEN
    expect(selectedEmitterSpy).toHaveBeenCalledWith(selectedItemMock);

  });

  it('should emit closeButtonClicked when close button is clicked', () => {

    // GIVEN
    const closedEmitterSpy = spyOn(component.closeButtonClicked, 'emit');

    // WHEN
    component.onCloseButtonClicked();

    // THEN
    expect(closedEmitterSpy).toHaveBeenCalled();

  });

  it('should call the onSelection when ngOnInit is called if items present', () => {
    // GIVEN
    const data: ListInfoData = {
      "navigation.MENU": {
        "selected": true,
        "items": [
          {
            "value": "FeaturePacks",
            "selected": true,
            "label": "navigation.FEATURE_PACKS",
            "name": "navigation.FEATURE_PACKS",
            "route": RoutingPathContent.FeaturePacks,
          },
          {
            "value": "Jobs",
            "label": "navigation.JOBS",
            "name": "navigation.JOBS",
            "selected": false,
            "route": RoutingPathContent.JobsTable,
          },
          {
            "value": "Schedules",
            "label": "navigation.SCHEDULES",
            "name": "navigation.SCHEDULES",
            "selected": false,
            "route": RoutingPathContent.SchedulesTable,
          }
        ]
      }
    };

    component.listType = 'navigation.MENU';
    component.selected = 'FeaturePacks';
    spyOn(component, 'onSelection');

    // WHEN
    component.ngOnInit();

    // THEN
    expect(component.items).toEqual(component.dataPipe.transform(data));
    expect(component.onSelection).toHaveBeenCalled();
  });

  it('should not call the onSelection when ngOnInit is called for no items', () => {
    // GIVEN
    const data: ListInfoData = {
      Menu: {
        selected: true,
        items: [
        ]
      }
    };

    component.listType = 'navigation.MENU';
    component.selected = null;
    component.data = data;
    spyOn(component, 'onSelection');

    // WHEN
    component.ngOnInit();

    // THEN

    expect(component.onSelection).not.toHaveBeenCalled();
  });

  it('should call the getSelectedItemFromPath and undefined return when ngOnInit is called for no items', () => {
    // GIVEN
    const data: ListInfoData = {
      Menu: {
        selected: true,
        items: [
        ]
      }
    };

    component.listType = 'navigation.MENU';
    component.selected = 'FeaturePacks';
    component.data = data;
    spyOn(component, 'onSelection');

    // WHEN
    component.ngOnInit();

    // THEN

    expect(component.onSelection).not.toHaveBeenCalled();
  });

  it('should call the getSelectedItemFromPath and values return when ngOnInit is called if items present', () => {
    // GIVEN

    const dataWithoutSelectedMock: ListInfoData = {
      "navigation.MENU": {
        "items": [
          {
            "value": EntityType.FP,
            "selected": true,
            "label": "navigation.FEATURE_PACKS"
          },
          {
            "value": EntityType.JBS,
            "selected": false,
            "label": "navigation.JOBS"
          }
        ]
      }
    };

    component.listType = 'navigation.MENU';
    component.selected = 'FeaturePacks';
    component.data = dataWithoutSelectedMock;
    spyOn(component, 'onSelection');

    // WHEN
    component.ngOnInit();

    // THEN

    expect(component.onSelection).toHaveBeenCalled();
  });

  it('should emit the selectedItem  on enter pressed', () => {
    //GIVEN
    const selectedItemMock: ListInfoItem = {
      "value": "Jobs",
      "label": "Jobs",
      "name": "Jobs",
      "selected": false
    };
    const emitSpy = spyOn(component.itemSelected, 'emit');
    component.selectedItem = selectedItemMock;

    //WHEN
    component.onEnterPressed();

    //THEN
    expect(emitSpy).toHaveBeenCalledWith(selectedItemMock);
  });

  it('should emit the activeListChanged  on active list changed', () => {
    //GIVEN
    const listMock = {
      'name': 'Feature packs'
    };
    const emitSpy = spyOn(component.activeListChanged, 'emit');
    component.selectedItem = listMock;

    //WHEN
    component.onActiveListChanged(listMock);

    //THEN
    expect(emitSpy).toHaveBeenCalledWith(listMock);
  });

  describe('onSelection tests', () => {
    it('should change route when onSelection called with route defined', () => {
      // GIVEN
      const item = {
        "value": "Jobs",
        "label": "navigation.JOBS",
        "name": "navigation.JOBS",
        "selected": false,
        "route": RoutingPathContent.JobsTable,
      };

      // WHEN
      component.onSelection(item);

      // THEN
      expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(RoutingPathContent.JobsTable);
    });

    it('should NOT change route when onSelection called with NO route defined', () => {
      // GIVEN
      const item = {
        "value": "Jobs",
        "label": "navigation.JOBS",
        "name": "navigation.JOBS",
        "selected": false,
      };

      // navigateByUrl called in ngOnInit
      const callCount = routerSpy.navigateByUrl.calls.count();

      // WHEN
      component.onSelection(item);

      // THEN
      // call count should not have increased.
      expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(callCount);
    });

    it('should send itemSelected event when onSelection called', () => {
      // GIVEN
      const emitSpy = spyOn(component.itemSelected, 'emit');

      const item = {
        "value": "Jobs",
        "label": "navigation.JOBS",
        "name": "navigation.JOBS",
        "selected": false,
      };

      // WHEN
      component.onSelection(item);

      // THEN
      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith(item);
    });
  });
});
