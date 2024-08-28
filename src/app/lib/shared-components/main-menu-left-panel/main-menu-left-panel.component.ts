import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListInfoItem, ListInfoData } from 'src/app/models';
import { TranslateService } from '@ngx-translate/core';

import { MainMenuLeftPanelDataPipe } from './pipes/main-menu-left-panel-data.pipe';
import { RoutingPathContent } from 'src/app/enums/routing-path-content.enum';
import { Router } from '@angular/router';
import { ListType } from 'src/app/enums/entity-type.enum';

/**
 * This creates the left hand navigation menu and sends an event when selection
 * changes.
 */
@Component({
  selector: 'dnr-main-menu-left-panel',
  templateUrl: './main-menu-left-panel.component.html',
  styleUrls: ['./main-menu-left-panel.component.scss'],
})
export class DnRMainMenuLeftPanelComponent implements OnInit {
  @Input() selected: string;
  @Input() listType: string = ListType.MENU;
  @Output() itemSelected = new EventEmitter<ListInfoItem>();
  @Output() closeButtonClicked = new EventEmitter<void>();
  @Output() activeListChanged = new EventEmitter<any>();

  items: ListInfoData;
  selectedItem?: ListInfoItem;
  localizedListType: string;

  data: ListInfoData = {
    "navigation.MENU": {
      "items": [
        {
          "value": "FeaturePacks",
          "selected": true,
          "label": "navigation.FEATURE_PACKS",
          "route": RoutingPathContent.FeaturePacks
        },
        {
          "value": "Jobs",
          "label": "navigation.JOBS",
          "route": RoutingPathContent.JobsTable,
        },
        {
          "value": "Schedules",
          "label": "navigation.SCHEDULES",
          "route": RoutingPathContent.SchedulesTable,
        }
      ],
      "selected": true
    }
  }

  constructor(
    readonly router: Router,
    readonly translateService: TranslateService,
    readonly dataPipe: MainMenuLeftPanelDataPipe) { }

  ngOnInit(): void {
    this.items = this.dataPipe.transform(this.data);
    if (this.listType) {
      this.localizedListType = this.translateService.instant(this.listType);
      this.setCurrentListType();
    }
    const _selectedItem = this.selected ? this.getSelectedItemFromPath() : this.getSelectedItem();

    if (_selectedItem) {
      this.onSelection(_selectedItem);
    }
  }

  onEnterPressed() {
    this.itemSelected.emit(this.selectedItem);
  }

  onSelection(item?: ListInfoItem) {
    this.selectedItem = item;
    this.itemSelected.emit(item);
    if (item.route) {
      this.router.navigateByUrl(item.route);
    }
  }

  onCloseButtonClicked() {
    this.closeButtonClicked.emit();
  }

  onActiveListChanged(list: any) {
    this.activeListChanged.emit(list);
  }

  private getSelectedItem(): ListInfoItem | undefined {
    const itemKeys = Object.keys(this.items);
    for (const itemKey of itemKeys) {
      if (this.items[itemKey].selected) {
        return this.items[itemKey].items.find((i) => i.selected);
      }
    }
    return null;
  }

  private getSelectedItemFromPath(): ListInfoItem | undefined {
    const itemKeys = Object.keys(this.items);
    for (const itemKey of itemKeys) {
      if (itemKey === this.localizedListType) {
        if (this.items[itemKey]) {
          this.items[itemKey].items.forEach((i) => (i.selected = false));
          this.items[itemKey].items.find((i) => i.value === this.selected).selected = true;
          return this.items[itemKey].items.find((i) => i.selected);
        }
      }
    }
    return null;
  }

  private setCurrentListType() {
    const itemKeys = Object.keys(this.items);
    for (const itemKey of itemKeys) {
      this.items[itemKey].selected = itemKey === this.localizedListType;
    }
  }
}
