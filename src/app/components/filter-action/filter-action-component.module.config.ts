import { CommonModule } from '@angular/common';
import { FilterActionComponent } from './filter-action.component';
import { ModuleConfiguration } from '@erad/core';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [FilterActionComponent],
  exports: [FilterActionComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  providers: [],
  schemas: [],
};
