import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CopyDownloadComponent } from './copy-download.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CopyDownloadComponent
  ],
  exports: [
    CopyDownloadComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CopyDownloadModule { }
