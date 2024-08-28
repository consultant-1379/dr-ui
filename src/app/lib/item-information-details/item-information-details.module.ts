import { NgModule } from '@angular/core';

import { config } from './item-information-details.module.config';

@NgModule({
  declarations: config.declarations,
  exports: config.exports,
  imports: config.imports,
  providers: config.providers,
  schemas: config.schemas
})
export class ItemInformationDetailsModule { }
