import { Component, Input } from '@angular/core';


@Component({
  selector: 'dnr-application-information-details',
  template: '<div>ApplicationInformationDetailsComponentMock</div>'
})

export class ApplicationInformationDetailsComponentMock {

  @Input() isLoading = false;
  @Input() applicationName: string;
  @Input() applicationId: string;
  @Input() applicationDescription: string;

}
