import { Observable, of } from 'rxjs';

import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { QueryParams } from 'src/app/models/query.params.model';

/**
 * Table facade Interface
 *
 * (loads all row items)
 */
export class AppItemsFacadeService {
  [x: string]: any;  // TODO doubt if index signature here is necessary
  loadItems(_pageQueryParams: QueryParams) {
    return;
  }
  loading(_appItemsFacadeService: AppItemsFacadeService) {
    return of([]);
  }
  getItemsTotalCount() {
    return of(0);
  }
  getItems() {
    return of([]);
  }
  getItemsLoading() : Observable<boolean> {
    return of(true);
  }
  getItemsFailure(): Observable<DnrFailure> {
    return of(null);
  }
}
