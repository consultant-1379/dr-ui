import { RouterModule /* Routes */ } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppJobsTableRoutes } from './app-jobs-table.routes';

@NgModule({
  imports: [RouterModule.forChild(AppJobsTableRoutes)],
  exports: [RouterModule],
})
export class AppJobsTableRoutingModule {}
