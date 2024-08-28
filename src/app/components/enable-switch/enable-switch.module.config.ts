import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnableSwitchComponent } from './enable-switch.component';
import { ModuleConfiguration } from '@erad/core';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    EnableSwitchComponent
  ],
  exports: [
    EnableSwitchComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  providers: [,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};