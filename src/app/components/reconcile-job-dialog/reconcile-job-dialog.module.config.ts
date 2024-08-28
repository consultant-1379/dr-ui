import { DropdownModule, LoaderModule } from '@erad/components';

import { ButtonModule } from '@erad/components/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicInputsDisplayModule } from '../dynamic-inputs-display/dynamic-inputs-display.module';
import { FeaturePackDetailsFacadeService } from 'src/app/lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { InfoMessageComponentModule } from '../info-message/info-message.component.module';
import { LoaderAnimationModule } from '@erad/components/loader-animation';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModuleConfiguration } from '@erad/core';
import { ReconcileJobDialogComponent } from './reconcile-job-dialog.component';
import { TextInputModule } from '@erad/components/text-input';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    ReconcileJobDialogComponent,
  ],
  exports: [
    ReconcileJobDialogComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    DropdownModule,
    DynamicInputsDisplayModule,
    InfoMessageComponentModule,
    LoaderAnimationModule,
    LoaderModule,
    MatTooltipModule,
    TextInputModule,
    TranslateModule.forChild()
  ],
  providers: [
    FeaturePackDetailsFacadeService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};