import { ActionListModule, InfoPopupModule } from '@erad/components';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppItemActionsComponent } from './app-item-actions.component';

@NgModule({
  declarations: [
    AppItemActionsComponent
  ],
  imports: [
    ActionListModule,
    InfoPopupModule,
    TranslateModule,
    CommonModule
  ],
  exports: [
    AppItemActionsComponent
  ]
})
export class AppItemActionsModule { }
