import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { filter, skip } from 'rxjs';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Job } from 'src/app/models/job.model';
import { JobSchedule } from 'src/app/models/job-schedule.model';
import { JobScheduleDetailsFacadeService } from 'src/app/lib/job-schedule-details/services/job-schedule-details-facade.service';
import { Router } from '@angular/router';
import { ScheduleDetailsConfig } from 'src/app/constants/schedule-details.config';
import { TabsService } from 'src/app/services/tabs/tabs.service';

/**
 * This component shows the Schedule Details panel shown when a schedule
 * is selected in the schedules table.
 */
@UnsubscribeAware()
@Component({
  selector: 'dnr-schedule-details-column-container',
  templateUrl: './schedule-details-column-container.component.html',
})
export class ScheduleDetailsColumnContainerComponent implements OnInit {

  @Input() scheduleId: string;
  @Output() jobSelection = new EventEmitter<Job>();
  @Output() scheduleUpdated = new EventEmitter<JobSchedule>();

  jobSchedule: JobSchedule;
  loading: boolean
  failure: DnrFailure;

  selectableItems = JSON.parse(JSON.stringify(ScheduleDetailsConfig)).selectableItems;  // deep copy

  constructor(
    readonly router: Router,
    readonly scheduleDetailsFacadeService: JobScheduleDetailsFacadeService,
    readonly tabsService: TabsService
  ) { }

  ngOnInit(): void {
    this._initSubscriptions();
    this._loadScheduleDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.scheduleId) {
      this._loadScheduleDetails();
    }
  }

  private _loadScheduleDetails() {
    this.loading = true;
    this._loadSchedule();
  }

  onJobSelection(job: Job) {
    this.jobSelection.emit(job);
  }

  private _loadSchedule() {
    if (this.scheduleId) {
      this.scheduleDetailsFacadeService.loadDetails(this.scheduleId);
    }
  }

  private _initSubscriptions() {
    this.scheduleDetailsFacadeService
      .getJobScheduleEnabledSet()
      .pipe(
        skip(1),
        filter((enabledSet) => enabledSet !== null),
        takeUntilDestroyed(this))
      .subscribe(() => {
        const enabled = !this.jobSchedule.enabled;
        this.jobSchedule = {
          ...this.jobSchedule,
          enabled
        }
        this.scheduleUpdated.emit(this.jobSchedule);
    });

    this.scheduleDetailsFacadeService
      .getJobScheduleDetails()
      .pipe(
        filter(schedule => !!schedule),
        takeUntilDestroyed(this))
      .subscribe((schedule) => {
        this.jobSchedule = schedule;
      });

    this.scheduleDetailsFacadeService
      .getJobScheduleLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.scheduleDetailsFacadeService
      .getJobScheduleFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure) => {
        this.failure = failure;
      });
  }
}
