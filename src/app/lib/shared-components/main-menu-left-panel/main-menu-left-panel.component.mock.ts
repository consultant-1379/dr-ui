import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListInfoItem } from 'src/app/models';

@Component({
  selector: 'dnr-main-menu-left-panel',
  template: '<div>DnRMainMenuLeftPanelComponentMock</div>'
})
export class DnRMainMenuLeftPanelComponentMock {
  @Output() selectedItem = new EventEmitter<ListInfoItem>();
  @Output() closeButtonClicked = new EventEmitter<void>();
  @Input() selected: string;
  @Input() listType: string;
  @Input() mainMenuLeftPanelOpen: boolean;
}
