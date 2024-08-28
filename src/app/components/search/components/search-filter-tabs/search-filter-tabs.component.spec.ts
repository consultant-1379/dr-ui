import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';

import { SearchFilterTabsComponent } from './search-filter-tabs.component';
import { TranslateService } from '@ngx-translate/core';

describe('SearchFilterTabsComponent', () => {
  let component: SearchFilterTabsComponent;
  let fixture: ComponentFixture<SearchFilterTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFilterTabsComponent ],
      imports: [
        TranslateModuleMock,
      ],

      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {

    it('should update tabs based on filter', async () => {
      // GIVEN
      component.filter = { name: '*test*', id: '*123*', status: '*DISCOVERED*' };
      // WHEN
      component.ngOnChanges({
        filter: {
          currentValue: component.filter,
          previousValue: {},
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // THEN
      expect(component.tabs.length).toBe(3);
      expect(component.tabs[0].title).toBe('name: test');
      expect(component.tabs[1].title).toBe('id: 123');
      expect(component.tabs[2].title).toBe('status: state.DISCOVERED');  // no dictionary in test
    });

    it('should handled undefined value', async () => {
      // GIVEN
      component.filter = { name: `*${undefined}*`};
      // WHEN
      component.ngOnChanges({
        filter: {
          currentValue: component.filter,
          previousValue: {},
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // THEN
      expect(component.tabs.length).toBe(1);
      expect(component.tabs[0].title).toBe('name: undefined');
    });

    it('should update not update tabs filter is null', async () => {
      // GIVEN
      component.tabs = [];
      // WHEN
      component.ngOnChanges({
        filter: {
          currentValue: null,
          previousValue: {},
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // THEN
      expect(component.tabs.length).toBe(0);
    });

    it('should update not update tabs filter is not changed', async () => {
      // GIVEN
      component.tabs = [];
      // WHEN
      component.ngOnChanges({});
      // THEN
      expect(component.tabs.length).toBe(0);
    });

    it('should update not update tabs no change', async () => {
      // GIVEN
      component.tabs = [];
      // WHEN
      component.ngOnChanges(null);
      // THEN
      expect(component.tabs.length).toBe(0);
    });
  });

  it("_removeWildCards", () => {
    expect(component._removeWildCards("* jim    *")).toEqual("jim");
    expect(component._removeWildCards(null)).toEqual(undefined);
    expect(component._removeWildCards("*hello* there   *")).toEqual("hello there");
  });

  describe('onActionClicked ', () => {
    beforeEach(() => {
      component.filter = {name: "*jim*", id:"*2*"};
      component.tabs = [{title: "jim", content: null}, {title: "id",content: null}];
      spyOn(component.clearAllFilters, 'emit');
    });

    it('clearAll action should emit clearAllFilters event', () => {
      // WHEN
      component.onActionClicked({ value: "clearAll" });

      // THEN
      expect(component.clearAllFilters.emit).toHaveBeenCalled();
      expect(component.filter).toEqual({});
      expect(component.tabs.length).toEqual(0);
    });

    it('unknown action should do nothing', () => {
      // WHEN
      component.onActionClicked({ value: "unknown" });

      // THEN
      expect(component.clearAllFilters.emit).not.toHaveBeenCalled();
      expect(component.filter).toEqual({name: "*jim*", id:"*2*"});
      expect(component.tabs.length).toEqual(2);
    });
  });

  describe('onTabClosed ', () => {

    it('onTabClosed should emit a changeFilter with the new filter (minus the tab being closed) ', () => {

      // GIVEN
      spyOn(component.changeFilter, 'emit');

      component.filter = { name: '*test*', id: '*123*', status: '*DISCOVERED*' };

      // WHEN
      component.onTabClosed(1);

      // THEN
      expect(component.changeFilter.emit).toHaveBeenCalledWith( { name: '*test*', status: '*DISCOVERED*' });
    });

    it('onTabClosed should not emit a changeFilter if tab index is out of bounds ', () => {

      // GIVEN
      spyOn(component.changeFilter, 'emit');

      component.filter = { name: '*test*', id: '*123*', status: '*DISCOVERED*' };

      // WHEN
      component.onTabClosed(5);

      // THEN
      expect(component.changeFilter.emit).not.toHaveBeenCalled();
    });
  });
});
