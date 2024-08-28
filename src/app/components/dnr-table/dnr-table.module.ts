import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FailureDisplayModule } from '../failure-display/failure-display.module';
import { DnrTableComponent } from './dnr-table.component';
import { LoaderAnimationModule } from '@erad/components/loader-animation';
import { TableSubtitleComponent } from './table-subtitle/table-subtitle.component';

@NgModule({
  declarations: [
    DnrTableComponent,
    TableSubtitleComponent,
  ],
  exports: [
    DnrTableComponent,
  ],
  imports: [
    CommonModule,
    LoaderAnimationModule,
    FailureDisplayModule,
    TranslateModule.forChild()
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DnrTableModule { }