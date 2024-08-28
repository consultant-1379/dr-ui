import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemInformationDetailsComponent } from './item-information-details.component';

import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

const fakeActivatedRoute = { snapshot: { queryParams: { linkAwaySection: 'OBJECTS' } } };

let itemsMock = null;

describe('ItemInformationDetailsComponent', () => {
  let component: ItemInformationDetailsComponent;
  let fixture: ComponentFixture<ItemInformationDetailsComponent>;

  class MockTranslateService {
    private translations: { [key: string]: string | { [nestedKey: string]: string } } = {
      "itemInformationDetails": {
        "GENERAL_INFORMATION": "General Information",
        "APPLICATIONS": "Applications",
        "APPLICATION_DETAIL": "Application details",
        "DESCRIPTIONS": "Descriptions",
        "ATTACHMENTS": "Attachments",
        "ACTIONS": "Actions",
        "CATEGORY": "Category",
        "OBJECTS": "Objects",
        "RECONCILIATION_INPUT": "Reconciliation inputs",
        "ERROR_DETAIL": "Error details",
        "FILTER_ACTION_DETAIL": "Filter details"
      },
    };

    instant(key: string): string {
      const keys = key.split('.');
      const itemInformationDetails = this.translations [keys[0]];
      const lookedUpValue = itemInformationDetails[keys[1]];
      return lookedUpValue || key;
    }
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        ItemInformationDetailsComponent
      ],
      imports: [
        BrowserAnimationsModule,
        StoreModule.forRoot({}),

      ],
      providers: [
        {
          provide: TranslateService,
          useClass: MockTranslateService
        },
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemInformationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // reset back if changed in a test
    itemsMock = [
      {
        id: "APPLICATIONS",
        selectionEnabled: false,
        showNavigationIcon: true,
        selected: false,
        expanded: true,
        title: "itemInformationDetails.APPLICATIONS",
        inactiveSvgPath: "./assets/icons/duplicate.svg",
        activeSvgPath: "./assets/icons/duplicate.svg",
        badgeText: 3
      },
      {
        id: "GENERAL_INFORMATION",
        selectionEnabled: false,
        showNavigationIcon: false,
        selected: false,
        expanded: false,
        title: "itemInformationDetails.GENERAL_INFORMATION",
        inactiveSvgPath: "./assets/icons/info.svg",
        activeSvgPath: "./assets/icons/info__white.svg"
      },
      {
        id: "OBJECTS",
        selectionEnabled: false,
        showNavigationIcon: true,
        selected: false,
        title: 'itemInformationDetails.OBJECTS',
        inactiveSvgPath: './assets/icons/versions.svg',
        activeSvgPath: './assets/icons/versions_white.svg',
      },
    ];
    component.selectableItems = JSON.parse(JSON.stringify(itemsMock));
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit tests', () => {
    it('should set selected value based on URL linkAwaySection = OBJECTS', () => {
      // WHEN
      component.ngOnInit();

      // THEN
      component.selectableItems[1].selected = false;
      component.selectableItems[2].selected = true; // OBJECTS
    });

    it('should always set top accordion expanded when init', () => {
      // WHEN
      component.ngOnInit();

      // THEN
      component.selectableItems[0].expanded = true;
    });
  });

  describe('ngOnChanges tests', () => {

    it('should i18n translate accordion types', () => {
      //WHEN
      component.ngOnChanges();

      //THEN - its purpose is to translate
      expect(component.accordionItemTypes.GENERAL_INFORMATION).toEqual('General Information');
      expect(component.accordionItemTypes.APPLICATIONS).toEqual('Applications');
      expect(component.accordionItemTypes.APPLICATION_DETAIL).toEqual('Application details');
      expect(component.accordionItemTypes.OBJECTS).toEqual('Objects');
      expect(component.accordionItemTypes.RECONCILIATION_INPUT).toEqual('Reconciliation inputs');
      expect(component.accordionItemTypes.ERROR_DETAIL).toEqual('Error details');
      expect(component.accordionItemTypes.FILTER_ACTION_DETAIL).toEqual('Filter details');
    });

    it('should get selectable items on getSelectableItems  (i18n translating item title) ', () => {
      //WHEN
      component.ngOnChanges();

      //THEN
      expect(component.selectableItems[0].title).toEqual('Applications');
      expect(component.selectableItems[1].title).toEqual('General Information');
    });
  });

  describe('linkAwayClick event tests', () => {

    it('should send linkAwayClick event when onLaunchIconClicked received', () => {
      //GIVEN
      const spy = spyOn(component.linkAwayClick, 'emit');

      //WHEN
      component.onLaunchIconClicked(itemsMock[0]);

      //THEN
      expect(spy).toHaveBeenCalledWith(itemsMock[0].id);
    });

    it('should send accordionHeaderClick event when onAccordionHeaderClicked received', () => {
      //GIVEN
      const spy = spyOn(component.accordionHeaderClick, 'emit');

      //WHEN
      component.onAccordionHeaderClicked(true, itemsMock[0]);

      //THEN
      expect(spy).toHaveBeenCalledWith(component.selectableItems[0].id);
    });
  });

  describe('onAccordionHeaderClicked event tests', () => {

    it('should set item selected when highlightAccordionHeaders = true', () => {
      //GIVEN
      component.highlightAccordionHeaders = true;
      itemsMock[0].selected = false;

      //WHEN
      component.onAccordionHeaderClicked(true, itemsMock[0]);

      //THEN
      expect(component.selectableItems[0].selected).toBeTrue();
    });

    it('should NOT set item selected when highlightAccordionHeaders = false', () => {
      //GIVEN
      component.highlightAccordionHeaders = false;
      itemsMock[0].selected = false;

      //WHEN
      component.onAccordionHeaderClicked(true, itemsMock[0]);

      //THEN
      expect(component.selectableItems[0].selected).toBeFalse();
    });

    it('should expand top item when other item selected', () => {
      //GIVEN
      component.highlightAccordionHeaders = true;
      itemsMock[0].selected = false;

      //WHEN
      component.onAccordionHeaderClicked(true, itemsMock[1]);

      //THEN
      expect(component.selectableItems[0].expanded).toBeTrue();
    });
  });

  describe('copyDownloadIconColor tests', () => {

    afterEach(() => {
      component.highlightAccordionHeaders = false;
      component.selectableItems = [];
    });

    it('ngOnChanges should set copyDownloadIconColor to empty string when highlightAccordionHeaders is false and general info not selected', () => {
      //GIVEN
      component.highlightAccordionHeaders = false;
      component.selectableItems = itemsMock;  //general info not selected

      //WHEN
      component.ngOnChanges();

      //THEN
      expect(component.copyDownloadIconColor).toEqual('');
    });

    it('ngOnChanges should set copyDownloadIconColor to empty string when highlightAccordionHeaders is false and general info is selected', () => {
      //GIVEN
      component.highlightAccordionHeaders = false;
      component.copyDownloadIconColor = 'white';
      component.selectableItems[1].selected = true;  // general info selected

      //WHEN
      component.ngOnChanges();

      //THEN
      expect(component.copyDownloadIconColor).toEqual('');
    });

    it('ngOnChanges should set copyDownloadIconColor to white when highlightAccordionHeaders is true and general info selected', () => {
      //GIVEN
      component.copyDownloadIconColor = '';

      component.highlightAccordionHeaders = true;
      component.selectableItems[1].selected = true;

      //WHEN
      component.ngOnChanges();

      //THEN
      expect(component.copyDownloadIconColor).toEqual('white');
    });

    it('ngOnChanges should set copyDownloadIconColor to empty string when highlightAccordionHeaders is true but general info not selected', () => {
      //GIVEN
      component.highlightAccordionHeaders = true;

      //WHEN
      component.ngOnChanges();

      //THEN
      expect(component.copyDownloadIconColor).toEqual('');
    });
  });
});
