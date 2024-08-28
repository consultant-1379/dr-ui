import { ComponentFixture, TestBed, } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { CreateJobComponent } from '../create-job/create-job.component';
import { CreateJobInformationFormComponent } from '../create-job/create-job-information-form/create-job-information-form.component';
import { CreateScheduleComponent } from './create-schedule.component';
import { CreateScheduleFormComponent } from './create-schedule-form/create-schedule-form.component';
import { DynamicInputsDisplayComponent } from '../dynamic-inputs-display/dynamic-inputs-display.component';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

const RouterSpy = jasmine.createSpyObj(
  'Router',
  ['navigate']
);

describe('CreateScheduleComponent', () => {
  let component: CreateScheduleComponent;
  let fixture: ComponentFixture<CreateScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateScheduleComponent,
        CreateScheduleFormComponent,
        CreateJobComponent,
        CreateJobInformationFormComponent,
        DynamicInputsDisplayComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: RouterSpy
        },
        {
          provide: TranslateService,
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScheduleComponent);
    component = fixture.componentInstance;

    TestBed.inject(NotificationV2Service);
    fixture.detectChanges();

  });

  afterEach(() => {
    fixture.destroy();
  });

  // remaining tests in CreateScheduleFormComponent tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
