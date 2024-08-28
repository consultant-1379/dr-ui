import { MenuToggleContainerModuleMock, ModuleConfiguration, internalException } from '@erad/core';

import { ActionListModule } from '@erad/components';
import { AppJobDetailViewRoutingModule } from './app-job-detail-view-routing.module';
import { ApplicationInformationDetailsModule } from '../application-information-details/application-information-details.module';
import { ApplicationsCardViewModule } from 'src/app/components/applications-card-view/applications-card-view.component.module';
import { BreadcrumbModule } from '@erad/components/breadcrumb';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentLayoutModule } from '@erad/components/content-layout';
import { DiscoveredObjectsModule } from '../discovery-objects/discovered-objects.module';
import { EdsIconModule } from '@erad/components/eds-icon';
import { EffectsHelperModule } from '@erad/smart-components/effects-helper';
import { FeatureLayoutModule } from '@erad/components/feature-layout';
import { FilterActionDetailModule } from 'src/app/components/filter-action/filter-action.component.module';
import { GeneralInformationMainPanelModule } from 'src/app/components/general-information-main-panel/general-information-main-panel.component.module';
import { InfoMessageComponentModule } from 'src/app/components/info-message/info-message.component.module';
import { ItemInformationDetailsModule } from '../item-information-details/item-information-details.module';
import { JobDetailViewContainerComponent } from './containers/app-job-detail-view-container/job-detail-view-container.component';
import { JobDetailsModule } from '../job-detail/job-details.module';
import { LoaderAnimationModule } from '@erad/components/loader-animation';
import { SearchBarModule } from '@erad/components/search-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabNavigationModule } from '../shared-components/tab-navigation/tab-navigation.module';
import { ToolbarModule } from '@erad/components/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { JobInputsModule } from 'src/app/components/job-inputs/job-inputs.component.module';
import { JobDetailsColumnContainerComponentModule } from 'src/app/components/job-details-column-container/job-details-column-container.component.module';

export const config: ModuleConfiguration = {
  declarations: [JobDetailViewContainerComponent],
  exports: [JobDetailViewContainerComponent],
  imports: [
    CommonModule,
    LoaderAnimationModule,
    AppJobDetailViewRoutingModule,
    SearchBarModule,
    ContentLayoutModule,
    FeatureLayoutModule,
    ToolbarModule,
    EdsIconModule,
    ActionListModule,
    FilterActionDetailModule,
    BreadcrumbModule,
    ApplicationInformationDetailsModule,
    MenuToggleContainerModuleMock,
    SharedModule,
    JobInputsModule,
    ItemInformationDetailsModule,
    DiscoveredObjectsModule,
    JobDetailsColumnContainerComponentModule,
    GeneralInformationMainPanelModule,
    ApplicationsCardViewModule,
    InfoMessageComponentModule,
    EffectsHelperModule.forRoot({
      internalException,
      shoppingCartErrorTitle: 'ERROR_TITLE'
    }),
    TranslateModule.forChild(),
    TabNavigationModule,
    JobDetailsModule
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
