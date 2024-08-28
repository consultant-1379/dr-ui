import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ButtonMode } from '@erad/components';

@Component({
  selector: 'dnr-application-information-details',
  templateUrl: './application-information-details.component.html',
  styleUrls: ['./application-information-details.component.scss'],
})
export class ApplicationInformationDetailsComponent {
  buttonMode = ButtonMode;
  @Input() isLoading = false;
  @Input() applicationName: string;
  @Input() applicationId: string;
  @Input() applicationDescription: string;
  @Input() showOutline: boolean = false;
  @Input() selectedApplicationId: string;
  @Output() applicationCardSelect = new EventEmitter<any>();
  constructor(readonly translateService: TranslateService) {}

  onActionHandler() {
    this.applicationCardSelect.emit({
      id: this.applicationId,
      name: this.applicationName,
      description: this.applicationDescription,
    });
  }
}
