import { featurePackDetailsFeatureKey, featurePackDetailsReducer } from './store/feature-pack-details.reducer';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { FeaturePackDetailsEffects } from './store/feature-pack-details.effects';
import { StoreModule } from '@ngrx/store';

export const config = {
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(featurePackDetailsFeatureKey, featurePackDetailsReducer),
    EffectsModule.forFeature([FeaturePackDetailsEffects])
  ],
  exports: [
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
