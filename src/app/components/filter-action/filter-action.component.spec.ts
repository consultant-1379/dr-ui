import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { FilterActionComponent } from './filter-action.component';

describe('FilterActionComponent', () => {
  let component: FilterActionComponent;
  let fixture: ComponentFixture<FilterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterActionComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isFailedStatus should return true if status is FAILED', () => {
    expect(component.isFailedStatus('FAILED')).toBeTrue();
  });

  it('isFailedStatus should return false if status is not FAILED', () => {
    expect(component.isFailedStatus('NOT_STARTED')).toBeFalse();
  });
});
