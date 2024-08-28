import { NgModule } from '@angular/core';

import { config } from './tab-navigation.module.config';

@NgModule({
  declarations: config.declarations,
  exports: config.exports,
  imports: config.imports,
  providers: config.providers,
  schemas: config.schemas
})
export class TabNavigationModule { }
