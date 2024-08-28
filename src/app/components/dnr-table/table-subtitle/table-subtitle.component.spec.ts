import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';

import { TableSubtitleComponent } from './table-subtitle.component';
import { TranslateService } from '@ngx-translate/core';

describe('TableSubtitleComponent', () => {
  let component: TableSubtitleComponent;
  let fixture: ComponentFixture<TableSubtitleComponent>;
  let translateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSubtitleComponent ],
      imports: [
        TranslateModuleMock
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSubtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    translateService = spyOn(component.translateService, 'instant');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set result count with 0 items by default', () => {
    // WHEN
    component.ngOnInit();

    // THEN
    expect(translateService).toHaveBeenCalledTimes(1); // Selection count not called
    expect(translateService).toHaveBeenCalledWith('table.SEARCH_RESULT', { currentPages: 0, total: 0 });
  });

  it('should set result to displayed items and total', () => {
    // GIVEN
    component.itemsCount = 15;
    component.itemsPerPage = 10;
    component.currentPage = 2;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(translateService).toHaveBeenCalledTimes(1); // Selection count not called
    expect(translateService).toHaveBeenCalledWith('table.SEARCH_RESULT', { currentPages: '11 - 15', total: 15 });
  });

  it('should set selection count if selected items > 0', () => {
    // GIVEN
    component.itemsCount = 5;
    component.itemsPerPage = 10;
    component.currentPage = 1;
    component.selectedItemsCount = 2;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(translateService).toHaveBeenCalledTimes(2); // Selection count not called
    expect(translateService).toHaveBeenCalledWith('table.SEARCH_RESULT', { currentPages: '1 - 5', total: 5 });
    expect(translateService).toHaveBeenCalledWith('table.SELECTION_COUNT', { selectionCount: 2 });
  });

  it('should set clear border to solid on mouse over', () => {
    // GIVEN
    component.clearBorder = '1px';

    // WHEN
    component.onMouseOverClear();

    // THEN
    expect(component.clearBorder).toBe('1px solid');
  });

  it('should set clear border to dashed on mouse out', () => {
    // GIVEN
    component.clearBorder = '1px';

    // WHEN
    component.onMouseOutClear();

    // THEN
    expect(component.clearBorder).toBe('1px dashed');
  });

  it('should send clearClicked event onClearClick', () => {
    // GIVEN
    const emitEvent = spyOn(component.clearClicked, 'emit');

    // WHEN
    component.onClearClick();

    // THEN
    expect(emitEvent).toHaveBeenCalled();
  });
});
