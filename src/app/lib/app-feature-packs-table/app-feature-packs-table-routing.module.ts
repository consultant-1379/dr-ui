import { RouterModule /* Routes */ } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppFeaturePacksTableRoutes } from './app-feature-packs-table.routes';

@NgModule({
  imports: [RouterModule.forChild(AppFeaturePacksTableRoutes)],
  exports: [RouterModule],
})
export class AppFeaturePacksTableRoutingModule {}
