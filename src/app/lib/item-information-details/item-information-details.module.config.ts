import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CollapsibleItemModule } from '@erad/components/collapsible-item';
import { CommonModule } from '@angular/common';
import { CopyDownloadModule } from 'src/app/components/copy-download/copy-download.module';
import { ItemInformationDetailsComponent } from './item-information-details.component';

export const config = {
  declarations: [
    ItemInformationDetailsComponent
  ],
  exports: [
    ItemInformationDetailsComponent
  ],
  imports: [
    CommonModule,
    CopyDownloadModule,
    CollapsibleItemModule,
    TranslateModule.forChild(),
  ],
  providers: [TranslateService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
