import { CommonModule } from '@angular/common';
import { DropdownModule } from '@erad/components';
import { FeaturePackDetailsFacadeService } from 'src/app/lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { JobDefinitionDropdownComponent } from './job-definition-dropdown.component';
import { LoaderAnimationModule } from '@erad/components/loader-animation';
import { ModuleConfiguration } from '@erad/core';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    JobDefinitionDropdownComponent,
  ],
  exports: [
    JobDefinitionDropdownComponent,
  ],
  imports: [
    CommonModule,
    LoaderAnimationModule,
    DropdownModule,
    TranslateModule.forChild()
  ],
  providers: [
    FeaturePackDetailsFacadeService,
  ],
  schemas: []
};
