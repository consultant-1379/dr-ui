import { DiscoveredObjectsTableComponent } from 'src/app/components/discovered-objects-table/discovered-objects-table.component';
import { DnrTableModule } from 'src/app/components/dnr-table/dnr-table.module';
import { EdsIconModule } from '@erad/components/eds-icon';
import { ContentLayoutModule } from '@erad/components/content-layout';
import { FeatureLayoutModule } from '@erad/components/feature-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from '@erad/components/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModuleConfiguration } from '@erad/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { discoveredObjectsFeatureKey, discoveredObjectsReducer } from './store/discovered-objects.reducer';
import { DiscoveredObjectsContainerComponent } from './containers/discovered-objects-container.component';
import { DiscoveredObjectsEffects } from './store/discovered-objects.effects';
import { ReconcileJobDialogModule } from 'src/app/components/reconcile-job-dialog/reconcile-job-dialog.module';
import { FailureDisplayDialogModule } from 'src/app/components/failure-display-dialog/failure-display-dialog.module';
import { InfoMessageComponentModule } from 'src/app/components/info-message/info-message.component.module';

export const config : ModuleConfiguration= {
  declarations: [
    DiscoveredObjectsContainerComponent,
    DiscoveredObjectsTableComponent,
  ],
  exports: [
    DiscoveredObjectsContainerComponent,
  ],
  imports: [
    ButtonModule,
    ContentLayoutModule,
    CommonModule,
    DnrTableModule,
    FeatureLayoutModule,
    InfoMessageComponentModule,
    SharedModule,
    EdsIconModule,
    FailureDisplayDialogModule,
    TranslateModule.forChild(),
    StoreModule.forFeature(discoveredObjectsFeatureKey, discoveredObjectsReducer),
    EffectsModule.forFeature([DiscoveredObjectsEffects]),
    ReconcileJobDialogModule,
    RouterModule.forChild([
      {
        path: '',
        component: DiscoveredObjectsContainerComponent
      },
      {
        path: ':jobId',
        component: DiscoveredObjectsContainerComponent
      }
    ]),
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
