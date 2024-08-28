import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app-feature-pack-detail-view.routes';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppFeaturePackDetailViewRoutingModule { }
