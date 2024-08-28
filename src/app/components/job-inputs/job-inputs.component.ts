import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { Job } from 'src/app/models/job.model';

/**
 * This component shows job inputs.
 * The inputs returned from the server in job.inputs could
 * contain both the discovery inputs and the reconcile inputs all mixed
 * up together.
 * Therefore need to get the Application Details for the feature pack
 * application that was used to create the Job.
 * The Application Details contains the list of discovery and reconcile inputs.
 * This can then be used to determine which inputs were discovery inputs
 * and which were reconcile inputs.
 *
 * Note: If a reconcile had not been ordered, then there will be no reconcile
 * inputs.
 */
@Component({
  selector: 'dnr-job-inputs',
  templateUrl: './job-inputs.component.html',
  styleUrls: ['./job-inputs.component.scss']
})
@UnsubscribeAware()
export class JobInputsComponent implements OnInit, OnChanges {

  @Input() job: Job;
  // showColumns - shows the job inputs/reconcile headers in a left column and values
  // to the right. Otherwise header will be shown above the values in a single column.
  @Input() showColumns: boolean;

  loading: boolean;
  inputsFound: boolean = true;
  failure: DnrFailure;

  discoveryInputs: string[];
  reconcileInputs: string[];

  constructor(private appsFacadeService: ApplicationDetailsFacadeService) {
  }

  ngOnInit(): void {
    this._initSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.job && this.job) {
      this.loading = true;
      this.appsFacadeService.loadApplicationDetails(this.job.featurePackId, this.job.applicationId);
    }
  }

  // public for unit tests.
  _initSubscriptions() {
    this.appsFacadeService
      .getApplicationDetails()
      .pipe(takeUntilDestroyed(this))
      .subscribe((res) => {
        if (this.job && res?.jobs) {
          this._separateInputs(res.jobs);
        }
      });

    this.appsFacadeService
      .getApplicationDetailsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        if (failure) {
          this.loading = false;
          this.failure = failure;
        }
      });
  }

  // Find the Application job data that the current job was created with.
  // Then find the reconcile inputs and separate the current job's inputs
  // into discoveryInputs and reconcileInputs.
  private _separateInputs(jobs) {
    this.failure = null;
    this.loading = false;

    const reconcileInputNames = this._getReconcileInputNames(jobs);

    this.discoveryInputs = this._getDiscoveryInputs(reconcileInputNames);
    this.reconcileInputs = this._getReconcileInputs(reconcileInputNames);

    this.inputsFound = (this.discoveryInputs.length > 0 || this.reconcileInputs.length > 0);
  }

  private _getReconcileInputNames(jobs) {
    return (jobs
      .find(job => job.name === this.job?.applicationJobName)?.reconcile?.inputs)
        ?.map(input => input.name) || [];
  }

  private _getDiscoveryInputs(reconcileNames) {
    const inputs = this.job.inputs || [];
    return Object.keys(inputs)
      .filter(name => !reconcileNames.includes(name))
      .map((name) => (name + ": " + inputs[name]));
  }

  private _getReconcileInputs(reconcileNames) {
    const inputs = this.job.inputs || [];
    return Object.keys(inputs)
    .filter(name => reconcileNames.includes(name))
    .map((name) => (name + ": " + inputs[name]));
  }
}
