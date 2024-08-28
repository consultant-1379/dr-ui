import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FailureDisplayComponent } from './failure-display.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
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
})
// TODO if put everything back into the .module.ts file, then why is this class being kept?
export class FailureDisplayModule { }