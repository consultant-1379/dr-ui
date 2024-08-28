import { ButtonMode } from '@erad/components';
import { Component } from '@angular/core';
import { CreateScheduleComponent } from '../create-schedule.component';
import { JobScheduleDetailsFacadeService } from 'src/app/lib/job-schedule-details/services/job-schedule-details-facade.service';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { TranslateService } from '@ngx-translate/core';

/**
 * Purpose of this class  - is to keep same "pattern" as Create Job Information Form Component,
 * i.e. to separate out the title for side panel use
 * and allow a two column version of the form to be possible for larger screen size
 * (this may prove worthwhile as we know ERAD are working on allowing flyout information
 * to be presented on a full screen)
 */
@Component({
  selector: 'dnr-create-schedule-form',
  templateUrl: './create-schedule-form.component.html',
  styleUrls: ['./create-schedule-form.component.scss']
})
export class CreateScheduleFormComponent extends CreateScheduleComponent {
  buttonMode = ButtonMode;

  constructor(
    readonly _jobScheduleDetailsFacadeService: JobScheduleDetailsFacadeService,
    readonly _notificationV2Service: NotificationV2Service,
    readonly _translateService: TranslateService,
  ) {
    super(
      _jobScheduleDetailsFacadeService,
      _notificationV2Service,
      _translateService
    );
  }
}
