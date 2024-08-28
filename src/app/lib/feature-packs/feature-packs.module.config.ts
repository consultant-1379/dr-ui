import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { featurePacksFeatureKey, featurePacksReducer } from './store/feature-packs.reducer';
import { FeaturePackEffects } from './store/feature-packs.effects';

export const config = {
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(featurePacksFeatureKey, featurePacksReducer),
    EffectsModule.forFeature([FeaturePackEffects]),
  ],
  exports: [
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
