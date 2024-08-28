import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from "@erad/utils";

import { AppConstants } from 'src/app/constants/app.constants';
import { DateUtilsService } from 'src/app/services/date-utils.service';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Job } from 'src/app/models/job.model';
import { JobsFacadeService } from 'src/app/lib/jobs/services/jobs-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

/**
 * JobsListColumnViewComponent will be used to show
 * list of jobs (name, id, date only)
 * when select:
 * - feature packs table row => application selection => second panel with job definition filter
 * - schedule table row => recent job executions (no job definition - when jobScheduleId defined)
 *
 * (Based upon selected Job -> its details will be shown in next column)
*/
@UnsubscribeAware()
@Component({
  selector: 'dnr-jobs-list-column-view',
  templateUrl: './jobs-list-column-view.component.html',
  styleUrls: ['./jobs-list-column-view.component.scss'],
})
export class JobsListColumnViewComponent implements OnInit, OnChanges {
  @Input() applicationId: string;
  @Input() featurePackId: string;
  @Input() jobScheduleId: string;

  /**
   * Can be used to hide the job definition filter
   * (which is used to update the applicationJobName property)
   */
  @Input() showJobDefinitionFilter?: boolean = false;
  @Output() jobSelection = new EventEmitter<Job>();

  loading = false;
  failure: DnrFailure = null;
  jobs: Job[] = [];
  selectedJob: Job;

  /**
   * This is the same as jobDefinitionName but name used
   * in the context of get Jobs server response
   * (used to filter by jobDefinitionName,
   * if this is populated we are filtering by jobDefinitionName)
   */
  applicationJobName: string = '';

  constructor(readonly translateService: TranslateService,
              readonly jobsFacadeService: JobsFacadeService<Job>,
              readonly dateService: DateUtilsService) {}

  ngOnInit() {
    this._initSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes?.applicationId?.currentValue || changes?.jobScheduleId?.currentValue) {
      this._loadJobsOnChanges();
    }
  }

  formatDateValue(value: string){
    return this.dateService.dateTimeFormat(value);
  }

  onFilterChange(event: any) {
    const jobDefinitionName = event.value.value;
    this.applicationJobName = (jobDefinitionName === AppConstants.allFilterValue) ? '' : jobDefinitionName;
    this._loadJobsOnChanges();
  }

  onJobSelection(job: Job) {
    this.selectedJob = job;
    this.jobSelection.emit(job)
  }

  private _loadJobsOnChanges(): void {
    const filters = this._createFIQLFilters();
    /* filtering (by job definition if set) and sorting jobs by descending startDate */
    const scaledLimitParams = AppConstants.scaledLimitParams;
    this.jobsFacadeService.loadItems({...scaledLimitParams, filters: filters, sort:"-startDate"});
  }

  /**
   * Creates FIQL filters based upon the selected applicationId and applicationJobName
   * @returns filter values with FIQL "and" operator (;)
   *          e.g. "applicationId==some_id;applicationJobName==some_job_definition_name"
   */
  private _createFIQLFilters(): string {
    if (this.jobScheduleId) {
      return `jobScheduleId==${this.jobScheduleId}`;
    } else if (this.applicationId && this.applicationJobName) {
      return `applicationId==${this.applicationId};applicationJobName==${this.applicationJobName}`;
    } else if (this.applicationId) {
      return `applicationId==${this.applicationId}`;
    } else if (this.applicationJobName) {
      return `applicationJobName==${this.applicationJobName}`;
    }
    return '';
  }

  private _initSubscriptions(): void {
    this.jobsFacadeService
      .getItemsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading) =>
        this.loading = loading
      );

    this.jobsFacadeService
      .getItems()
      .pipe(
        filter(jobs => !!jobs),
        takeUntilDestroyed(this))
      .subscribe((jobs) => {
          this.jobs = jobs
      });

    this.jobsFacadeService
      .getItemsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure) =>
        this.failure = failure
      );
  }
}
