import { Component, Input } from '@angular/core';

/**
 * Component to display each filter in the filters sections
 * of DiscoveredObject object, i.e.
 *
 *   "filters": [
 *      {
 *        "name": "string",
 *        "reconcileAction": {
 *            "name": "string",
 *            "status": "NOT_STARTED",  // 	Action (filter) States: [NOT_STARTED, INPROGRESS, COMPLETED, FAILED]
 *            "command": "string",
 *            "commandOutput": "string",
 *            "errorMessage": "string"
 *      }
 *    }
 *  ],
 *
 * Will not display a label for errorMessage if no errorMessage is present in the filter response.
 */
@Component({
  selector: 'dnr-filter-action',
  templateUrl: './filter-action.component.html',
  styleUrls: ['./filter-action.component.scss']
})
export class FilterActionComponent {

  @Input() filterName: string;
  @Input() reconcileActionName: string;
  @Input() status: string;
  @Input() command: string;
  @Input() commandOutput: string;
  @Input() errorMessage: string;

  isFailedStatus(status: string) {
    return status === 'FAILED';
  }
}
