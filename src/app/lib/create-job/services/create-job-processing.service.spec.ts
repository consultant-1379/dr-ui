import { TestBed, waitForAsync } from '@angular/core/testing';

import { CreateJobInputModel } from 'src/app/models/create-job-Input.model';
import { CreateJobProcessingService } from './create-job-processing.service';

const createJobInputMock: CreateJobInputModel = {
  applicationDetail: {
    id: 'id1',
    name: 'applicationName',
    description: 'application description'
  },
  item: 2
}

describe('CreateJobService', () => {
  let service: CreateJobProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateJobProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set cancelClickedEvent true onCancel', waitForAsync(() => {
    service.onCancel(true);

    service.onCancelEvent.subscribe(cancelEvent => {
      expect(cancelEvent).toBe(true);
    });
  }));

  it('should set cancelClickedEvent false onCancel', waitForAsync(() => {
    service.onCancel(false);

    service.onCancelEvent.subscribe(cancelEvent => {
      expect(cancelEvent).toBe(false);
    });
  }));

  it('should save inputDataEvent on onSaveInputData', waitForAsync(() => {
    service.onSaveInputData(createJobInputMock);

    service.onInputDataEvent.subscribe(inputDataEvent => {
      expect(inputDataEvent).toBe(createJobInputMock);
    });
  }));

});
