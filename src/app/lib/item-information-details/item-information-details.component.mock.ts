import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dnr-item-information-details',
  template: '<div>ItemInformationDetailsComponentMock</div>'
})

export class ItemInformationDetailsComponentMock {
  @Input() name?: string;
  @Input() description: string;
  @Input() discoveredObjectsCount?: number;
  @Input() reconciledObjectsCount?: number;
  @Input() applicationName: string;
  @Input() applicationId: string;
  @Input() applicationDescription: string;
  @Input() categories = {};
  @Input() selectableItems = {};
  @Input() expandableItems = {};
  @Input() selectableItemsPresent = false;
  @Input() expandableItemsExpandedIndex = null;
  @Input() selectableItemsSelectedIndex = null;
  @Input() loadingBordered: boolean;
  @Input() isLoading = false;

  @Output() expandedItemClick = new EventEmitter<void>();
  @Output() linkAwayClick = new EventEmitter<{ index: number, id: string }>();
  @Output() accordionHeaderClick = new EventEmitter<{ index: number, id: string }>();
}
