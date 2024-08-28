import { ActionListModule, ConfirmationDialogModule, ContentLayoutModule, EdsIconModule, InfoPopupModule, SideMenuListV2Module } from '@erad/components';

import { AppItemActionsModule } from '../shared-components/app-item-actions/app-item-actions.module';
import { AppItemTableViewModule } from 'src/app/components/app-item-table-view/app-item-table-view.module';
import { ApplicationInformationDetailsModule } from '../application-information-details/application-information-details.module';
import { CommonModule } from '@angular/common';
import { CreateJobComponentModule } from 'src/app/components/create-job/create-job.component.module';
import { GeneralInformationMainPanelModule } from 'src/app/components/general-information-main-panel/general-information-main-panel.component.module';
import { JobDefinitionDropdownModule } from 'src/app/components/job-definition-dropdown/job-definition-dropdown.module';
import { JobDetailsModule } from '../job-detail/job-details.module';
import { JobListColumnViewModule } from 'src/app/components/jobs-list-column-view/jobs-list-column-view.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MainMenuLeftPanelDataPipe } from '../shared-components/main-menu-left-panel/pipes/main-menu-left-panel-data.pipe';
import { AppJobsTableComponent } from './app-jobs-table.component';
import { AppJobsTableRoutingModule } from './app-jobs-table-routing.module';
import { DnRMainMenuLeftPanelModule } from '../shared-components/main-menu-left-panel/main-menu-left-panel.module';
import { JobDetailsColumnContainerComponentModule } from 'src/app/components/job-details-column-container/job-details-column-container.component.module';

@NgModule({
  declarations: [AppJobsTableComponent],
  exports: [AppJobsTableComponent],
  imports: [
    CommonModule,
    AppJobsTableRoutingModule,
    DnRMainMenuLeftPanelModule,
    SideMenuListV2Module,
    AppItemActionsModule,
    EdsIconModule,
    ContentLayoutModule,
    ActionListModule,
    ApplicationInformationDetailsModule,
    TranslateModule.forChild(),
    JobListColumnViewModule,
    CreateJobComponentModule,
    AppItemTableViewModule,
    JobDetailsColumnContainerComponentModule,
    JobDetailsModule,
    InfoPopupModule,
    JobDefinitionDropdownModule,
    GeneralInformationMainPanelModule,
    ConfirmationDialogModule
  ],
  providers: [MainMenuLeftPanelDataPipe]
})
export class AppJobsTableModule {}
