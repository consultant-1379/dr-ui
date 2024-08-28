import { ButtonModule } from '@erad/components/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailureDisplayDialogComponent } from './failure-display-dialog.component';
import { FailureDisplayModule } from '../failure-display/failure-display.module';
import { ModuleConfiguration } from '@erad/core';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    FailureDisplayDialogComponent,
  ],
  exports: [
    FailureDisplayDialogComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    FailureDisplayModule,
    TranslateModule.forChild()
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
