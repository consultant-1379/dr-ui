import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CollapsibleItem } from '@erad/components/collapsible-item';
import { TranslateService } from '@ngx-translate/core';
import { AccordionItemType } from './accordion-item-type.enum';

/*
 * Component represents the details of an item's information of both entity feature and Job
 *
 * This component includes functionalities for retrieving selected and expandable items,
 * handling user interactions, and emitting events on link away (navigation back to entity from right panel)
 *
 * Accordion headers (e.g. General Information) can be blue on selection when this component
 * if highlightAccordionHeaders set (e.g. Feature pack details page for left panel), or
 * can remain with the default white background when this component is used for details info in the right panel.
*/
@Component({
  selector: 'dnr-item-information-details',
  templateUrl: './item-information-details.component.html',
  styleUrls: ['item-information-details.component.scss'],
})
export class ItemInformationDetailsComponent implements OnInit, OnChanges {
  @Input() selectableItems: CollapsibleItem[] = [];

  @Input() copyObject?: object;
  @Input() downloadURL?: string;
  @Input() itemName?: string;
  // If set, then put the background to blue on accordion header selection
  @Input() highlightAccordionHeaders: boolean = false;

  @Output() linkAwayClick = new EventEmitter<string>();
  @Output() accordionHeaderClick = new EventEmitter<string>();

  accordionItemTypes: Record<string, string> = AccordionItemType;
  copyDownloadIconColor: string = '';

  constructor(
    readonly activatedRoute: ActivatedRoute,
    readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const linkAwaySection = this.activatedRoute.snapshot.queryParams?.linkAwaySection;
    if (linkAwaySection) {
      this._setInitialSelection(linkAwaySection);
    }
  }

  ngOnChanges() {
    this.accordionItemTypes = this._getAccordionItemTypes();
    this.selectableItems = this._translateSelectableItems(this.selectableItems);

    this._setCopyDownLoadIconColor();
  }

  onLaunchIconClicked(item): void {
    this.selectableItems[0].expanded = true;
    this.selectableItems[0].selected = false;
    this.linkAwayClick.emit(item.id);
  }

  onAccordionHeaderClicked(_expand, _item: CollapsibleItem): void {
    if (this.highlightAccordionHeaders) {
      this._setHighlightedSelection(_item.id);
    }
    this._setCopyDownLoadIconColor();
    this.accordionHeaderClick.emit(_item.id);
  }

  /**
   * if highlightAccordionHeader set, then highlight Accordion by setting selected = true.
   * @param selectedId
   */
  private _setHighlightedSelection(selectedId) {
    const selectedIndex = this.selectableItems.findIndex(item => item.id === selectedId);
      const topAccordionPreviouslySelected = this.selectableItems[0].selected;
      this.selectableItems.forEach((item, index) => {
        item.selected = (index === selectedIndex);
      });

      if (this._keepTopAccordionOpen(topAccordionPreviouslySelected, selectedIndex)) {
        this.selectableItems[0].expanded = true;
      }
  }

  /**
   * Keep the top open if highlighting headers and if top accordion NOT selected.
   * I.e. General Information (the top accordion) is always open if another accordion selected.
   *
   * Note that you CAN close the top accordion if it was previously selected.
   * So first selection of top accordion will ALWAYS open it, the second will close it.
   *
   * @param topAccordionPreviouslySelected
   */
  private _keepTopAccordionOpen(topAccordionPreviouslySelected: boolean, selectedIndex: number): boolean {
    return (!topAccordionPreviouslySelected || selectedIndex > 0);
  }

  /**
   * If highlighting Accordion Headers set, then header will change color from
   * white to blue so the copy/paste icon will need to change to a white
   * from black (as black on blue is not very visible).
   */
  private _setCopyDownLoadIconColor(): void {
    this.copyDownloadIconColor = '';
    if (this.highlightAccordionHeaders
        && this.selectableItems.some(item => (item.selected && item.id === "GENERAL_INFORMATION"))) {
      this.copyDownloadIconColor = 'white';
    }
  }

  private _setInitialSelection(value) {
    const selectedIndex = this.selectableItems.findIndex(item => item.id === value);
    this.selectableItems.forEach((item, index) => {
      item.selected = index === selectedIndex;
    });
    if (this.selectableItems.length > 0) {
      this.selectableItems[0].expanded = true;
    }
  }

  private _getAccordionItemTypes(): Record<string, string> {
    const result = {};
    const types = Object.keys(AccordionItemType);
    types.forEach(type => {
      result[type] = this.translateService.instant(this.accordionItemTypes[type]);
    })
    return result;
  }

  private _translateSelectableItems(items: CollapsibleItem[] = []): CollapsibleItem[] {
    return items.map((item) => ({
      ...item,
      title: this.translateService.instant(item.title),
    }));
}
}
