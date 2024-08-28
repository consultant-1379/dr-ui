import { DropdownModule, TextInputModule } from '@erad/components';

import { CommonModule } from '@angular/common';
import { DynamicInputsDisplayComponent } from './dynamic-inputs-display.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DynamicInputsDisplayComponent],
  exports: [
    DynamicInputsDisplayComponent,
  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    MatInputModule,
    MatTooltipModule,
    TextInputModule,
    TranslateModule.forChild()
  ]
})
export class DynamicInputsDisplayModule { }
