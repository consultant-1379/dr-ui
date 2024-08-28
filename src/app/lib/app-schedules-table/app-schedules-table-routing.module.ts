import { RouterModule /* Routes */ } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppSchedulesTableComponent } from './app-schedules-table.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: AppSchedulesTableComponent,
    },
  ])],
  exports: [RouterModule],
})
export class AppSchedulesTableRoutingModule {}
