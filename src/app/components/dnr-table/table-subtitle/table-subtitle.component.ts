import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dnr-table-subtitle',
  templateUrl: './table-subtitle.component.html',
})
export class TableSubtitleComponent implements OnInit {
  @Input() itemsCount: number = 0
  @Input() itemsPerPage: number = 0
  @Input() currentPage: number = 0;
  @Input() selectedItemsCount = 0;

  @Output() clearClicked = new EventEmitter();

  countText: string;
  selectionText: string;

  clearBorder = '1px dashed';

  constructor(
    readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.countText = this._createCountText();
    this.selectionText = this._createSelectionText();
  }

  _createCountText() {
    const total = this.itemsCount || 0;

    const start = this.itemsCount > 0
      ? (this.currentPage - 1) * this.itemsPerPage + 1
      : 0;

    const end = Math.min(
      this.currentPage * this.itemsPerPage,
      total
    ) || 0;

    const result = start === 0 && end === 0
      ? 0
      : `${start} - ${end}`;

    return this.translateService.instant(
      'table.SEARCH_RESULT',
      {
        currentPages: result,
        total
      }
    );
  }

  _createSelectionText() {
    return (this.selectedItemsCount > 0)
      ? this.translateService.instant(
        'table.SELECTION_COUNT',
        { selectionCount: this.selectedItemsCount })
      : '';
  }

  onClearClick(): void {
    this.clearClicked.emit();
  }

  onMouseOverClear() {
    this.clearBorder = '1px solid';
  }

  onMouseOutClear() {
    this.clearBorder = '1px dashed';
  }
}