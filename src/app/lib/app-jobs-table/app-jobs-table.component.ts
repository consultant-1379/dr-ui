import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { SearchFilter } from 'src/app/components/search/components/search-filter/search-filter.model';
import { AppItemTableButton } from 'src/app/components/app-item-table-view/app-item-table-view.component.config';
import { AppItemTableViewComponent } from 'src/app/components/app-item-table-view/app-item-table-view.component';
import { ConfirmationService } from '@erad/components/confirmation-dialog';
import { CreateJobInformationFormComponent } from 'src/app/components/create-job/create-job-information-form/create-job-information-form.component';
import { CreateJobProcessingService } from '../create-job/services/create-job-processing.service';
import { DeleteJobHandlerService } from 'src/app/services/delete-job-handler.service';
import { DnrTableActionItem } from 'src/app/components/dnr-table/dnr-table-button.model';
import { EntityType } from '../../enums/entity-type.enum';
import { Job } from 'src/app/models/job.model';
import { JobDetailsFacadeService } from '../job-detail/services/job-details-facade.service';
import { JobsFacadeService } from '../jobs/services/jobs-facade.service';
import { JobSearchFields } from './jobs-search.config';
import { RbacService } from 'src/app/services/rbac.service';
import { SelectionType } from '@erad/components';
import { TabNavigationComponent } from '../shared-components/tab-navigation/tab-navigation.component';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

/**
 * The Jobs Table Component, containing the left main menu, the table, and the right hand panel
 * which contains either 1) Job details panel or 2) Create Job Panel
 */
@UnsubscribeAware()
@Component({
  selector: 'dnr-app-jobs-table',
  templateUrl: './app-jobs-table.component.html',
  styleUrls: ['./app-jobs-table.component.scss']
})
export class AppJobsTableComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild(CreateJobInformationFormComponent) createJobInformationForm: CreateJobInformationFormComponent;

  @ViewChild('table') table: AppItemTableViewComponent<any, any>;

  hasRbacWriteAccess: boolean = false;

  rightPanelTitle: string;
  rightPanelSubTitle: string;
  isCreateJobShown: boolean = false;

  isLeftMenuShown: boolean = true;
  isFirstRightPanelShown: boolean;

  Jobs: string = EntityType.JBS;

  selectedJob: Job;
  filter: SearchFilter = {};

  forceReloadTable: boolean = false;

  createJobIconPath: string = './assets/icons/add-sign-icon.svg';
  createJobIconPathActive: string = './assets/icons/add-sign-icon-active.svg';

  jobsTableConfig: any;
  searchFieldsConfig = JobSearchFields;

  // multiple select table
  selectedJobs: Job[] = [];
  selectionType = SelectionType.Multiple;
  actionItems: DnrTableActionItem[] = [];

  constructor( // NOSONAR : Constructor has too many parameters. Maximum allowed is 7
    readonly rbacService: RbacService,
    readonly jobsFacadeService: JobsFacadeService<Job>,
    readonly translateService: TranslateService,
    readonly deleteJobHandlerService: DeleteJobHandlerService,
    readonly createJobProcessingService: CreateJobProcessingService,
    readonly confirmationService: ConfirmationService,
    readonly jobDetailsFacadeService: JobDetailsFacadeService,
    readonly tabsService: TabsService
  ) { }

  ngOnInit(): void {
    this.hasRbacWriteAccess = this.rbacService.isReadWrite();
    this.jobsTableConfig = this._updateJobsTableConfig();
    this._setCreateJobShown(false);
    this._initSubscriptions();
  }

  /**
   *  On entering this page, remove the blue rendering on the active tab
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

  /**
   * Context button and right click menu popup handling
   * @param _tableAction  an array with [row, actionValueString],
   *                      see tableActionClick AppItemTableViewComponent
   */
  onTableActionClick(_tableAction: any): void {
    this.forceReloadTable = false;
    if (_tableAction && this.selectedJobs.length > 0) {
      const actionName = _tableAction[1];  // don't need row data emitted

      if (actionName === AppItemTableButton.DELETE) {
        this.deleteJobHandlerService.deleteJobs(
          this.selectedJobs);
      } else if (actionName === AppItemTableButton.DUPLICATE && this.selectedJobs[0]?.id) {
        this.jobDetailsFacadeService.duplicateJob(
          this.selectedJobs[0].id,
          this.selectedJobs[0].name,
          true);
      }
    }
  }

  /**
   * Row(s) select/unselect:
   * - close right panels on cleared selection EXCEPT create job panel as create job not depend on selection.
   * - close right panels on multiple selection
   * - show job details on single selection (replace create job panel if showing)
   *
   * @param rows selected row(s)
   */
  onSelectionChanged(rows: any[] = []): void {
    setTimeout(() => {
      this._onSelectionChanged(rows)
    }, 0);
  }

  /* expose for junit */
  _onSelectionChanged(rows: any[] = []): void {
    this.selectedJobs = rows;
    this.actionItems = this._getActionItems(rows.length);

    const shouldReset = rows.length > 1 || (rows.length === 0 && !this.isCreateJobShown);
    if (shouldReset) {
      this._resetVisiblePanels();
    }
    if (rows.length === 1) {
      this._closeCreateJobFormWithConfirm(() => {
        this.isFirstRightPanelShown = true;
      });
    }
  }

  onCloseFirstRightSidePanel() {
    this._closeCreateJobFormWithConfirm(() => {
      this._resetVisiblePanels();
    });
  }

  private _initSubscriptions() {
    this.createJobProcessingService.onCancelEvent
      .pipe(takeUntilDestroyed(this))
      .subscribe((cancelled: boolean) => {
        this._cancelJob(cancelled);
      });

    this.deleteJobHandlerService.deleteSuccessEvent
      .pipe(
        filter(id => !!id),
        takeUntilDestroyed(this))
      .subscribe(() => {
        this._handleDeleteSuccess();
      });

    this.deleteJobHandlerService.filteredJobsDeleteSuccessEvent
      .pipe(
        filter(deleteCount => !!deleteCount),
        takeUntilDestroyed(this))
      .subscribe(() => {
        this._handleDeleteSuccess();
      });

    this.jobDetailsFacadeService
      .getJobDuplicated()
      .pipe(takeUntilDestroyed(this))
      .subscribe((success: boolean) => {
        if (success) {
          this.forceReloadTable = true;
          this._resetVisiblePanels();
        }
      });
  }

  /**
   * Delete success
   * Remove all opened navigation tab(s)
   * Clear selected row count. Refresh table.
   */
  private _handleDeleteSuccess() {
    this.selectedJobs.forEach(
      (job) => this.tabsService.removeTab(job.id, false)
    );
    this._clearRowSelection();
    this.forceReloadTable = true;
    this._resetVisiblePanels();
  }

  /* expose for junit testing */
   _cancelJob(cancelled: boolean) {
    if (cancelled && this.isCreateJobShown) {
      this.onCloseFirstRightSidePanel();
    }
  }

  private _resetVisiblePanels() {
    this.isLeftMenuShown = true;
    this.isFirstRightPanelShown = false;
  }

  private _getActionItems(selectedRowCount: number): any[] {

    const { actionItems } = this.jobsTableConfig || {};
    if (selectedRowCount === 0) {
      return [];
    }

    if (selectedRowCount === 1) {
      return actionItems;
    }
    return actionItems.filter(item => item.id === 'delete-job-button-id');
  }

  /* expose for junit testing */
  _onCreateJobButtonClick() {
    if (this.tabsService.canCreateNewTab()) {
      this._clearRowSelection(); // anything in table row no longer has context
      this.isFirstRightPanelShown = true;
      this._setCreateJobShown(true);
    }
  }

  _clearRowSelection() {
    this.table?.clearSelection?.();
    this.selectedJobs = [];
  }

  /**
   * Context button handling for Jobs table
   * @param _appItemAction e.g. AppItemTableButton.DELETE / AppItemTableButton.DUPLICATE
   */
  _contextButtonHandler(_appItemAction: any): void {
    if (this.selectedJobs.length > 0) {
      if (typeof _appItemAction == "string"){
        _appItemAction = [null, _appItemAction];
      }
      this.onTableActionClick(_appItemAction);
    }
  }

  private _setCreateJobShown(enabled: boolean) {
    if (this.isCreateJobShown !== enabled) {
      // i.e. if value changing
      this.isCreateJobShown = enabled;
      this._resetCreateJobIconPath();
    }

    if (enabled) {
      this.rightPanelTitle = this.translateService.instant("createJob.TITLE");
      this.rightPanelSubTitle = this.translateService.instant("createJob.SUBTITLE");
    } else {
      this.rightPanelTitle = this.translateService.instant("navigation.JOB_DETAILS");
      const id = this.selectedJobs[0]?.id || '';
      this.rightPanelSubTitle = this.translateService.instant("ID_UPPER_CASE") + ' - ' + id;
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
          this._setCreateJobShown(!closeForm);
          if (closeForm) {
            callback();
          } else {
            /* cancel press - back to form (with cleared row selection as for any create scenario) */
            this._clearRowSelection();
          }
        });
    } else {
      this._setCreateJobShown(false);
      callback();
    }
  }

  private _getTabNavComponent(): TabNavigationComponent {
    return this.tabsService.getTabNavigationComponent();
  }


  /**
   * Used when not calling a full #_updateJobsTableConfig as need to
   * update the icon button to show active or inactive but without
   * entering back into a get items call (app-item-table-view.component._subscribeToGetItems),
   * as that could cause an auto row selection to be made
   * which would then always show details panel information instead
   * of the create job form
   */
  private _resetCreateJobIconPath(): void {

    if (this.jobsTableConfig) {
      const iconPath = this.isCreateJobShown ? this.createJobIconPathActive : this.createJobIconPath;
      this.jobsTableConfig.iconButtonActions[0].disabled = this.isCreateJobShown;
      this.jobsTableConfig.iconButtonActions[0].iconPath = iconPath;
    }
  }

  private _updateJobsTableConfig() {
    return {
      facadeService: this.jobsFacadeService,
      facadeDetailService: this.jobDetailsFacadeService,
      searchPlaceholder: 'JOB_SEARCH_PLACEHOLDER',
      contextActions: [],
      iconButtonActions: [
        {
          name: 'buttons.CREATE_JOB_TOOLTIP',
          id: 'create-job-icon-button-id',
          iconPath: this.isCreateJobShown ? this.createJobIconPathActive : this.createJobIconPath,
          disabled: this.isCreateJobShown,
          actionHandler: () => {
            this._onCreateJobButtonClick();
          },
          tooltip: 'buttons.CREATE_JOB_TOOLTIP',
        },
      ],
      actionItems: [
        {
          icon: 'duplicate',
          id: 'duplicate-job-button-id',
          label: AppItemTableButton.DUPLICATE,
          handler: this._contextButtonHandler.bind(this),
        },
        {
          icon: 'trashcan',
          id: 'delete-job-button-id',
          label: AppItemTableButton.DELETE,
          handler: this._contextButtonHandler.bind(this),
        },
      ],
    };
  }
}
