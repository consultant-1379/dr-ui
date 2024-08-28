import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureDisplayComponent } from './failure-display.component';

describe('FailureDisplayComponent', () => {
  let component: FailureDisplayComponent;
  let fixture: ComponentFixture<FailureDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailureDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
