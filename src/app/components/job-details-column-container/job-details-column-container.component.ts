import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { CollapsibleItem } from '@erad/components/collapsible-item';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Job } from 'src/app/models/job.model';
import { JobDetailsConfig } from 'src/app/components/job-details-column-container/job-details.config';
import { JobDetailsFacadeService } from 'src/app/lib/job-detail/services/job-details-facade.service';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { Router } from '@angular/router';
import { RoutingPathContent } from 'src/app/enums/routing-path-content.enum';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { filter } from 'rxjs';

@Component({
  selector: 'dnr-job-details-column-container',
  templateUrl: './job-details-column-container.component.html'
})
@UnsubscribeAware()
export class JobDetailsColumnContainerComponent implements OnInit, OnChanges {

  @Input() jobId: string;
  @Input() skipDescription: boolean;
  @Input() highlightAccordionHeaders: boolean = false;
  @Input() showObjectsLink: boolean = true;

  @Output() accordionHeaderClick = new EventEmitter<string>();

  job: Job;
  loading: boolean
  failure: DnrFailure;
  selectableItems: CollapsibleItem[];

  constructor(
    readonly router: Router,
    readonly jobDetailsFacadeService: JobDetailsFacadeService,
    readonly tabsService: TabsService
  ) { }

  ngOnInit(): void {
    this.selectableItems = this._getDefaultSelectableItems();

    this._initSubscriptions();
    this._loadJobDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobId) {
      this._loadJobDetails();
    }
  }

  private _loadJobDetails() {
    this.loading = true;
    if (this.jobId) {
      this.jobDetailsFacadeService.loadDetails(this.jobId);
    }
  }

  onLinkAwayToDiscoveredObjects(linkAwaySection: string) {
    if (this.tabsService.canOpenTab(this.job.id, false)) {
      const id = this.job.id;
      this.router.navigate(
        [RoutingPathContent.JobDetail],
        { queryParams: { id, linkAwaySection } });
    }
  }

  onAccordionHeaderClicked(id: string): void {
    this.accordionHeaderClick.emit(id);
  }

  _initSubscriptions() {

    this.jobDetailsFacadeService
      .getJobDetails()
      .pipe(
        filter(job => !!job),
        takeUntilDestroyed(this))
      .subscribe((job) => {
        this.job = job;
        this._hideObjectsAccordionIfDiscoveryFailed();
      });

    this.jobDetailsFacadeService
      .getJobDetailsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.jobDetailsFacadeService
      .getJobDetailsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure) => {
        this.failure = failure;
      });
  }

  /* expose for junit testing */
  // Right Panel details 'Objects' should be hidden if  DISCOVERY_FAILED.
  _hideObjectsAccordionIfDiscoveryFailed() {
    if (this.job?.status === JobStatus.DISCOVERY_FAILED) {
      const selectableItems = this.selectableItems;
      const objectsIndex = selectableItems.findIndex(item => item.id === 'OBJECTS');
      if (objectsIndex >= 0) {
        selectableItems.splice(objectsIndex, 1);
        // Need to change selectableItems array reference to force re-rendering
        this.selectableItems = [...selectableItems];
      }
    } else {
      // Reset Right hand to default config. Deep copy so updating it does not
      // overwrite base (default) values.
      this.selectableItems = this._getDefaultSelectableItems();
    }
  }

  private _getDefaultSelectableItems() {
    const selectableItems = JSON.parse(JSON.stringify(JobDetailsConfig)).selectableItems;  // deep copy
    if (!this.showObjectsLink) {
      // E.g. In the Job Details (Discovered Objects) page, do not show the link away icon to
      // OBJECTS as we're already on the Objects page.
      selectableItems.find(config => config.id === 'OBJECTS').showNavigationIcon = false;
    }
    return selectableItems;
  }
}
