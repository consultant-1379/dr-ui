import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppConstants, sessionStorageKeys } from 'src/app/constants';

import { Router } from '@angular/router';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { TranslateService } from "@ngx-translate/core";
import { filter } from 'rxjs';
import { RoutingPathContent } from 'src/app/enums/routing-path-content.enum';
import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { InformationItemModel } from 'src/app/models/information-item.model';
import { Job } from 'src/app/models/job.model';
import { persistObjectInSessionStore } from 'src/app/utils/session-store.utils';

/***
 * JobDetailColumnViewComponent is to show the job's 'General Information" for the inputted job.
 * this component will be reused to show job's "General Information" in both job's table and
 * job details (Discovered Object's page) page.
 */
@Component({
  selector: 'dnr-job-detail-column-view',
  templateUrl: './job-detail-column-view.component.html',
})
@UnsubscribeAware()
export class JobDetailColumnViewComponent implements OnInit, OnChanges {
  @Input() job: Job;
  @Input() skipDescription = false;

  informationItems: InformationItemModel[];

  // if FP read fails, then do not add hyperlink to FP.
  // FP details read in job-inputs.
  fpReadFailure: boolean;

  constructor(
    readonly translateService: TranslateService,
    readonly appsFacadeService: ApplicationDetailsFacadeService,
    readonly router: Router
  ) { }

  ngOnInit(): void {
    this.appsFacadeService
      .getApplicationDetailsFailure()
      .pipe(
        filter(failure => !!failure),
        takeUntilDestroyed(this))
      .subscribe(() => {
        this.fpReadFailure = true;
        this._setJobDetails(this.job);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.job) {
      this.fpReadFailure = false;
      this._setJobDetails(this.job);
    }
  }

  onHyperlinkClicked(informationItem: InformationItemModel) {

    switch (informationItem.label) {
      case this.translateService.instant("job.APPLICATION"):

        this._navigateAway({
          id: this.job.featurePackId,
          applicationId: this.job.applicationId,
          linkAwaySection: "APPLICATIONS"
        });
        break;

      case this.translateService.instant("job.FEATURE_PACK"):
        // Open FP table with searching set to the name of item with id = this.job.featurePackId.
        // Send to FP table via session key.
        persistObjectInSessionStore(sessionStorageKeys.featurePackId, { 'featurePackId': this.job.featurePackId });
        this._navigateAway({}, RoutingPathContent.FeaturePacks);
        break;

      case this.translateService.instant("job.SCHEDULE_ID"):
        // Open schedule table with searching set to the name of item with id = this.job.jobScheduleId.
        // Send to schedule table via session key.
        persistObjectInSessionStore(sessionStorageKeys.jobScheduleId, { 'jobScheduleId': this.job.jobScheduleId });
        this._navigateAway({}, RoutingPathContent.SchedulesTable);
        break;

      default:
      /* not linking anywhere */
    }
  }

  _setJobDetails(job: Job) {
    this.job = job;

    this.informationItems = [];

    if (!this.job) {
      return;
    }

    this.informationItems.push(this._getInfo("job.JOB_NAME", job.name));
    this.informationItems.push(this._getInfo("job.STATUS", this._translateStatus(job.status)));

    if (!this.skipDescription) {
      this.informationItems.push(this._getInfo("job.DESCRIPTION", job.description));
    }

    this.informationItems.push(this._getInfo("job.FEATURE_PACK", job.featurePackName, this.job.featurePackId,
      this._shouldShowFeaturePackHyperLinks()));

    this.informationItems.push(this._getInfo("job.APPLICATION", job.applicationName, this.job.applicationId,
      this._shouldShowApplicationsHyperLinks()));

    this.informationItems.push(this._getInfo("job.JOB_DEFINITION", job.applicationJobName));

    this.informationItems.push(this._getInfo("job.SCHEDULE_ID", job.jobScheduleId, null,
      this._shouldShowScheduleIdAsHyperLink(job)));

    if (job.discoveredObjectsCount) {
      this.informationItems.push(this._getInfo("job.DISCOVERED_OBJECTS_COUNT", this._displayNumber(job.discoveredObjectsCount)));
      this.informationItems.push(this._getInfo("job.RECONCILED_OBJECTS_COUNT", this._displayNumber(job.reconciledObjectsCount)));
      this.informationItems.push(this._getInfo("job.RECONCILED_OBJECTS_ERROR_COUNT", this._displayNumber(job.reconciledObjectsErrorCount)));
    }

    if (job.errorMessage) { /* don't need this to be bold */
      // Add a space after comma so it formats on the screen better.
      this.informationItems.push(this._getInfo("ERROR", job.errorMessage.replace(/,\s*/g, ', ')));
    }
  }

  /**
   * Only show the Schedule Id hyperlink when NOT on the Schedule Table page.
   *
   * Do not show Schedule Id as hyperlinks when in the Schedule Table page
   * because that link would link to the current page.
   *
   * @param job job selected from a schedules recent executions,
   *            or job history for feature pack details, or jobs table itself
   * @returns   true if okay to show Schedule ID as hyperlink
   */
  private _shouldShowScheduleIdAsHyperLink(job: Job): boolean {
    return !!job.jobScheduleId &&
      !window.location.href.endsWith(RoutingPathContent.SchedulesTable);
  }

  /**
   * Only show the Feature Pack Id Id as hyperlinks when NOT on the
   * feature pack table OR ON the feature pack details page.
   *
   * Do not show Feature Pack Id as hyperlinks on the table page because the link
   * will bring you right back to the feature pack table.
   * Also see _shouldShowApplicationsHyperLinks.
   *
   * @returns   true if okay to show Feature Pack Id / Application Id as hyperlink
   */
  private _shouldShowFeaturePackHyperLinks(): boolean {
    // I.e. NOT on RoutingPathContent.FeaturePackDetail page
    return (window.location.href.indexOf(RoutingPathContent.FeaturePacks) < 0) &&
      this._shouldShowApplicationsHyperLinks();
  }

  /**
   * Only show the Application Id as hyperlinks when NOT on the feature pack details page.
   *
   * Do not show Feature Pack Id / Application Id as hyperlinks when in the
   * Feature Pack Details screen because the current page already shows information
   * related to Feature Pack / Applications. A link would link to the current page.
   *
   * @returns   true if okay to show Feature Pack Id / Application Id as hyperlink
   */
  private _shouldShowApplicationsHyperLinks(): boolean {
    // I.e. NOT on RoutingPathContent.FeaturePackDetail page
    return window.location.href.indexOf(RoutingPathContent.FeaturePackDetail) < 0;
  }

  /* Job model needs a string */
  private _displayNumber(value: number): string {
    const displayValue = (value)?.toString();
    return typeof displayValue !== 'undefined' ? displayValue : AppConstants.undefinedDisplayValue;
  }

  /**
   * Translate status for job information master panel
   * @param status server value for job status
   * @returns      Translated status if found - else returned server value
   */
  _translateStatus(status: string): string {
    const lookupKey = 'state.' + status; // nested dictionary location
    const result = this.translateService.instant(lookupKey);
    return (result === lookupKey) ? status  : result;
  }

  // Not private for unit test
  _navigateAway(queryParams: any, routingPath: RoutingPathContent = RoutingPathContent.FeaturePackDetail) {
    this.router.navigate([routingPath], {
      queryParams: {
        ...queryParams
      }
    });
  }

  private _getInfo(label: string, value: string, idTooltip = null, hyperlink = false, isBold = false): InformationItemModel {
    if (idTooltip) {
      if (this.fpReadFailure) {
        idTooltip = this.translateService.instant('featurePack.FEATURE_PACK_NO_LONGER_EXISTS', { id: idTooltip });
      } else {
        idTooltip = this.translateService.instant('ID_UPPER_CASE') + ': ' + idTooltip;
      }
    }

    if (this.fpReadFailure) {
      hyperlink = false;
    }

    return {
      label:this.translateService.instant(label),
      value,
      tooltip : idTooltip,
      hyperlink,
      isBold
    }
  }
}
