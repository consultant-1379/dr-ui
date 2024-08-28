import { Component, Input } from '@angular/core';

import { DnrFailure } from '../../models/dnr-failure.model';

/**
 * Display an error message with an error code,
 * e.g. for inline error messages
 *
 * NOTE: Sanitizing checks for XSS attacks, coming in through the errorMessage
 * or error code, are not required as angular is sanitizing the input for us,
 * any script tags are automatically removed from the received Failure input strings
 */
@Component({
  selector: 'dnr-failure-display',
  templateUrl: './failure-display.component.html',
  styleUrls: ['./failure-display.component.scss']
})
export class FailureDisplayComponent {

  @Input()
  failure: DnrFailure = null;

}
