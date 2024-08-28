import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { Actions } from '@ngrx/effects';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Application } from 'src/app/models/application.model';
import { ApplicationsCardViewComponent } from 'src/app/components/applications-card-view/applications-card-view.component';
import { ConfirmationService } from '@erad/components';
import { CreateJobInformationFormComponent } from 'src/app/components/create-job/create-job-information-form/create-job-information-form.component';
import { CreateJobProcessingService } from 'src/app/lib/create-job/services/create-job-processing.service';
import { DeleteFeaturePackHandlerService } from 'src/app/services/delete-feature-pack-handler.service';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { EntityType } from 'src/app/enums/entity-type.enum';
import { FEATURE_PACK_DOWNLOAD_WITH_ID_URL } from 'src/app/constants';
import { FeaturePackDetailsFacadeService } from 'src/app/lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { FeaturePackDetailsPageConfig } from 'src/app/constants/feature-pack-details-config';
import { FeaturePackDetailsResponse } from 'src/app/models/feature-pack-details-response.model';
import { FeaturePackFacadeService } from 'src/app/lib/feature-packs/services/feature-packs-facade.service';
import { InformationItemModel } from 'src/app/models/information-item.model';
import { Job } from 'src/app/models/job.model';
import { RbacService } from 'src/app/services/rbac.service';
import { TabNavigationComponent } from 'src/app/lib/shared-components/tab-navigation/tab-navigation.component';
import { TableUtilsService } from 'src/app/services/table-utils.service';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { TranslateService } from '@ngx-translate/core';
import { updateBadgeCount } from 'src/app/utils/common.utils';

/**
 * General view (can say 360 degree view) for feature pack detail component.
 * navigated from link away click from feature pack table right panel using router navigation.
 */
@Component({
  selector: 'dnr-feature-pack-detail-view-container',
  templateUrl: './feature-pack-detail-view-container.component.html',
  styleUrls: ['./feature-pack-detail-view-container.component.scss'],
})
@UnsubscribeAware()
export class FeaturePackDetailViewContainerComponent implements OnInit, OnChanges {

  @ViewChild(CreateJobInformationFormComponent) createJobInformationForm: CreateJobInformationFormComponent;
  @ViewChild(ApplicationsCardViewComponent) applicationsCardViewComponent: ApplicationsCardViewComponent;

  isLeftPanelShown: boolean = true;
  isRightPanelShown: boolean = false;
  isSecondRightPanelShown: boolean = false;

  featurePackDetailsConfig = JSON.parse(JSON.stringify(FeaturePackDetailsPageConfig));
  createJobIconPath: string = './assets/icons/add-sign-icon.svg';
  createJobIconPathActive: string = './assets/icons/add-sign-icon-active.svg';
  EntityTypeConstant = EntityType;

  accordion: string = this.activatedRoute.snapshot.queryParams?.linkAwaySection;
  selectedEntity?: string = this.activatedRoute.snapshot.queryParams.type || EntityType.FP;
  id?: any = this.activatedRoute.snapshot.queryParams.id;
  downloadURL?: string;
  mainLoading = false;

  selectedApplicationId?: string;
  title: string;
  subtitle: string;
  job: Job;
  featurePackInfo: FeaturePackDetailsResponse;
  generalFeaturePackInfo: InformationItemModel[] = [];
  featurePackInfoId: string;

  showCreateJobForm: boolean = false;

  application: Application;
  hasRbacWriteAccess: boolean = false;

  tabNavigationComponent: TabNavigationComponent;
  tabsInitialized: boolean;
  isFeaturePackDetailsLoading: boolean;

  constructor( // NOSONAR Constructor has too many parameters. Maximum allowed is 7
    readonly translateService: TranslateService,
    readonly activatedRoute: ActivatedRoute,
    readonly rbacService: RbacService,
    readonly actions$: Actions,
    readonly appItemUtilHelper: TableUtilsService<any>,
    readonly featurePackFacadeService: FeaturePackFacadeService,
    readonly featurePackDetailFacadeService: FeaturePackDetailsFacadeService,
    readonly deleteFeaturePackHandlerService: DeleteFeaturePackHandlerService,
    readonly tabsService: TabsService,
    readonly confirmationService: ConfirmationService,
    readonly createJobProcessingService: CreateJobProcessingService,
    readonly appComponent: AppComponent
  ) {
    this._setAccordionIndex(this.accordion);
  }

  ngOnInit(): void {
    this.hasRbacWriteAccess = this.rbacService.isReadWrite();
    this.subscribeToFeaturePackById();

    this.featurePackDetailFacadeService.loadDetails(this.id);

    this.selectedApplicationId = this.activatedRoute.snapshot.queryParams.applicationId;
    this.createJobProcessingService.onCancelEvent
      .pipe(takeUntilDestroyed(this))
      .subscribe((cancelled: boolean) => this._onCancel(cancelled));
  }

  ngOnChanges(): void {
    this.selectedApplicationId = this.activatedRoute.snapshot.queryParams.applicationId;
  }

  onCloseFirstRightPanel() {
    this._closeCreateJobFormWithConfirm(() => {
      this.isRightPanelShown = false;
      this.isSecondRightPanelShown = false;
      this.isLeftPanelShown = true;
    });
  }

  onCloseSecondRightPanel() {
    this._closeCreateJobFormWithConfirm(() => {
      this.isSecondRightPanelShown = false;
    });
  }

  onCloseEntityDetailButtonClicked() {
    this.isLeftPanelShown = false;
  }

  onApplicationCardSelected($event) {
    if ($event && $event.id === this.application?.id) {
      // same card -> don't show "sure you want to close create job panel".
      // Make sure right hand jobs panel is open when app selected.
      this.isRightPanelShown = true;
      return;
    }

    // event might be null if no card selected.
    this.application = $event;
    this.selectedApplicationId = $event?.id;

    this._closeCreateJobFormWithConfirm(() => {
      // Do not show right panel if no application selected.
      this.isRightPanelShown = !!this.application;
      this.isLeftPanelShown = true;
      this.isSecondRightPanelShown = false;
    });
  }

  onCreateJobFromPanelAction() {
    if (this.tabsService.canCreateNewTab()) {
      this.isSecondRightPanelShown = true;
      this.showCreateJobForm = true;
      this.isLeftPanelShown = false;
    }
  }

  onJobSelectionFromJobsList(job: Job) {
    this._closeCreateJobFormWithConfirm(() => {
      this.job = job;
      this.isSecondRightPanelShown = true;
      this.isLeftPanelShown = false;
    });
  }

  onAccordionHeaderClicked(id: string): void {
    this.isRightPanelShown = false;
    this._setAccordionIndex(id);
  }

  subscribeToFeaturePackById() {
    this.featurePackDetailFacadeService
      .getFeaturePackDetailSuccess()
      .pipe(takeUntilDestroyed(this))
      .subscribe((featurePack) => {
        if (!featurePack) {
          return;
        }

        const currentId = this.featurePackInfoId;
        this.featurePackInfo = featurePack;
        this.featurePackInfoId = this.featurePackInfo.id; /* without an id will see not found message (see html) */

        this.generalFeaturePackInfo = this._createInfoShownOnMainPanel(this.featurePackInfo);
        this.downloadURL = (this.featurePackInfoId) ? FEATURE_PACK_DOWNLOAD_WITH_ID_URL.replace('{0}', `${this.featurePackInfoId}`) : null;

        this.featurePackDetailsConfig.selectableItems =
          updateBadgeCount(
            this.featurePackDetailsConfig.selectableItems,
            this.featurePackInfo.applications?.length || 0,
            'itemInformationDetails.APPLICATIONS'
          );

        // When enter the details page (which causes feature pack details to be read),
        // change accordion to application(as could be showing general information in details panel).
        this._setAccordionIndex('APPLICATIONS');

        this._handleFeaturePackDetailsUpdate(currentId === this.featurePackInfoId);

        // using this.id here (old) is out of synch with id for new featurePack info
        this.tabsService.updateTabTitle(this.featurePackInfoId, this.featurePackInfo.name, true);

        if (!this.tabsInitialized) {
          this.appComponent.initTabs(this.featurePackInfo);
          this.tabsInitialized = true;
        }
      });

    /* error already going to be displayed on a notification
      (likely a D-01 from feature pack having been uninstalled) */
    this.featurePackDetailFacadeService
      .getFeaturePackDetailsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        if (!failure) {
          return;
        }
        // see html - display not found message rather than other Feature Pack's info
        this.featurePackInfoId = null;
        this.featurePackInfo = null;
        this._handleFeaturePackDetailsUpdate();
      });

    this.featurePackDetailFacadeService
      .getFeaturePackDetailsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((isLoading: boolean) => {
        // don't display not found message while loading
        this.isFeaturePackDetailsLoading = isLoading;
      });
  }

  // not private for unit test
  _onCancel(cancelled) {
    if (cancelled) {
      this._handleCancelCreateJobForJobsPage();
      this.onCloseSecondRightPanel();
    }
  }

  private _handleCancelCreateJobForJobsPage() {
    if (this.showCreateJobForm && this.selectedEntity === EntityType.JBS) {
      this.onCloseEntityDetailButtonClicked();
    }
  }

  _createInfoShownOnMainPanel(featurePack: FeaturePackDetailsResponse) {
    return [
      { label: this.translateService.instant('featurePack.FP_NAME'), value: featurePack.name },
      { label: this.translateService.instant('featurePack.ID'), value: featurePack.id },
      { label: this.translateService.instant('featurePack.DESCRIPTION'), value: featurePack.description },
      { label: this.translateService.instant('featurePack.CREATED_AT'), value: featurePack.createdAt, isDate: true },
      { label: this.translateService.instant('featurePack.ASSET'), value: featurePack.assets?.map(i => i.name).join(', ') },
    ];
  }

  private _setAccordionIndex(id: string) {
    this.accordion = id;
  }

  private _closeCreateJobFormWithConfirm(callback: Function) {
    if (this.createJobInformationForm?.isDirty()) {
      this.confirmationService
        .show({
          header: this.translateService.instant("create.UNSAVED_CHANGES_TITLE"),
          content: this.translateService.instant("create.UNSAVED_CHANGES_MESSAGE"),
          cancelText: this.translateService.instant("buttons.CANCEL"),
          confirmButtonText: this.translateService.instant("buttons.CONTINUE"),
          icon: 'warningIcon'
        })
        .pipe(takeUntilDestroyed(this))
        .subscribe(shouldHideForm => {
          this.showCreateJobForm = !shouldHideForm;
          if (shouldHideForm) {
            callback();
          }
        });

    } else {
      this.showCreateJobForm = false;
      callback();

    }
  }

  /**
   * When multiple Feature pack detail views open
   * under different navigation tab, we can not have the right side panel, etc.
   * staying open with information for a different tab.
   *
   * - called on navigation tab click
   * - also called on feature pack drop down selection change in create job form (so care needed there)
   *
   * @param isSameFeaturePack - true if same feature pack as before
   *                            (would not want warnings for unsaved changes, if
   *                            this method being call for loading create job form)
   */
  _handleFeaturePackDetailsUpdate(isSameFeaturePack?: boolean) {

    if (!isSameFeaturePack && !this.showCreateJobForm) {
      this._closeAllRightFeaturePackDetailsFlyOuts();
      this._clearAnyExistingSelectedApplication();
    }

    /* if user has closed the left panel
       (and suitable to open it), clicking tab is a way to open it again */
    this.isLeftPanelShown = !this.isSecondRightPanelShown;
  }

  /**
   * If tab is changing will want to refresh any open fly-outs
   * and info will not be applicable to new tab.
   */
  _closeAllRightFeaturePackDetailsFlyOuts() {

    if (this.isRightPanelShown) {
      this.onCloseFirstRightPanel();
    } else if (this.isSecondRightPanelShown) {
      this.onCloseSecondRightPanel();
    }
  }

  _clearAnyExistingSelectedApplication(): void {
    if (this.applicationsCardViewComponent) {
      this.applicationsCardViewComponent.clearSelection();
    }
  }
}
