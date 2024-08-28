import { ButtonModule } from '@erad/components/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteScheduleConfirmDialogComponent } from './delete-schedule-confirm-dialog.component';
import { ModuleConfiguration } from '@erad/core';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    DeleteScheduleConfirmDialogComponent,
  ],
  exports: [
    DeleteScheduleConfirmDialogComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    TranslateModule.forChild(),
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
