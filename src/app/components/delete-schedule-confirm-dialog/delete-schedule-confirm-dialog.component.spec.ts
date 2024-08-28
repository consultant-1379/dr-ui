import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { DeleteScheduleConfirmDialogComponent } from './delete-schedule-confirm-dialog.component';
import { MatDialogMock, } from 'src/app/mock-data/testbed-module-mock';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

describe('DeleteScheduleConfirmDialogComponent', () => {
  let component: DeleteScheduleConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteScheduleConfirmDialogComponent>;

  let mockMatDialogRef: MatDialogRef<DeleteScheduleConfirmDialogComponent>;

  const MatDialogRefSpy = {
    close: () => { },
    afterClosed: () => of(true)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteScheduleConfirmDialogComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialog, useValue: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: MatDialogRefSpy },
        provideMockStore(),
        TranslateService
      ]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteScheduleConfirmDialogComponent);
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

  it('should close the dialog when onCancel is called', () => {
    const closeSpy = spyOn(mockMatDialogRef, 'close');
    component.onCancel();
    expect(closeSpy).toHaveBeenCalled();
  });

  describe('onDeleteJobsCheckboxChange', () => {
    it('should set deleteJobsSelected to true when checked', () => {
      component.onDeleteJobsCheckboxChange({ target: { checked: true } });
      expect(component.deleteJobsSelected).toBeTrue();
    });

    it('should set deleteJobsSelected to false when unchecked', () => {
      component.onDeleteJobsCheckboxChange({ target: { checked: false } });
      expect(component.deleteJobsSelected).toBeFalse();
    });
  });

  describe('onDeleteSchedule', () => {
    let emitSpy;
    let closeSpy;

    beforeEach(() => {

      emitSpy = spyOn(component.confirmScheduleDeleteEvent, 'emit');
      closeSpy = spyOn(mockMatDialogRef, 'close');
      component.disableDeleteButton = false;
    });

    it('should emit confirmScheduleDeleteEvent with checkbox choice when true and close the dialog', () => {
      // GIVEN
      component.deleteJobsSelected = true;

      // WHEN
      component.onDeleteSchedule();

      // THEN
      expect(component.disableDeleteButton).toBeTrue();
      expect(emitSpy).toHaveBeenCalledWith({ deleteJobsSelected: true });
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should emit confirmScheduleDeleteEvent with checkbox choice when false and close the dialog', () => {
      // GIVEN
      component.deleteJobsSelected = false;

      // WHEN
      component.onDeleteSchedule();

      // THEN
      expect(component.disableDeleteButton).toBeTrue();
      expect(emitSpy).toHaveBeenCalledWith({ deleteJobsSelected: false });
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});

