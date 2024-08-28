import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { AdvanceSearchValue } from './components/search-filter/search-filter.model';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit quickSearch when onQuickSearchClicked', () => {
    // GIVEN
    const emitSpy = spyOn(component.quickSearch, 'emit');

    // WHEN
    component.onQuickSearchClicked('quickSearchString');

    // THEN
    expect(emitSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('quickSearchString');
  });

  it('should emit searchFilterChanged when onChangeFilter', () => {
    // GIVEN
    const emitSpy = spyOn(component.searchFilterChanged, 'emit');
    const filter = { name: 'myName' };

    // WHEN
    component.onChangeFilter(filter);

    // THEN
    expect(component.filter).toEqual(filter);
    expect(emitSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(filter);
  });

  describe('onAdvanceSearchClicked', () => {

    it('should add wildcards to filter strings when search clicked', () => {
      // GIVEN
      const emitSpy = spyOn(component.searchFilterChanged, 'emit');
      component.searchFields = [{ key: 'name', label: "Name", type: 'string' }];

      const advSearchEvent: AdvanceSearchValue[] = [{ key: 'name', label: "Name", value: "name1" }];

      // WHEN
      component.onAdvanceSearchClicked(advSearchEvent);

      // THEN
      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith({ name: '*name1*' });
    });

    it('should NOT add wildcards to filter numbers when search clicked', () => {
        // GIVEN
        const emitSpy = spyOn(component.searchFilterChanged, 'emit');
        component.searchFields = [{ key: 'id', label: "ID", type: 'number' }];

        const advSearchEvent: AdvanceSearchValue[] = [{ key: 'id', label: "ID", value: "123" }];

        // WHEN
        component.onAdvanceSearchClicked(advSearchEvent);

        // THEN
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith({ id: '123' });
      });
  });
});
