import { ActionListModule, InfoPopupModule } from '@erad/components';
import { MenuToggleContainerModuleMock, ModuleConfiguration, internalException } from '@erad/core';

import { AppFeaturePackDetailViewRoutingModule } from './app-feature-pack-detail-view-routing.module';
import { ApplicationInformationDetailsModule } from '../application-information-details/application-information-details.module';
import { ApplicationsCardViewModule } from 'src/app/components/applications-card-view/applications-card-view.component.module';
import { BreadcrumbModule } from '@erad/components/breadcrumb';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLayoutModule } from '@erad/components/content-layout';
import { CreateJobComponentModule } from 'src/app/components/create-job/create-job.component.module';
import { EdsIconModule } from '@erad/components/eds-icon';
import { EffectsHelperModule } from '@erad/smart-components/effects-helper';
import { FeatureLayoutModule } from '@erad/components/feature-layout';
import { FeaturePackDetailViewContainerComponent } from './containers/feature-pack-detail-view-container/feature-pack-detail-view-container.component';
import { GeneralInformationMainPanelModule } from 'src/app/components/general-information-main-panel/general-information-main-panel.component.module';
import { ItemInformationDetailsModule } from '../item-information-details/item-information-details.module';
import { JobDetailsModule } from '../job-detail/job-details.module';
import { JobListColumnViewModule } from 'src/app/components/jobs-list-column-view/jobs-list-column-view.module';
import { LoaderAnimationModule } from '@erad/components/loader-animation';
import { SearchBarModule } from '@erad/components/search-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabNavigationModule } from '../shared-components/tab-navigation/tab-navigation.module';
import { ToolbarModule } from '@erad/components/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { JobDetailsColumnContainerComponentModule } from 'src/app/components/job-details-column-container/job-details-column-container.component.module';

export const config: ModuleConfiguration = {
  declarations: [FeaturePackDetailViewContainerComponent],
  exports: [FeaturePackDetailViewContainerComponent],
  imports: [
    CommonModule,
    LoaderAnimationModule,
    AppFeaturePackDetailViewRoutingModule,
    SearchBarModule,
    ContentLayoutModule,
    FeatureLayoutModule,
    ToolbarModule,
    EdsIconModule,
    ActionListModule,
    BreadcrumbModule,
    ApplicationInformationDetailsModule,
    MenuToggleContainerModuleMock,
    SharedModule,
    ItemInformationDetailsModule,
    GeneralInformationMainPanelModule,
    ApplicationsCardViewModule,
    InfoPopupModule,
    JobListColumnViewModule,
    JobDetailsModule,
    JobDetailsColumnContainerComponentModule,
    CreateJobComponentModule,
    EffectsHelperModule.forRoot({
      internalException,
      shoppingCartErrorTitle: 'ERROR_TITLE'
    }),

    TranslateModule.forChild(),
    TabNavigationModule
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
