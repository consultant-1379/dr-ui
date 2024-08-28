import { NgModule } from '@angular/core';
import { config } from './app.module.config';

@NgModule({
  declarations: config.declarations,
  exports: config.exports,
  imports: config.imports,
  providers: config.providers,
  schemas: config.schemas,
  bootstrap: config.bootstrap,
})
export class AppModule {}
