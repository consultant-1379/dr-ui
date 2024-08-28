import { ButtonModule } from '@erad/components/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturePackDetailsFacadeService } from 'src/app/lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { FileUploadModule } from '@erad/components/file-upload';
import { InstallFeaturePackDialogComponent } from './install-feature-pack-dialog.component';
import { LoaderAnimationModule } from '@erad/components/loader-animation';
import { ModuleConfiguration } from '@erad/core';
import { TextInputModule } from '@erad/components/text-input';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    InstallFeaturePackDialogComponent,
  ],
  exports: [
    InstallFeaturePackDialogComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    FileUploadModule,
    LoaderAnimationModule,
    TextInputModule,
    TranslateModule.forChild()
  ],
  providers: [
    FeaturePackDetailsFacadeService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};