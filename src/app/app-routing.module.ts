import { RouterModule, Routes } from '@angular/router';

import { EmptyComponent } from './components/empty/empty.component';
import { LogoutRedirectGuard } from './logout-redirect-guard';
import { NgModule } from '@angular/core';
import { RoutingPathContent } from './enums/routing-path-content.enum';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `/${RoutingPathContent.FeaturePacks}`,
  },
  {
    path: RoutingPathContent.LogoutRedirect,
    component: EmptyComponent,
    canActivate: [LogoutRedirectGuard],
  },
  {
    path: RoutingPathContent.FeaturePacks,
    loadChildren: () => import('./lib/app-feature-packs-table/app-feature-packs-table.module').then(m => m.AppFeaturePacksTableModule
    )
  },
  {
    path: RoutingPathContent.JobsTable,
    loadChildren: () => import('./lib/app-jobs-table/app-jobs-table.module').then(m => m.AppJobsTableModule)
  },
  {
    path: RoutingPathContent.SchedulesTable,
    loadChildren: () => import('./lib/app-schedules-table/app-schedules-table.module').then(m => m.AppSchedulesTableModule)
  },
  {
    path: RoutingPathContent.FeaturePackDetail,
    loadChildren: () => import('./lib/app-feature-pack-detail-view/app-feature-pack-detail-view.module').then(m => m.AppFeaturePackDetailViewModule)
  },
  {
    path: RoutingPathContent.JobDetail,
    loadChildren: () => import('./lib/app-job-detail-view/app-job-detail-view.module').then(m => m.AppJobDetailViewModule)
  },
  {
    path: '**',
    redirectTo: `/${RoutingPathContent.FeaturePacks}`
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
