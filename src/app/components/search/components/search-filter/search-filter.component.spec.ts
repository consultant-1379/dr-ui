import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { AutocompleteInputModuleMock, ButtonModule, FieldType, SearchBarModule } from '@erad/components';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';
import { TranslateService } from '@ngx-translate/core';
import { SearchFilterComponent } from './search-filter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

describe('SearchFilterComponent', () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchFilterComponent],
      imports: [
        BrowserAnimationsModule,
        AutocompleteInputModuleMock,
        ReactiveFormsModule,
        MatCheckboxModule,
        FormsModule,
        ButtonModule,
        MatSelectModule,
        MatMenuModule,
        MatFormFieldModule,
        SearchBarModule,
        MatInputModule,
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
    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.searchBar, 'setAdvanceFormValue').and.returnValues(null);

    // Mock out so not called in tests (as function has a timeout).
    spyOn(component, '_setAdvanceSearchFilter').and.returnValue(null);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize advanceSearch based and searchFields', async () => {
      // GIVEN
      component.searchFields = [{ key: 'name', label: 'Name', type: 'text' }];

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.isAdvanceSearch).toBeTrue();
      expect(component.searchFields).toBeDefined();
    });

    it('should have input type to select if fieldOptions present', async () => {
      // GIVEN
      component.searchFields = [{
        key: 'name', label: 'Name', type: 'text',
        fieldOptions: [{ key: 'key1', value: 'value1' }, { key: 'all', value: undefined }]
      }];

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.isAdvanceSearch).toBeTrue();
      expect(component.searchFields).toBeDefined();
      expect(component.searchFields[0].fieldType).toEqual(FieldType.singleSelect);
    });

    it('should initialize advanceSearch based and searchFields', async () => {
      // GIVEN
      component.searchFields = [{ key: 'name', label: 'Name', type: 'text' }];

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.isAdvanceSearch).toBeTrue();
      expect(component.searchFields).toBeDefined();
    });

    it('should set placeholder in number searchFields', async () => {
      // GIVEN
      component.searchFields = [{ key: 'name', label: 'Name', type: 'number' }];

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.isAdvanceSearch).toBeTrue();
      expect(component.searchFields).toBeDefined();
      expect(component.searchFields[0].placeholder).toEqual('NUMBER_SEARCH_PLACEHOLDER');
    });

    it('should set bespoke placeholder if placeholder defined', async () => {
      // GIVEN
      component.searchFields = [{ key: 'name', label: 'Name', type: 'number', placeholder: "bespokePH" }];

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.isAdvanceSearch).toBeTrue();
      expect(component.searchFields).toBeDefined();
      expect(component.searchFields[0].placeholder).toEqual('bespokePH');
    });
  });

  describe('ngOnChanges', () => {
    it('should not reset search if filter does not change', async () => {
      // GIVEN
      component.quickSearchValue = 'test';

      // WHEN
      component.ngOnChanges({
        placeholder: {
          currentValue: "hello",
          previousValue: {},
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // THEN
      expect(component.quickSearchValue).toBe('test');
    });

    it('should update quickSearchValue based on filter', async () => {
      // GIVEN
      component.filter = { name: '*test*' };

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
      expect(component.quickSearchValue).toBe('test');
    });

    it('should update quickSearchValue based on filter when specific id set', async () => {
      // GIVEN
      component.filter = { name: '*test*', id: '123' };

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
      expect(component.quickSearchValue).toBe('test');
    });

    it('should not set quick search value when advance search', async () => {
      // GIVEN
      component.filter = { name: '*test*', id: '*123*' };
      component.searchBar = {
        setAdvanceFormValue: jasmine.createSpy('setAdvanceFormValue')
      } as any;

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
      expect(component.quickSearchValue).toBe('');
    });

    it('should update advanceSearchValues based on filter when specific id set for advance search', async () => {
      // GIVEN
      component.isAdvanceSearch = true;
      component.filter = { name: '*test*', id: '123' };

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
      expect(component._setAdvanceSearchFilter).toHaveBeenCalled();
      expect(component._setAdvanceSearchFilter).toHaveBeenCalledWith('name:"test"id:"123"');
    });

  });

  describe('onSearchClicked', () => {
    it('should emit quickSearch event', async () => {
      // GIVEN
      spyOn(component.quickSearch, 'emit');
      const event = 'test search';

      // WHEN
      component.onSearchClicked(event);

      // THEN
      expect(component.quickSearch.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('onAdvanceSearchClicked', () => {
    it('should emit advancedSearch event', async () => {
      // GIVEN
      spyOn(component.advanceSearch, 'emit');
      const event = { name: 'test' };
      component.searchFields = [{ key: 'name', label: 'Name', type: 'text'  }];
      component.searchBar = {
        value: 'test',
        setAdvanceFormValue: () => {}
      } as any;

      // WHEN
      component.onAdvanceSearchClicked(event);

      // THEN
      expect(component.advanceSearch.emit).toHaveBeenCalledWith([
        { label: 'Name', key: 'name', value: 'test' }
      ]);
    });

    it('should emit advancedSearch event with quick search value if nothing in advance search', async () => {
      // GIVEN
      spyOn(component.advanceSearch, 'emit');
      component.searchFields = [{ key: 'name', label: 'Name', type: 'text'  }];
      component.searchBar = {
        value: 'test',
        setAdvanceFormValue: () => {}
      } as any;

      // WHEN
      component.onAdvanceSearchClicked({});

      // THEN
      expect(component.advanceSearch.emit).toHaveBeenCalledWith([
        { label: 'Name', key: 'name', value: 'test' }
      ]);
    });
  });

  describe('_shouldShowNameInQuickSearch', () => {
    it('should return true for single key name', async () => {
      component.filter = { name: '*test*' };
      expect(component._shouldShowNameInQuickSearch()).toBeTrue();
    });

    it('should return true for name and specific id', async () => {
      component.filter = { name: '*test*', id: '123' };
      expect(component._shouldShowNameInQuickSearch()).toBeTrue();
    });

    it('should return false for multiple keys', async () => {
      component.filter = { name: '*test*', id: '123*', other: 'value' };
      expect(component._shouldShowNameInQuickSearch()).toBeFalse();
    });
  });
});
