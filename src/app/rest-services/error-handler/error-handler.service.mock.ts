import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerServiceMock {

  handleError() {
    return of(null);
  }

}
