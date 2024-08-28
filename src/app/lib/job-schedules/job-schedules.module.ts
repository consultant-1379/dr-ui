import { NgModule } from '@angular/core';
import { config } from './job-schedules.module.config';

@NgModule({
  declarations: config.declarations,
  exports: config.exports,
  imports: config.imports,
  providers: config.providers,
  schemas: config.schemas
})
export class JobSchedulesModule { }
