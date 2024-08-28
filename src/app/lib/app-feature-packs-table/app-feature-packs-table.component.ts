import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { SearchFilter } from 'src/app/components/search/components/search-filter/search-filter.model';
import { AppItemTableButton } from 'src/app/components/app-item-table-view/app-item-table-view.component.config';
import { AppItemTableViewComponent } from 'src/app/components/app-item-table-view/app-item-table-view.component';
import { Application } from 'src/app/models/application.model';
import { ConfirmationService } from '@erad/components/confirmation-dialog';
import { CreateJobInformationFormComponent } from 'src/app/components/create-job/create-job-information-form/create-job-information-form.component';
import { CreateJobProcessingService } from '../create-job/services/create-job-processing.service';
import { DeleteFeaturePackHandlerService } from 'src/app/services/delete-feature-pack-handler.service';
import { EntityType } from '../../enums/entity-type.enum';
import { FEATURE_PACK_DOWNLOAD_WITH_ID_URL } from 'src/app/constants/UrlConstants';
import { FeaturePack } from 'src/app/models/feature-pack.model';
import { FeaturePackDetailsFacadeService } from '../feature-pack-detail/services/feature-pack-details-facade.service';
import { FeaturePackFacadeService } from '../feature-packs/services/feature-packs-facade.service';
import { FeaturePackFileHandlerService } from 'src/app/services/feature-pack-file-handler.service';
import { FeaturePackPageConfig } from '../../constants/feature-pack-details-config';
import { FeaturePackSearchFields } from './feature-pack-search.config';
import { InformationItemModel } from 'src/app/models/information-item.model';
import { Job } from 'src/app/models/job.model';
import { RbacService } from 'src/app/services/rbac.service';
import { Router } from '@angular/router';
import { RoutingPathContent } from 'src/app/enums/routing-path-content.enum';
import { TabNavigationComponent } from '../shared-components/tab-navigation/tab-navigation.component';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { TranslateService } from '@ngx-translate/core';
import { retrieveSessionStoreObject } from 'src/app/utils/session-store.utils';
import { sessionStorageKeys } from 'src/app/constants';
import { updateBadgeCount } from 'src/app/utils/common.utils';

/**
 * The Feature Pack Table Component, containing the left main menu, the table, and right hand panel
 * which contains:
 * 1) Feature Pack Details
 * 2) Jobs created using selected FP application
 * 3) Job details panel OR Create Job Panel
 */
@UnsubscribeAware()
@Component({
  selector: 'dnr-feature-packs-table',
  templateUrl: './app-feature-packs-table.component.html',
  styleUrls: ['./app-feature-packs-table.component.scss']
})

export class AppFeaturePacksTableComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('table') table: AppItemTableViewComponent<any, any>;

  @ViewChild(CreateJobInformationFormComponent) createJobInformationForm: CreateJobInformationFormComponent;

  hasRbacAdminAccess: boolean = false;
  hasRbacWriteAccess: boolean = false;

  // deep copies
  fpDetailsConfig = JSON.parse(JSON.stringify(FeaturePackPageConfig));
  searchFieldsConfig = FeaturePackSearchFields;

  isLeftMenuShown: boolean = true;
  isFirstRightPanelShown: boolean = false;
  isSecondPanelShown: boolean = false;
  isThirdRightPanelShown: boolean = false;
  isCreateJobShown: boolean = false;

  FeaturePack: string = EntityType.FP;

  selectedFp: FeaturePack;
  selectedFpGeneralInfo: InformationItemModel[] = [];
  selectedJob: Job;
  selectedApplication: Application;
  filter: SearchFilter = {};

  downloadFpURL: string;
  downloadFpName: string;

  forceReloadTable: boolean = false;

  fpTableConfig: any;

  installIconPath: string = './assets/icons/add-sign-icon.svg';
  createJobIconPath: string = './assets/icons/add-sign-icon.svg';
  createJobIconPathActive: string = './assets/icons/add-sign-icon-active.svg';

  constructor( // NOSONAR : Constructor has too many parameters. Maximum allowed is 7
    readonly router: Router,
    readonly rbacService: RbacService,
    readonly featurePackFacadeService: FeaturePackFacadeService,
    readonly featurePackDetailsFacadeService: FeaturePackDetailsFacadeService,
    readonly featurePackFileHandler: FeaturePackFileHandlerService,
    readonly deleteFeaturePackHandlerService: DeleteFeaturePackHandlerService,
    readonly translateService: TranslateService,
    readonly createJobProcessingService: CreateJobProcessingService,
    readonly confirmationService: ConfirmationService,
    readonly tabsService: TabsService
  ) {}

  ngOnInit(): void {
    this.hasRbacAdminAccess = this.rbacService.isAdmin();
    this.hasRbacWriteAccess = this.rbacService.isReadWrite();
    this.fpTableConfig = this._createFeaturePackTableConfig();
    this._setInitialFilter();
    this._initSubscriptions();
  }

  /**
   * On entering this page, remove the blue rendering on the active tab
   * (shown in the Feature Pack / Job details page). Tabs should only be active when
   * on the details pages.
   */
  ngAfterViewInit() {
    this._getTabNavComponent()?.renderTabsInactive();
  }

  /**
   * On leaving this page, add the blue rendering on the active tab
   * (shown in the Feature Pack / Job details page). Tabs should be active when
   * on the details pages.
   */
  ngOnDestroy(): void {
    this._getTabNavComponent()?.renderTabsActive();
  }

  onMainMenuLeftPanelCloseButtonClicked() {
    this.isLeftMenuShown = false;
  }

  onExpandMainMenuLeftPanelButtonClicked() {
    this.isSecondPanelShown = false;
    this.isThirdRightPanelShown = false;
    this.isLeftMenuShown = true;
  }

  onSearchFilterChanged() {
    this._resetVisiblePanels();
  }

  onTableActionClick(_tableAction: any): void {
    this.forceReloadTable = false;
    if (_tableAction) {
      const [data, actionName] = [..._tableAction];
      if (data) {
        const { id, name } = data;

        if (actionName === AppItemTableButton.UNINSTALL) {
          this.deleteFeaturePackHandlerService.deleteFeaturePack(id, name);

        } else if (actionName === AppItemTableButton.UPDATE) {
            this.featurePackFileHandler.updateFeaturePack(id, name);
        }
      }
    }
  }

  onFpSelectionChanged(rowEvent? : any[]): void {
    if (rowEvent?.length === 0) {
      this.onCloseFirstRightSidePanel();
    } else if (rowEvent?.length === 1) {
      this._handleSingleRowSelect(rowEvent[0]);
    }
  }

  onJobSelectionFromJobsList(job: Job) {
    this.selectedJob = job;
    this._closeCreateJobFormWithConfirm(() => {
      this.isThirdRightPanelShown = true;
    });
  }

  onApplicationSelection(applicationDetail: any) {
    this.selectedApplication = applicationDetail;
    this.isLeftMenuShown = false;
    this.isSecondPanelShown = true;
    this.onCloseThirdRightPanel();
  }

  onCreateJobClickedHandler() {
    if (this.tabsService.canCreateNewTab()) {
      this.isThirdRightPanelShown = true;
      this.isCreateJobShown = true;
    }
  }

  onCloseFirstRightSidePanel() {
    this._closeCreateJobFormWithConfirm(() => this._resetVisiblePanels());
  }

  onCloseSecondRightPanel() {
    this._closeCreateJobFormWithConfirm(() => {
      this.selectedApplication = undefined;
      this.isLeftMenuShown = true;
      this.isSecondPanelShown = false;
      this.isThirdRightPanelShown = false;
    });
  }

  onCloseThirdRightPanel() {
    this._closeCreateJobFormWithConfirm(() =>  this.isThirdRightPanelShown = false);
  }

  onLinkAwayToFeaturePackDetails(linkAwaySection: string) {
    const id = this.selectedFp.id;
    if (this.tabsService.canOpenTab(id, true)) {
      this.router.navigate(
        [RoutingPathContent.FeaturePackDetail],
        { queryParams: { id, linkAwaySection } });
    }
  }

  private _clearRowSelection() {
    this.table?.clearSelection?.();
    this.selectedJob = null;
    this.selectedFp = null;
    this.downloadFpURL =null;
    this.downloadFpName = null;
  }

  private _setInitialFilter() {
    // session item featurePackId contains e.g. {featurePackId: '1234'} in session storage.
    const idObject = retrieveSessionStoreObject(sessionStorageKeys.featurePackId);
    const id = idObject?.[sessionStorageKeys.featurePackId];
    if (id) {
      this.filter = { id }
    }
    window.sessionStorage.removeItem(sessionStorageKeys.featurePackId);
  }

  private _resetVisiblePanels() {
    this.isLeftMenuShown = true;
    this.isFirstRightPanelShown = false;
    this.isSecondPanelShown = false;
    this.isThirdRightPanelShown = false;
  }

  /* expose for junit testing */
  _handleSingleRowSelect(row: any): void {
    this.selectedJob = null;
    this.selectedFp = {...row};
    this.downloadFpURL = FEATURE_PACK_DOWNLOAD_WITH_ID_URL.replace('{0}', this.selectedFp.id);
    this.downloadFpName = this.selectedFp.name;

    this.featurePackFacadeService.loadApplications(this.selectedFp.id);

    this.selectedFpGeneralInfo = this._createInfoShownOnMainPanel(this.selectedFp);

    this._closeCreateJobFormWithConfirm(() => {
      this.isLeftMenuShown = true;
      this.isFirstRightPanelShown = true;
      this.isSecondPanelShown = false;
      this.isThirdRightPanelShown = false;
    });
  }

  _createInfoShownOnMainPanel(featurePack) {
    return [
      { label: this.translateService.instant('featurePack.FP_NAME'), value: featurePack?.name },
      { label: this.translateService.instant('featurePack.DESCRIPTION'), value: featurePack?.description },
      { label: this.translateService.instant('featurePack.CREATED_AT'), value: featurePack?.createdAt, isDate: true },
    ];
  }

  private _initSubscriptions() {
    this.createJobProcessingService.onCancelEvent
      .pipe(takeUntilDestroyed(this))
      .subscribe((cancelled: boolean) => {
        this._cancelJob(cancelled);
      });

    this.featurePackFileHandler.fileUploadSuccessEvent
      .pipe(takeUntilDestroyed(this))
      .subscribe(() => {
        this.forceReloadTable = true;
        this._resetVisiblePanels();
      });

    this.deleteFeaturePackHandlerService.uninstallSuccessEvent
      .pipe(takeUntilDestroyed(this))
      .subscribe(() => {
        if (this.selectedFp) {
          this.tabsService.removeTab(this.selectedFp.id, true);
        }
        this._clearRowSelection();
        this.forceReloadTable = true;
        this._resetVisiblePanels();
      });

    this.featurePackFileHandler.fileUploadSuccessEvent
      .pipe(takeUntilDestroyed(this)).subscribe(() => {
        this.forceReloadTable = true;
        this._resetVisiblePanels();
      });

    this.featurePackFacadeService.getApplications()
      .pipe(takeUntilDestroyed(this))
      .subscribe((applicationsResponse) => {
        if (!applicationsResponse || !this.selectedFp) {
          return;
        }
        this.selectedFp.applications = applicationsResponse;
        this.fpDetailsConfig.selectableItems = updateBadgeCount(
          this.fpDetailsConfig.selectableItems,
          this.selectedFp.applications.length,
          'itemInformationDetails.APPLICATIONS'
        );
      });
  }

  /* expose for junit testing */
  _cancelJob(cancelled) {
    if (cancelled && this.isCreateJobShown) {
        this.onCloseThirdRightPanel();
    }
  }

  private _createFeaturePackTableConfig() {
    return {
      facadeService: this.featurePackFacadeService,
      facadeDetailService: this.featurePackDetailsFacadeService,
      contextActions: [],
      iconButtonActions: [
        {
          name: 'buttons.INSTALL_FEATURE_PACK_TOOLTIP',
          id: 'install-fp-icon-button-id',
          iconPath: this.installIconPath,
          actionHandler: () => this._onFeaturePackActionHandler(),
          tooltip: 'buttons.INSTALL_FEATURE_PACK_TOOLTIP',
        },
      ],
      searchPlaceholder: 'FEATURE_PACK_SEARCH_PLACEHOLDER',
      actionItems: [
        {
          label: AppItemTableButton.UPDATE,
          id: 'update-fp-button-id',
          handler: this._contextButtonHandler.bind(this),
        },
        {
          label: AppItemTableButton.UNINSTALL,
          id: 'uninstall-fp-button-id',
          handler: this._contextButtonHandler.bind(this),
        }
      ],
    };
  }

  _onFeaturePackActionHandler() {
    // need to refresh after install is successful as do for context buttons
    this.forceReloadTable = false;
    this.featurePackFileHandler.installFeaturePack();
  }

  /**
   * Context button handling for Feature pack and Jobs tables
   * @param contextAction e.g. "UPDATE", "UNINSTALL"
   */
  _contextButtonHandler(contextAction : string) : void {
    if (this.selectedFp) {
      this.onTableActionClick([this.selectedFp, contextAction]);
    }
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
        .subscribe(closeForm => {
          this.isCreateJobShown = !closeForm;
          if (closeForm) {
            callback();
          }
        });
    } else {
      this.isCreateJobShown = false;
      callback();
    }
  }

  private _getTabNavComponent(): TabNavigationComponent {
    return this.tabsService.getTabNavigationComponent();
  }
}
