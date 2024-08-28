import { ActionListModule, EdsIconModule, InfoPopupModule, TabsModule } from '@erad/components';

import { CollapsibleItemModule } from '@erad/components/collapsible-item';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { TabNavigationComponent } from './tab-navigation.component';
import { TranslateModule } from '@ngx-translate/core';

export const config = {
  declarations: [
    TabNavigationComponent
  ],
  exports: [
    TabNavigationComponent
  ],
  imports: [
    CommonModule,
    CollapsibleItemModule,
    TranslateModule.forChild(),
    TabsModule,
    MatRippleModule,
    EdsIconModule,
    InfoPopupModule,
    ActionListModule
  ],
  providers: [],
  schemas: []
};
