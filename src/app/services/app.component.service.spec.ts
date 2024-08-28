import { TestBed } from '@angular/core/testing';
import { AppComponentService } from './app.component.service';

describe('AppComponentService', () => {
  let appComponentService: AppComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppComponentService],
    });
    appComponentService = TestBed.inject(AppComponentService);
  });

  it('should create the service', () => {
    expect(appComponentService).toBeTruthy();
  });

  it('should return a breadcrumb for job detail URL', () => {
    //GIVEN
    const labels = {
      jobsDetailLabel: 'Job details',
      featurePacksDetailLabel: 'Feature pack details',
      browseLabel: 'Browse'
    };
    const breadCrumbJobsMock = [
      {
        "label": "Browse"
      },
      {
        "label": "Job details"
      }
    ];
    const encodedUrl = '/job-detail?id=12345&linkAwaySection=OBJECTS';

    //WHEN
    const result = appComponentService.getBreadcrumb(encodedUrl, labels);

    //THEN
    expect(result).toEqual(breadCrumbJobsMock);
  });

  it('should return a breadcrumb for feature pack detail URL', () => {
    //GIVEN
    const labels = {
      jobsDetailLabel: 'Job details',
      featurePacksDetailLabel: 'Feature pack details',
      browseLabel: 'Browse',
    };
    const breadCrumbFeaturePacksMock = [
      {
        "label": "Browse"
      },
      {
        "label": "Feature pack details"
      }
    ];
    const encodedUrl = '/feature-pack-detail?id=96&linkAwaySection=APPLICATIONS';

    //WHEN
    const result = appComponentService.getBreadcrumb(encodedUrl, labels);

    //THEN
    expect(result).toEqual(breadCrumbFeaturePacksMock);
  });

});
