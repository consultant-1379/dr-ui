import { InputConfigsReducer, inputConfigsKey } from './store/input-configurations.reducer';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { InputConfigsEffects } from './store/input-configurations.effects';
import { LoaderAnimationModule } from '@erad/components/loader-animation';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

export const config = {
  declarations: [],
  imports: [
    CommonModule,
    CommonModule,
    TranslateModule.forChild(),
    LoaderAnimationModule,
    StoreModule.forFeature(inputConfigsKey, InputConfigsReducer),
    EffectsModule.forFeature([InputConfigsEffects])
  ],
  exports: [],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
