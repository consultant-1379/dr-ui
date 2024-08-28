import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailureDisplayComponent } from './failure-display.component';
import { ModuleConfiguration } from '@erad/core';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    FailureDisplayComponent,
  ],
  exports: [
    FailureDisplayComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
