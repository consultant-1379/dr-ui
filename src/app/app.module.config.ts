import {
  ApplicationLayoutModule,
  BreadcrumbModule,
  CardModule,
  DatePickerModule,
  EdsIconModule,
  EradErrorIconModule,
  EradSuccessIconModule,
  EradWarningIconModule,
  InfoPopupModule,
  NavigationMenuModule,
  TableModule,
  TabsModule,
  TextInputModule,
  ToolbarModule,
  UserProfileModule,
} from '@erad/components';
import { ConfigModule, MenuToggleModule, ModuleConfiguration, SideDrawerModule } from '@erad/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppSwitcherModule } from '@erad/app-switcher';
import { ApplicationDetailsModule } from './lib/application-detail/application-details.module';
import { ApplicationsModule } from './lib/applications/applications.module';
import { BlackListInterceptorService } from './interceptors/black-list-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyDownloadModule } from './components/copy-download/copy-download.module';
import { CreateJobComponentModule } from './components/create-job/create-job.component.module';
import { CreateJobContainerModule } from './lib/create-job/create-job-container.module';
import { CreateScheduleComponentModule } from './components/create-schedule/create-schedule.component.module';
import { DeleteScheduleConfirmDialogComponentModule } from './components/delete-schedule-confirm-dialog/delete-schedule-confirm-dialog.component.module';
import { DiscoveredObjectsModule } from './lib/discovery-objects/discovered-objects.module';
import { DynamicInputsDisplayModule } from './components/dynamic-inputs-display/dynamic-inputs-display.module';
import { EffectsModule } from '@ngrx/effects';
import { FailureDisplayDialogModule } from './components/failure-display-dialog/failure-display-dialog.module';
import { FailureDisplayModule } from './components/failure-display/failure-display.module';
import { FeaturePackDetailsModule } from './lib/feature-pack-detail/feature-pack-details.module';
import { FeaturePacksModule } from './lib/feature-packs/feature-packs.module';
import { GeneralInformationMainPanelModule } from './components/general-information-main-panel/general-information-main-panel.component.module';
import { IconCardModule } from '@erad/components/icon-card';
import { InfoMessageComponentModule } from './components/info-message/info-message.component.module';
import { InputConfigurationDetailsModule } from './lib/input-configuration-details/input-configuration-details.module';
import { InputConfigurationsModule } from './lib/input-configurations/input-configurations.module';
import { InstallFeaturePackDialogModule } from './components/install-feature-pack-dialog/install-feature-pack-dialog.module';
import { JobDetailsModule } from './lib/job-detail/job-details.module';
import { JobsModule } from './lib/jobs/jobs.module';
import { NotificationV2Module } from '@erad/components/notification-v2';
import { SharedModule } from './shared/shared.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { TabNavigationModule } from './lib/shared-components/tab-navigation/tab-navigation.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { translateModuleConfig } from './translate/translate.factory';
import { ApplicationInitializerFactory } from './translation.config';

export const config: ModuleConfiguration = {
  declarations: [AppComponent],
  imports: [
    // will instantiate ngrx in our app. Param is the defined reducers.
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    // Will instantiate our rgrx dev tools
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),

    TranslateModule.forRoot(translateModuleConfig),
    ConfigModule.forRoot({
      fetch: {
        url: environment.jsonPath,
        headers: {},
      },
      theme: {
        url: environment.jsonTheme,
      },
    }),
    AppRoutingModule,
    AppSwitcherModule,
    ApplicationDetailsModule,
    ApplicationLayoutModule,
    ApplicationsModule,
    BreadcrumbModule,
    BrowserAnimationsModule,
    BrowserModule,
    CardModule,
    CommonModule,
    CopyDownloadModule,
    CreateJobComponentModule,
    CreateJobContainerModule,
    CreateScheduleComponentModule,
    DatePickerModule,
    DeleteScheduleConfirmDialogComponentModule,
    DiscoveredObjectsModule,
    DynamicInputsDisplayModule,
    EdsIconModule,
    EradErrorIconModule,
    EradSuccessIconModule,
    EradWarningIconModule,
    FailureDisplayDialogModule,
    FailureDisplayModule,
    FeaturePackDetailsModule,
    FeaturePacksModule,
    GeneralInformationMainPanelModule,
    HttpClientModule,
    IconCardModule,
    InfoMessageComponentModule,
    InfoPopupModule,
    InputConfigurationDetailsModule,
    InputConfigurationsModule,
    InstallFeaturePackDialogModule,
    JobDetailsModule,
    JobsModule,
    MenuToggleModule,
    NavigationMenuModule,
    NotificationV2Module,
    SharedModule,
    SideDrawerModule,
    TabNavigationModule,
    TableModule,
    TabsModule,
    TextInputModule,
    ToolbarModule,
    UserProfileModule
  ],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BlackListInterceptorService,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: ApplicationInitializerFactory,
      deps: [ TranslateService, Injector ],
      multi: true
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
};
