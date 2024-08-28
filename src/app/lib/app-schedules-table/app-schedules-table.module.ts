import { ActionListModule, ConfirmationDialogModule, ContentLayoutModule, EdsIconModule, InfoPopupModule, SideMenuListV2Module } from '@erad/components';

import { AppItemActionsModule } from '../shared-components/app-item-actions/app-item-actions.module';
import { AppItemTableViewModule } from 'src/app/components/app-item-table-view/app-item-table-view.module';
import { AppSchedulesTableComponent } from './app-schedules-table.component';
import { AppSchedulesTableRoutingModule } from './app-schedules-table-routing.module';
import { CommonModule } from '@angular/common';
import { CreateScheduleComponentModule } from 'src/app/components/create-schedule/create-schedule.component.module';
import { DnRMainMenuLeftPanelModule } from '../shared-components/main-menu-left-panel/main-menu-left-panel.module';
import { ItemInformationDetailsModule } from '../item-information-details/item-information-details.module';
import { JobScheduleDetailsModule } from '../job-schedule-details/job-schedule-details.module';
import { JobSchedulesModule } from '../job-schedules/job-schedules.module';
import { MainMenuLeftPanelDataPipe } from '../shared-components/main-menu-left-panel/pipes/main-menu-left-panel-data.pipe';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { JobDetailsModule } from '../job-detail/job-details.module';
import { JobDetailsColumnContainerComponentModule } from 'src/app/components/job-details-column-container/job-details-column-container.component.module';

@NgModule({
  declarations: [
    AppSchedulesTableComponent
  ],
  exports: [],
  imports: [
    ActionListModule,
    AppItemActionsModule,
    AppItemTableViewModule,
    AppSchedulesTableRoutingModule,
    CommonModule,
    ConfirmationDialogModule,
    ContentLayoutModule,
    CreateScheduleComponentModule,
    DnRMainMenuLeftPanelModule,
    EdsIconModule,
    JobDetailsModule,
    JobSchedulesModule,
    JobScheduleDetailsModule,
    JobDetailsColumnContainerComponentModule,
    InfoPopupModule,
    ItemInformationDetailsModule,
    SideMenuListV2Module,
    TranslateModule.forChild(),
  ],
  providers: [MainMenuLeftPanelDataPipe]
})
export class AppSchedulesTableModule {}
