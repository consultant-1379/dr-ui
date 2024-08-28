import { jobDetailsFeatureKey, jobDetailsReducer } from './store/job-details.reducer';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { GeneralInformationMainPanelModule } from 'src/app/components/general-information-main-panel/general-information-main-panel.component.module';
import { JobDetailColumnViewComponent } from '../../components/job-detail-column-view/job-detail-column-view.component';
import { JobDetailsEffects } from './store/job-details.effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

export const config = {
  declarations: [JobDetailColumnViewComponent], // TODO eeibky JobDetailsColumnContainerComponent here?
  imports: [
    CommonModule,
    GeneralInformationMainPanelModule,
    TranslateModule,
    StoreModule.forFeature(jobDetailsFeatureKey, jobDetailsReducer),
    EffectsModule.forFeature([JobDetailsEffects])
  ],
  exports: [
    JobDetailColumnViewComponent
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
