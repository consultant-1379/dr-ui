import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { getDisplayValue, updateBadgeCount } from 'src/app/utils/common.utils';

import { Actions } from '@ngrx/effects';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AppConstants } from 'src/app/constants';
import { DiscoveredObjects } from 'src/app/models/discovered-objects.model';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { InformationItemModel } from 'src/app/models/information-item.model';
import { Job } from 'src/app/models/job.model';
import { JobDetailsFacadeService } from 'src/app/lib/job-detail/services/job-details-facade.service';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { SelectableItems } from './job-detail-view-container.config';
import { TabNavigationComponent } from 'src/app/lib/shared-components/tab-navigation/tab-navigation.component';
import { TableUtilsService } from 'src/app/services/table-utils.service';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * General view (can say 360 degree view) for job detail component.
 * navigated from Objects link away click from a Job details panel using router navigation.
 */
@Component({
  selector: 'dnr-job-detail-view-container',
  templateUrl: './job-detail-view-container.component.html',
  styleUrls: ['./job-detail-view-container.component.scss'],
})
@UnsubscribeAware()
export class JobDetailViewContainerComponent implements OnInit, OnDestroy, AfterViewInit {

  isLeftPanelShown: boolean = true;
  isFirstRightPanelShown: boolean = false;

  discoveredObjectsSelectableItems = SelectableItems;

  generalInfoMainPanel: InformationItemModel[] = [];
  objectsGeneralInfoRightPanel: InformationItemModel[] = [];

  jobId?: any = this.activatedRoute.snapshot.queryParams.id;
  jobInfo: Job;
  isJobDetailsLoading: boolean;
  selectedObjectDetail: DiscoveredObjects;
  selectedTabIndex: number;
  actionFilters = [];

  accordion: string = this.activatedRoute.snapshot.queryParams?.linkAwaySection;

  tabsInitialized = false;
  tabNavigationComponent: TabNavigationComponent;

  pollingInterval: any;
  undefinedDisplayValue = AppConstants.undefinedDisplayValue;

  // discovered objects right panel
  constructor(
    readonly translateService: TranslateService,
    readonly activatedRoute: ActivatedRoute,
    readonly actions$: Actions,
    readonly appItemUtilHelper: TableUtilsService<any>,
    readonly jobDetailsFacadeService: JobDetailsFacadeService,
    readonly tabsService: TabsService,
    readonly appComponent: AppComponent
  ) { }

  ngOnInit(): void {
    this._loadJobDetails();
    this.listenJobDetailById();
  }

  ngAfterViewInit() {
    this.tabNavigationComponent = this.tabsService.getTabNavigationComponent();
    if (this.tabNavigationComponent){
      this._subscribeToTabChange();
    } else {
      setTimeout(() => {
        this._subscribeToTabChange(); // need tabNavigationComponent not to be null
      }, 3000);
    }
  }

  ngOnDestroy() {
    this._clearPolling();
  }

  listenJobDetailById() {
    this.jobDetailsFacadeService
      .getJobDetails()
      .pipe(takeUntilDestroyed(this))
      .subscribe((jobDetail) => {
        if (!jobDetail) {
          return;
        }
        this.jobInfo = jobDetail;
        this.generalInfoMainPanel = this._createDetailedGeneralInfo(jobDetail);
        this.tabsService.updateTabTitle(jobDetail.id, jobDetail.name, false);
        if (!this.tabsInitialized) {
          this.appComponent.initTabs(null, this.jobInfo);
          this.tabsInitialized = true;
        }
        // When change FP (e.g. pressing other tab), then main panel should show Objects table.
        this.accordion = 'OBJECTS';
        this._checkForPolling();
      });

    /* error already going to be displayed on a notification
    - likely a D-17 from Job not existing*/
    this.jobDetailsFacadeService
      .getJobDetailsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        if (!failure) {
          return;
        }
        // see html - display not found message rather than other job's info
        this.jobInfo = null;
      });

    this.jobDetailsFacadeService
      .getJobDetailsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((isLoading: boolean) => {
        // don't display not found message while loading
        this.isJobDetailsLoading = isLoading;
      });
  }

  onCloseEntityDetailButtonClicked() {
    this.isLeftPanelShown = false;
  }

  onLeftAccordionHeaderClicked(id: string): void {
    this.isFirstRightPanelShown = false;
    this.accordion = id;
  }

  onDiscoveredObjectSelection(items: DiscoveredObjects[]) {

    this.isFirstRightPanelShown = false;
    this.selectedObjectDetail = null;

    if (Array.isArray(items) && items.length === 1) {  /* single select */
      this.selectedObjectDetail = items[0]; /* for copy to clipboard object */

      this.objectsGeneralInfoRightPanel = this._createRightPanelDiscoveredObjectsGeneralInfo(this.selectedObjectDetail);

      const filters = items[0].filters;
      this.actionFilters = Array.isArray(filters) ? filters: [];

      this.discoveredObjectsSelectableItems = updateBadgeCount(
        this.discoveredObjectsSelectableItems,
        this.actionFilters.length,
        'itemInformationDetails.FILTER_ACTION_DETAIL'
      );
      this.isFirstRightPanelShown = true;
    }
  }

  onReloadRequested() {
    this._clearPolling();
    this._loadJobDetails();
  }

  onCloseRightPanel() {
    this.isFirstRightPanelShown = false;
    this.selectedObjectDetail = null;
  }

  /**
   * Affecting General Information displayed on main panel
   * following General Information selection on left panel in Job Details view
   * @param jobDetail   Job object
   * @returns InformationItemModel[] for display
   */
  _createDetailedGeneralInfo(jobDetail: Job): InformationItemModel[] {
    let generalInfo: InformationItemModel[] = [
      { label: this.translateService.instant('job.JOB_NAME'), value: getDisplayValue(jobDetail?.name) },
      {
        label: this.translateService.instant('job.STATUS'),
        value: getDisplayValue(this.translateService.instant('state')[jobDetail?.status])
      },
      { label: this.translateService.instant('job.ID'), value: getDisplayValue(jobDetail?.id) },
      { label: this.translateService.instant('job.DESCRIPTION'), value: getDisplayValue(jobDetail?.description) },
      { label: this.translateService.instant('job.DISCOVERED_OBJECTS_COUNT'), value: getDisplayValue(jobDetail?.discoveredObjectsCount).toString() },
      { label: this.translateService.instant('job.RECONCILED_OBJECTS_COUNT'), value: getDisplayValue(jobDetail?.reconciledObjectsCount).toString() },
      { label: this.translateService.instant('job.RECONCILED_OBJECTS_ERROR_COUNT'), value: getDisplayValue(jobDetail?.reconciledObjectsErrorCount).toString() },
      { label: this.translateService.instant('featurePack.FP_NAME'), value: getDisplayValue(jobDetail?.featurePackName) },
      { label: this.translateService.instant('job.FEATURE_PACK_ID'), value: getDisplayValue(jobDetail?.featurePackId) },
      { label: this.translateService.instant('job.APPLICATION_NAME'), value: getDisplayValue(jobDetail?.applicationName) },
      { label: this.translateService.instant('job.APPLICATION_ID'), value: getDisplayValue(jobDetail?.applicationId) },
      { label: this.translateService.instant('job.JOB_DEFINITION'), value: getDisplayValue(jobDetail?.applicationJobName) },
      { label: this.translateService.instant('job.SCHEDULE_ID'), value: getDisplayValue(jobDetail?.jobScheduleId) },
      { label: this.translateService.instant('job.START_DATE'), value: getDisplayValue(jobDetail?.startDate), isDate: !!jobDetail?.startDate },
      { label: this.translateService.instant('job.COMPLETED_DATE'), value: getDisplayValue(jobDetail?.completedDate), isDate: !!jobDetail?.completedDate },
    ];
    // if errorMessage being supplied should not hide it (keep separate to satisfy UX wireframe)
    if (jobDetail?.errorMessage) {
      generalInfo.push({ label: this.translateService.instant('job.ERROR_MESSAGE'), value: jobDetail.errorMessage });
    }
    return generalInfo;
  }

  /**
   * Create the information to be shown on the right panel
   * Refer to DiscoverdObject format
   * (whole reason for this section is to show the "outer" error message if server has added it)
   */
  _createRightPanelDiscoveredObjectsGeneralInfo(selectedObjectDetail: DiscoveredObjects): InformationItemModel[] {

    const outerErrorMessage = selectedObjectDetail.errorMessage;
    const discoveredObjectState = selectedObjectDetail.status;
    const discrepancies: string [] = selectedObjectDetail.discrepancies;

    const generalInfo : InformationItemModel[] = [{
      label: this.translateService.instant("discoveredObjects.STATUS"),
      value: this.translateService.instant("state." + discoveredObjectState)
    },
    {
      label: this.translateService.instant("discoveredObjects.DISCREPANCIES"),
      value: discrepancies?.join('; ') || "-"
    },
    ];

    if (outerErrorMessage) {
      generalInfo.push({
        label: this.translateService.instant("discoveredObjects.ERROR_MESSAGE"),
        value: outerErrorMessage,
        isBold: true   // UX want this outer error message (only) to be bold on Object details flyout
      });
    }
    return generalInfo;
  }

  /**
   * If user has closed the job details left panel,
   * clicking tab is a way to open it again
   */
   _subscribeToTabChange() {
    // only one tabService at root
    this.tabNavigationComponent = this.tabsService.getTabNavigationComponent();
    if (this.tabNavigationComponent) {
      this.tabNavigationComponent.tabChange
        .pipe(takeUntilDestroyed(this))
        .subscribe(() => {
          this.isLeftPanelShown = true;
      });
    }
  }

  // Initiate polling for some job statuses.
  private _checkForPolling() {
    if (!this._shouldPoll()) {
      this._clearPolling();

    } else if (!this.pollingInterval) {
      this.pollingInterval = setInterval(
        this._loadJobDetails.bind(this), AppConstants.discoveredObjectsPolling);
    }
  }

  /* expose for junit testing */
  _clearPolling() {
    clearInterval(this.pollingInterval);
    this.pollingInterval = null;
  }

  /* expose for junit testing */
  _loadJobDetails() {
    this.jobDetailsFacadeService.loadDetails(this.jobId);
  }

  private _shouldPoll() {
    return this.jobInfo && this.jobInfo.status === JobStatus.NEW ||
      this.jobInfo.status === JobStatus.RECONCILE_INPROGRESS ||
      this.jobInfo.status === JobStatus.RECONCILE_REQUESTED ||
      this.jobInfo.status === JobStatus.DISCOVERY_INPROGRESS ||
      this.jobInfo.status === JobStatus.DISCOVERED; // its a state that can change (and server has been known to pass back even after press reconcile on first call)
  }
}
