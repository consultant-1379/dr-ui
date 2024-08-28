import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { SearchFilter } from 'src/app/components/search/components/search-filter/search-filter.model';
import { AppItemTableButton } from 'src/app/components/app-item-table-view/app-item-table-view.component.config';
import { AppItemTableViewComponent } from 'src/app/components/app-item-table-view/app-item-table-view.component';
import { ConfirmationService } from '@erad/components/confirmation-dialog';
import { CreateScheduleFormComponent } from 'src/app/components/create-schedule/create-schedule-form/create-schedule-form.component';
import { DeleteScheduleHandlerService } from 'src/app/services/delete-schedule-handler.service';
import { EntityType } from '../../enums/entity-type.enum';
import { Job } from 'src/app/models/job.model';
import { JobScheduleDetailsFacadeService } from '../job-schedule-details/services/job-schedule-details-facade.service';
import { JobScheduleSummary } from 'src/app/models/job-schedule-summary.model';
import { JobSchedulesFacadeService } from '../job-schedules/services/job-schedules-facade.service';
import { RbacService } from 'src/app/services/rbac.service';
import { ScheduleSearchFields } from './schedules-search.config';
import { TabNavigationComponent } from '../shared-components/tab-navigation/tab-navigation.component';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { retrieveSessionStoreObject } from 'src/app/utils/session-store.utils';
import { sessionStorageKeys } from 'src/app/constants/app.constants';

/**
 * The Scheduled Jobs Table Component, containing
 * - the left main menu
 * - the table
 * - the first right hand panel either:
 *    1) Schedule details panel
 *    2) Create Schedule Panel
 * - the second right hand panel with job details (details of job selected from
 * the selected job from "recent executions")
 */
@UnsubscribeAware()
@Component({
  selector: 'dnr-app-schedules-table',
  templateUrl: './app-schedules-table.component.html',
  styleUrls: ['./app-schedules-table.component.scss']
})
export class AppSchedulesTableComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild(CreateScheduleFormComponent) createScheduleForm: CreateScheduleFormComponent;

  @ViewChild('table') table: AppItemTableViewComponent<any, any>;

  hasRbacWriteAccess: boolean = false;

  rightPanelTitle: string;
  rightPanelSubTitle: string;
  isCreateScheduleShown: boolean = false;

  isLeftMenuShown: boolean = true;
  isFirstRightPanelShown: boolean;
  isSecondRightPanelShown: boolean;

  Schedules: string = EntityType.SCHEDULES;

  selectedSchedule: JobScheduleSummary;
  selectedJob: Job;
  filter: SearchFilter = {};

  forceReloadTable: boolean = false;

  createIconPath: string = './assets/icons/add-sign-icon.svg';
  createIconPathActive: string = './assets/icons/add-sign-icon-active.svg';

  schedulesTableConfig: any;
  searchFieldsConfig = ScheduleSearchFields;

  constructor(
    readonly rbacService: RbacService,
    readonly schedulesFacadeService: JobSchedulesFacadeService,
    readonly scheduleDetailsFacadeService: JobScheduleDetailsFacadeService,
    readonly translateService: TranslateService,
    readonly deleteScheduleHandlerService: DeleteScheduleHandlerService,
    readonly confirmationService: ConfirmationService,
    readonly tabsService: TabsService
  ) { }

  ngOnInit(): void {
    this.hasRbacWriteAccess = this.rbacService.isReadWrite();
    this.schedulesTableConfig = this._updateSchedulesTableConfig();
    this._setCreateScheduleShown(false);
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

  /* left side (menu) drawer close button click event */
  onMainMenuLeftPanelCloseButtonClicked() {
    this.isLeftMenuShown = false;
  }

  /* left side (menu) drawer open button click event */
  onExpandMainMenuLeftPanelButtonClicked() {
    this.isLeftMenuShown = true;
  }

  onSearchFilterChanged() {
    this._resetVisiblePanels();
  }

  onTableActionClick(_tableAction: any): void {
    this.forceReloadTable = false;
    if (_tableAction) {
      const [data, actionName] = [..._tableAction];
      if (actionName === AppItemTableButton.DELETE && data?.id) {
        this.deleteScheduleHandlerService.deleteSchedule(data.id, data.name);
      }
    }
  }

  onSelectionChanged(rowEvent?: any[]): void {
    // Close panels on no selection EXCEPT create schedule panel as create schedule not depend on selection)
    if (rowEvent?.length === 0 && !this.isCreateScheduleShown) {
      this._resetVisiblePanels();
    } else if (rowEvent?.length === 1) {
      this._handleSingleRowSelect(rowEvent[0]);
    }
  }

  /**
   * Recent executions job selection
   * (on Schedule details panel) will launch
   * a job details panel in second right panel.
   * @param job  recent executions job
   */
  onJobSelection(job: Job) {
    if (job) {
      this.isSecondRightPanelShown = true;
      this.selectedJob = job;
    }
  }

  onScheduleUpdated() {
    // TODO - need to update show that right hand panel does not
    // close on schedule update (i.e. on enable/disable).
    this.forceReloadTable = true;
  }

  onCreateScheduleSuccess() {
    this.forceReloadTable = true;
    this._setCreateScheduleShown(false);
  }

  onCancelSchedule() {
    if (this.isCreateScheduleShown) {
      this.onCloseFirstRightSidePanel();
    }
  }

  onCloseFirstRightSidePanel() {
    this._closeCreateScheduleFormWithConfirm(() => {
      this._resetVisiblePanels();
    });
  }

  onCloseSecondRightPanel() {
    this.isSecondRightPanelShown = false;
  }

  private _initSubscriptions() {

    this.deleteScheduleHandlerService.deleteScheduleSuccessEvent
      .pipe(takeUntilDestroyed(this))
      .subscribe(() => {
        this._clearRowSelection();
        this.forceReloadTable = true;
        this._clearRowSelection();
        this._resetVisiblePanels();
      });

    this.deleteScheduleHandlerService.deleteFilteredJobsSuccessEvent
      .pipe(takeUntilDestroyed(this),
        filter(jobScheduleId => !!jobScheduleId))
      .subscribe((jobScheduleId) => {
        this.tabsService.removeAllTabsWithJobScheduleId(jobScheduleId);
      });
  }

  private _setInitialFilter() {
    // session item jobScheduleId contains e.g. {jobScheduleId: '1234'} in session storage.
    const idObject = retrieveSessionStoreObject(sessionStorageKeys.jobScheduleId);
    const id = idObject?.[sessionStorageKeys.jobScheduleId];
    if (id) {
      this.filter = { id }
    }
    window.sessionStorage.removeItem(sessionStorageKeys.jobScheduleId);
  }

  private _resetVisiblePanels() {
    this.isLeftMenuShown = true;
    this.isFirstRightPanelShown = false;
    this.isSecondRightPanelShown = false;
  }

  /* expose for junit testing */
  _handleSingleRowSelect(row: any): void {
    this.selectedSchedule = { ...row };

    this._closeCreateScheduleFormWithConfirm(() => {
      this.forceReloadTable = false; // force a reload of table if user enables/disables schedule
      this.isFirstRightPanelShown = true;
      this.isSecondRightPanelShown = false;
    });
  }

  /* expose for junit testing */
  _onCreateScheduleButtonClick() {
    this._clearRowSelection(); // anything in table row no longer has context
    this.forceReloadTable = false;
    this.isFirstRightPanelShown = true;
    this.isSecondRightPanelShown = false;
    this._setCreateScheduleShown(true);
  }

  _clearRowSelection() {
    this.table?.clearSelection?.();
    this.selectedSchedule = null;
  }

  /**
   * Context button handling for schedule tables
   * @param _appItemAction e.g. AppItemTableButton.DELETE
   */
  private _contextButtonHandler(_appItemAction: string): void {
    if (this.selectedSchedule) {
      this.onTableActionClick([this.selectedSchedule, _appItemAction]);
    }
  }

  private _setCreateScheduleShown(enabled: boolean) {
    if (this.isCreateScheduleShown !== enabled) {
      // i.e. if value changing
      this.isCreateScheduleShown = enabled;
      this._resetCreateScheduleIconPath();
    }

    if (enabled) {
      this.rightPanelTitle = this.translateService.instant("createSchedule.TITLE");
      this.rightPanelSubTitle = this.translateService.instant("createSchedule.SUBTITLE");
    } else {
      this.rightPanelTitle = this.translateService.instant("navigation.SCHEDULE_DETAILS");
      const id = this.selectedSchedule?.id || '';
      this.rightPanelSubTitle = this.translateService.instant("ID_UPPER_CASE") + ' - ' + id;
    }
  }

  private _closeCreateScheduleFormWithConfirm(callback: Function) {
    if (this.createScheduleForm?.isDirty()) {
      this.confirmationService
        .show({
          header: this.translateService.instant("create.UNSAVED_CHANGES_TITLE"),
          content: this.translateService.instant("create.UNSAVED_CHANGES_MESSAGE"),
          cancelText: this.translateService.instant("buttons.CANCEL"),
          confirmButtonText: this.translateService.instant("buttons.CONTINUE"),
          icon: 'warningIcon'
        })
        .subscribe(closeForm => {
          this._setCreateScheduleShown(!closeForm);
          if (closeForm) {
            callback();
          } else {
             /* cancel press - back to form (with cleared row selection as for any create scenario) */
             this._clearRowSelection();
          }
        });
    } else {
      this._setCreateScheduleShown(false);
      callback();
    }
  }

  private _getTabNavComponent(): TabNavigationComponent {
    return this.tabsService.getTabNavigationComponent();
  }

   /**
   * Used when not replacing this.schedulesTableConfig,
   * i.e. without entering back into a get items call
   * (app-item-table-view.component._subscribeToGetItems)
   * to avoid an auto row selection being made,
   * which would then always show details panel information instead
   * of the create schedule form as wanted.
   */
   private _resetCreateScheduleIconPath() : void {
    if (this.schedulesTableConfig){
      const iconPath = this.isCreateScheduleShown ? this.createIconPathActive : this.createIconPath;
      this.schedulesTableConfig.iconButtonActions[0].disabled = this.isCreateScheduleShown;
      this.schedulesTableConfig.iconButtonActions[0].iconPath = iconPath;
    }
  }

  private _updateSchedulesTableConfig() {
    return {
      facadeService: this.schedulesFacadeService,
      facadeDetailService: this.scheduleDetailsFacadeService,
      searchPlaceholder: 'SCHEDULE_SEARCH_PLACEHOLDER',
      contextActions: [],
      iconButtonActions: [
        {
          name: 'buttons.CREATE_SCHEDULE_TOOLTIP',
          id: 'create-schedule-icon-button-id',
          iconPath: this.isCreateScheduleShown ? this.createIconPathActive : this.createIconPath,
          disabled: this.isCreateScheduleShown,
          actionHandler: () => {
            this._onCreateScheduleButtonClick();
          },
          tooltip: 'buttons.CREATE_SCHEDULE_TOOLTIP',
        },
      ],
      actionItems: [
        {
          icon: 'trashcan',
          id: 'delete-schedule-button-id',
          label: AppItemTableButton.DELETE,
          handler: this._contextButtonHandler.bind(this),
        },
      ],
    };
  }
}
