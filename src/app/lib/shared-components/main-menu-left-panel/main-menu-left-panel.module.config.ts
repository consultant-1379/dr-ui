import { SideMenuListV2Module } from '@erad/components';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DnRMainMenuLeftPanelComponent } from './main-menu-left-panel.component';

export const config = {
  declarations: [
    DnRMainMenuLeftPanelComponent
  ],
  exports: [
    DnRMainMenuLeftPanelComponent
  ],
  imports: [
    CommonModule,
    SideMenuListV2Module,
    TranslateModule.forChild(),
  ],
  providers: [],
  schemas: []
};
