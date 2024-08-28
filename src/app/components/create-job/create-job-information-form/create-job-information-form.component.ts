import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { TranslateService } from '@ngx-translate/core';
import { CreateJobProcessingService } from 'src/app/lib/create-job/services/create-job-processing.service';
import { FeaturePackDetailsFacadeService } from 'src/app/lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { FeaturePackFacadeService } from 'src/app/lib/feature-packs/services/feature-packs-facade.service';
import { InputConfigDetailsFacadeService } from 'src/app/lib/input-configuration-details/service/input-configuration-details-facade.service';
import { InputConfigsFacadeService } from 'src/app/lib/input-configurations/services/input-configurations-facade.service';
import { JobDetailsFacadeService } from 'src/app/lib/job-detail/services/job-details-facade.service';
import { CreateJobComponent } from '../create-job.component';

/**
 * Create Job Information Form Component
 *
 * Purpose of this class  - is separate out the title for side panel use
 * and allow a two column version of the form to be possible for larger screen size
 */
@Component({
  selector: 'dnr-create-job-information-form',
  templateUrl: './create-job-information-form.component.html',
  styleUrls: ['./create-job-information-form.component.scss']
})
export class CreateJobInformationFormComponent extends CreateJobComponent  {


  @Output() postSubmit = new EventEmitter<any>();
  constructor( // NOSONAR  Constructor has too many parameters. Maximum allowed is 7
    readonly _featurePackDetailsFacadeService: FeaturePackDetailsFacadeService,
    readonly _featurePacksFacadeService: FeaturePackFacadeService,
    readonly _inputConfigsFacadeService: InputConfigsFacadeService,
    readonly _inputConfigDetailsFacadeService:  InputConfigDetailsFacadeService,
    readonly _jobDetailsFacadeService: JobDetailsFacadeService,
    readonly _router: Router,
    readonly _notificationV2Service: NotificationV2Service,
    readonly _translateService: TranslateService,
    readonly _createJobProcessingService: CreateJobProcessingService,

  ) {
    super(
      _featurePackDetailsFacadeService,
      _featurePacksFacadeService,
      _inputConfigsFacadeService,
      _inputConfigDetailsFacadeService,
      _jobDetailsFacadeService,
      _router,
      _notificationV2Service,
      _translateService,
      _createJobProcessingService
    );
    this._createJobProcessingService.onCancel(false);
  }

  // TODO remove this subscription as not used to date
  _subscribeToJobServices() {
    super._subscribeToJobServices((id) => {
      this.postSubmit.emit(id);
    });
  }
}
