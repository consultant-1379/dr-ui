import { AppConstants, sessionStorageKeys } from 'src/app/constants';
import { Component, Input, SimpleChanges } from '@angular/core';

import { InformationItemModel } from 'src/app/models/information-item.model';
import { JobSchedule } from 'src/app/models/job-schedule.model';
import { JobScheduleDetailsFacadeService } from 'src/app/lib/job-schedule-details/services/job-schedule-details-facade.service';
import { RbacService } from 'src/app/services/rbac.service';
import { Router } from '@angular/router';
import { RoutingPathContent } from 'src/app/enums/routing-path-content.enum';
import { TableUtilsService } from 'src/app/services/table-utils.service';
import { TranslateService } from "@ngx-translate/core";
import { persistObjectInSessionStore } from 'src/app/utils/session-store.utils';

/***
 * ScheduleDetailColumnViewComponent is to show the schedule's 'General
 * Information' for the inputted schedule.
 *
 * It carries schedule enable component - not needed to subscribe for change, as
 * component will be refreshed
 */
@Component({
  selector: 'dnr-schedule-detail-column-view',
  templateUrl: './schedule-detail-column-view.component.html'
})
export class ScheduleDetailColumnViewComponent {
  @Input() schedule: JobSchedule;

  informationItems: InformationItemModel[];

  enableScheduleComponentName: string = 'dnr-enable-switch';

  constructor(
    readonly jobScheduleDetailsFacadeService: JobScheduleDetailsFacadeService,
    readonly rbacService: RbacService,
    readonly router: Router,
    readonly tableUtils: TableUtilsService<string>,
    readonly translateService: TranslateService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.schedule) {
      this._setDetails();
    }
  }

  onHyperlinkClicked(informationItem: InformationItemModel) {
    const fpId = this.schedule.jobSpecification.featurePackId;
    if (informationItem.label === this.translateService.instant("job.APPLICATION")) {
      this._navigateAway({
        id: fpId,
        applicationId: this.schedule.jobSpecification.applicationId,
        linkAwaySection: "APPLICATIONS"
      }, RoutingPathContent.FeaturePackDetail);
    } else {
      persistObjectInSessionStore(sessionStorageKeys.featurePackId, { [sessionStorageKeys.featurePackId]: fpId });
      this._navigateAway({}, RoutingPathContent.FeaturePacks);
    }
  }

  onComponentEvent(eventData: { value: any, informationItem: InformationItemModel }) {
    if (eventData.informationItem.componentSelectorName === this.enableScheduleComponentName) {
      this._sendCallToEnableSchedule(eventData.value as boolean);
    }
  }

  /**
  * PATCH call to server on enable/disable schedule
  */
  _sendCallToEnableSchedule(isEnable: boolean): void {
    this.jobScheduleDetailsFacadeService.clearFailureState();
    this.jobScheduleDetailsFacadeService.enableJobSchedule(
      this.schedule.id,
      this.schedule.name,
      isEnable, true);
  }

  _setDetails() {
    this.informationItems = [];

    if (!this.schedule) {
      return;
    }

    this.informationItems.push(this._getInfo("schedule.SCHEDULE_NAME", this.schedule.name));
    this.informationItems.push(this._getInfo("schedule.DESCRIPTION", this.schedule.description || AppConstants.undefinedDisplayValue ));

    const cronTooltip = this.translateService.instant('schedule.CRON_DETAIL_TOOLTIP');
    this.informationItems.push(this._getInfo("schedule.CRON", this.schedule.expression, cronTooltip));

    if (this.rbacService.isReadWrite()) {
      const enableScheduleTooltip = this.schedule.enabled ? this.translateService.instant('schedule.DISABLE_TOOLTIP') : this.translateService.instant('schedule.ENABLE_TOOLTIP');

      this.informationItems.push(this._getInfo("schedule.EXECUTION",
        this.schedule.enabled.toString(), // info want strings (server passes boolean)
        enableScheduleTooltip,
        false,
        this.enableScheduleComponentName));
    } else {
      this.informationItems.push(this._getInfo("schedule.EXECUTION", this.tableUtils.getTranslatedEnabled(this.schedule.enabled)));
    }

    this.informationItems.push(this._getInfo("schedule.JOB_NAME", this.schedule.jobSpecification.name || AppConstants.undefinedDisplayValue));
    this.informationItems.push(this._getInfo("schedule.JOB_DESCRIPTION", this.schedule.jobSpecification.description || AppConstants.undefinedDisplayValue));

    const fpTooltip = this._createIdTooltip(this.schedule.jobSpecification.featurePackId);
    this.informationItems.push(this._getInfo("schedule.FEATURE_PACK", this.schedule.jobSpecification.featurePackName, fpTooltip, true));

    const appTooltip = this._createIdTooltip(this.schedule.jobSpecification.applicationId);
    this.informationItems.push(this._getInfo("schedule.APPLICATION", this.schedule.jobSpecification.applicationName, appTooltip, true));

    this.informationItems.push(this._getInfo("schedule.JOB_DEFINITION", this.schedule.jobSpecification.applicationJobName));

    const autoReconciled = this.tableUtils.getTranslatedEnabled(this.schedule.jobSpecification.executionOptions.autoReconcile);
    this.informationItems.push(this._getInfo("schedule.AUTO_RECONCILE", autoReconciled));
  }

  _navigateAway(queryParams: any, routingPath: RoutingPathContent) {
    this.router.navigate([routingPath], {
      queryParams: {
        ...queryParams
      }
    });
  }

  _createIdTooltip(id: string) {
    return this.translateService.instant('ID_UPPER_CASE') + ': ' + id;
  }

  /* not using isBold or isDate in informationItem model */
  _getInfo(label: string, value: string, tooltip: string = null, hyperlink = false, componentSelectorName: string = null): InformationItemModel {
    return {
      label: this.translateService.instant(label),
      value,
      tooltip,
      hyperlink,
      componentSelectorName
    }
  }
}
