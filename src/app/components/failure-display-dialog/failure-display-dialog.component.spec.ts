import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';

import { FailureDisplayDialogComponent } from './failure-display-dialog.component';
import { MatDialogMock } from 'src/app/mock-data/testbed-module-mock';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

const MatDialogRefSpy = {
  close: () => { },
  afterClosed: () => of(true)
};

describe('FailureDisplayDialogComponent', () => {
  let component: FailureDisplayDialogComponent;
  let fixture: ComponentFixture<FailureDisplayDialogComponent>;
  let mockMatDialogRef: MatDialogRef<FailureDisplayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FailureDisplayDialogComponent],
      imports: [TranslateModuleMock],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: MatDialogMock },
        { provide: MatDialogRef, useValue: MatDialogRefSpy },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureDisplayDialogComponent);
    component = fixture.componentInstance;
    mockMatDialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when onClose is called', () => {
    const closeSpy = spyOn(mockMatDialogRef, 'close');
    component.onClose();
    expect(closeSpy).toHaveBeenCalled();
  });
});
