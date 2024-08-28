import { Component } from '@angular/core';

/**
 * A class that can be used when a component is required
 * but no implementation is needed.
 */
@Component({
  selector: 'dnr-empty',
  templateUrl: './empty.component.html',
})
export class EmptyComponent {
  // e.g. used as app-routing.module.ts requires a component
}
