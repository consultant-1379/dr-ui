import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AppConstants } from 'src/app/constants';
import { DateUtilsService } from 'src/app/services/date-utils.service';
import { InformationItemModel } from 'src/app/models/information-item.model';
import { informationItems } from './general-information-main-panel.component.data.mock';

/**
 * Shows information in a format for panels
 * Supporting hyperlinks and embedded components (e.g. enable-switch)
 */
@Component({
  selector: 'dnr-general-information-main-panel',
  templateUrl: './general-information-main-panel.component.html',
  styleUrls: ['./general-information-main-panel.component.scss'],
})
export class GeneralInformationMainPanelComponent {
  /**
   * Key-value pairs (and any extra required meta data for item) to display
   */
  @Input() informationItems: InformationItemModel[] = informationItems;

  /**
   * Event emitted from any hyperlink added via InformationItemModel
   */
  @Output() hyperlinkClicked = new EventEmitter<InformationItemModel>();

  /**
   * Event emitted from any component added via InformationItemModel
   * (emits value passed from component and a reference
   * to the InformationItemModel that emitted the event - to support multiple components in same panel)
   */
  @Output() componentEvent = new EventEmitter<{ value: any, informationItem: InformationItemModel }>();

  displayedColumns: string[] = ['label', 'value'];

  constructor(
    readonly dateUtils: DateUtilsService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this._addHoverColorChange(document.querySelectorAll('eui-icon.tooltip-icon'));
    }, 500);
  }

  _addHoverColorChange(elements) {
    [...elements].forEach((element) => {
      element.addEventListener('mouseenter', () => {
        element.color = AppConstants.colors.blue;
      });
      element.addEventListener('mouseleave', () => {
        element.color = AppConstants.colors.black;
      })
    });
  }

  /**
   * Handle click event on hyperlink in panel
   * @param informationItem information item clicked
   */
  onClickHandler(informationItem: InformationItemModel) {
    this.hyperlinkClicked.emit(informationItem);
  }


  /**
   * Handle event fired from embedded component in this panel
   * (see InformationItemModel.componentSelectorName)
   *
   * @param $event          event emitted from embedded component information item
   * @param informationItem item that emitted the event (to be useful if multiple components in panel)
   */
  onComponentEvent($event: any, informationItem: InformationItemModel) {
    this.componentEvent.emit({ value: $event, informationItem: informationItem });
  }

  /**
   * format display value - for example to present date in same
   * readable format as is displayed in tables
   */
  formatValue(item: InformationItemModel) {
    if (typeof item?.value !== 'undefined' && item.value !== '') {

      if (item.isDate) {
        return this.dateUtils.dateTimeFormat(item.value);
      }
      return item.value;
    }
    return AppConstants.undefinedDisplayValue;
  }

  /**
   * UX wanting bold text in this circumstance,
   * e.g wants overall Error Display text to be bold
   * in Object details flyout panel
   *
   * Returns true if the item should be bold
   */
  shouldBeBoldCssClass(item: InformationItemModel): boolean {
    return !!item?.value && item.isBold;
  }
}
