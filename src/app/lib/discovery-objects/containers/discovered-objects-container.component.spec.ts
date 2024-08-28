import {ComponentFixture, TestBed} from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock } from '@erad/core';
import {ErrorType, TranslateServiceMock} from "@erad/utils";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Observable, of } from 'rxjs';

import {ActivatedRoute} from "@angular/router";
import { ApplicationDetailsFacadeService } from '../../application-detail/service/application-details-facade.service';
import { DiscoveredObjects } from 'src/app/models/discovered-objects.model';
import {DiscoveredObjectsContainerComponent} from './discovered-objects-container.component';
import { DiscoveredObjectsStatus } from 'src/app/models/enums/discovered-objects-status.enum';
import { DiscoveredObjectsTableComponent } from 'src/app/components/discovered-objects-table/discovered-objects-table.component';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { JobDetailsFacadeService } from '../../job-detail/services/job-details-facade.service';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReconcileJobDialogComponent } from 'src/app/components/reconcile-job-dialog/reconcile-job-dialog.component';
import { SimpleChanges } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { provideMockStore } from '@ngrx/store/testing';

describe('DiscoveredObjectsContainerComponent', () => {
  let component: DiscoveredObjectsContainerComponent;
  let fixture: ComponentFixture<DiscoveredObjectsContainerComponent>;

  let jobDetailsFacadeService: JobDetailsFacadeService;
  let applicationDetailsFacadeService: ApplicationDetailsFacadeService;

  const jobChange: SimpleChanges = {
    job: {
      currentValue:{id : "2", name: "job 2"},
      firstChange: true,
      previousValue: {id : "3", name: "job 3"},
      isFirstChange() { return true }
    }
  };

  const MatDialogRefSpy = {
    close: () => { },
    afterClosed: () => of(true),
  };

  const mockDiscoveredObject: DiscoveredObjects = {

      objectId: 'string',
      discrepancies: [ 'string' ],
      properties: {},
      status: DiscoveredObjectsStatus.DISCOVERED
   };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscoveredObjectsContainerComponent],
      imports: [
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
        },
        { provide: MatDialogRef, useValue: MatDialogRefSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: { id: "" } }          }
        },{
          provide : DiscoveredObjectsTableComponent
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  })
    ;

    beforeEach(() => {
      fixture = TestBed.createComponent(DiscoveredObjectsContainerComponent);
      component = fixture.componentInstance;

      applicationDetailsFacadeService = TestBed.inject(ApplicationDetailsFacadeService);
      jobDetailsFacadeService = TestBed.inject(JobDetailsFacadeService);
      component.table  = TestBed.inject(DiscoveredObjectsTableComponent);
      fixture.detectChanges();

      spyOn(applicationDetailsFacadeService, 'getApplicationDetails').and.returnValue(new Observable());

      spyOn(jobDetailsFacadeService, 'getJobReconciled').and.returnValue(of(true));
      spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of({
        applicationId: "1",
        featurePackId: "2",
        applicationJobName: "job definition 3",
        name: "job 3",
      }));

    });

  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should handle job changes as expected',  (() => {
      // GIVEN
      component.showButtons = true;
      component.title = 'previous title';
      component.job = {id : "3", name: "job 3"};

      // WHEN
      component.ngOnChanges(jobChange);

      // THEN
      expect(component.job.id).toEqual("2");
      expect(component.job.name).toEqual("job 2");
      expect(component.showButtons).toEqual(false);
      expect(component.title).toEqual( 'job 2 - DISCOVERED_OBJECTS' );
    }));

    it('should set isDetailsPanelShown to false when onCloseDetailsClicked is called', () => {
      component.isDetailsPanelShown = true;
      component.onCloseDetailsClicked();
      expect(component.isDetailsPanelShown).toBeFalse();
    });

    describe('onSelectionChanged', () => {

      it('should set selectedItems, update action buttons and emit itemSelection event when onSelectionChanged is called', () => {

        // GIVEN
        const mockDiscoveredObjects: DiscoveredObjects[] = [mockDiscoveredObject];
        spyOn(component.itemSelection, 'emit');
        spyOn(component, '_getActionItems').and.callThrough();

        // WHEN
        component.onSelectionChanged(mockDiscoveredObjects);

        // THEN
        expect(component.selectedItems).toEqual(mockDiscoveredObjects);
        expect(component.itemSelection.emit).toHaveBeenCalledWith(mockDiscoveredObjects);
        expect(component._getActionItems).toHaveBeenCalled();
      });

      it('should set selectedItems to undefined and emit itemSelection event when onSelectionChanged is called with no argument', () => {

        // GIVEN
        spyOn(component.itemSelection, 'emit');

        // WHEN
        component.onSelectionChanged();

        // THEN
        expect(component.selectedItems).toBeUndefined();
        expect(component.itemSelection.emit).toHaveBeenCalledWith(undefined);
      });

    });

    describe ('reconcile clicked', () => {

      beforeEach(() => {
        component.job = {id : "3", name: "job 3"};
        component.selectedItems = [mockDiscoveredObject];
        spyOn(component, '_subscribeToReconcileResults').and.callThrough();
      });

      it('onReconcileClicked should open ReconcileJobDialogComponent in dialog and subscribeToReconcileResults', (() => {

        // WHEN
        component.onReconcileClicked();
        expect(component._subscribeToReconcileResults).toHaveBeenCalled();

      }));

      it('onReconcileAllClicked should open ReconcileJobDialogComponent in dialog and subscribeToReconcileResults', (() => {

        // WHEN
        component.onReconcileAllClicked();
        expect(component._subscribeToReconcileResults).toHaveBeenCalled();

      }));

    });

    it("onRefreshClicked should emit refreshClicked event", () => {
      spyOn(component.refreshClicked, 'emit');
      component.onRefreshClicked();
      expect(component.refreshClicked.emit).toHaveBeenCalled();
    });

    describe ("onDataLoaded tests", () => {

      it ("onDataLoaded should set showButtons to false when dataLoaded is false", () => {
        component.onDataLoaded(false);
        expect(component.showButtons).toBeFalse();
      });

      it("OnDataLoaded should set showButtons to false when _enableReconcileButtons is false (as per job status COMPLETED)", () => {
        component.job = {id : "3", name: "job 3", status: JobStatus.COMPLETED };
        component.onDataLoaded(true);
        expect(component.showButtons).toBeFalse();
      });

      it("OnDataLoaded should set showButtons to false when _enableReconcileButtons is false (as per job status RECONCILE_INPROGRESS )", () => {
        component.job = {id : "3", name: "job 3", status: JobStatus.RECONCILE_INPROGRESS  };
        component.onDataLoaded(true);
        expect(component.showButtons).toBeFalse();
      });

      it("OnDataLoaded should set showButtons to false when _enableReconcileButtons is false (as per job status RECONCILE_REQUESTED )", () => {
        component.job = {id : "3", name: "job 3", status: JobStatus.RECONCILE_REQUESTED  };
        component.onDataLoaded(true);
        expect(component.showButtons).toBeFalse();
      });

      it("OnDataLoaded should set showButtons to true when _enableReconcileButtons is false (as per job status)", () => {
        component.job = {id : "3", name: "job 3", status: JobStatus.DISCOVERED };
        component.onDataLoaded(true);
        expect(component.showButtons).toBeTrue();
      });

      it("onDataLoaded should set showButtons to true when dataLoaded is true and _enableReconcileButtons is true", () => {
        component['_enableReconcileButtons'] = () => true;
        component.onDataLoaded(true);
        expect(component.showButtons).toBeTrue();
      });

      it("onDataLoaded should call to update action buttons in actions slot", () => {
        spyOn(component, '_getActionItems').and.callThrough();
        component.onDataLoaded(true);
        expect(component._getActionItems).toHaveBeenCalled();
      });
    });

    describe("_getActionItems tests", () => {

      it("should return an empty array when no RBAC write access", () => {
        // GIVEN
        component.hasRbacWriteAccess = false;

        // WHEN
         const actionItems = component._getActionItems();
         // THEN
         expect(actionItems.length).toBe(0);
      });

      it("should return an empty array when showButtons is false", () => {
        // GIVEN
        component.hasRbacWriteAccess = true;
        component.showButtons = false;

          // WHEN
          const actionItems = component._getActionItems();
          // THEN
          expect(actionItems.length).toBe(0);
       });

       it("should only return the default (reconcile all) button when no selected items", () => {
        // GIVEN
        component.hasRbacWriteAccess = true;
        component.showButtons = true;
        component.selectedItems = [];

        // WHEN
        const actionItems = component._getActionItems();

        // THEN
        expect(actionItems.length).toBe(1);
        expect(actionItems[0].label).toBe('RECONCILE_ALL');

       });

       it("should return only show the reconcile button (not the reconcile all button) when selected items are present", () => {
        // GIVEN
        component.hasRbacWriteAccess = true;
        component.showButtons = true;
        component.selectedItems = [mockDiscoveredObject];

        // WHEN
        const actionItems = component._getActionItems();

        // THEN
        expect(actionItems.length).toBe(1);
        expect(actionItems[0].label).toBe('RECONCILE');
       });
    });

    describe ("_subscribeToReconcileResults tests", () => {
      let dialogRef: MatDialogRef<ReconcileJobDialogComponent>;

      beforeEach(() => {
        component.job = {id : "3", name: "job 3", status: JobStatus.DISCOVERED};
        component.table.job = component.job;  // calling through for coverage
        dialogRef = component.openReconcileDialog(true);

        spyOn(component.table, 'clearSelection').and.callThrough();
        spyOn(component.table, 'reloadTableItems').and.callThrough();
        spyOn(component, '_unsubscribeFromDialog').and.callThrough();
        spyOn(component, '_showErrorDialog'); // translate pipe issue if call though

        // GIVEN
        component._subscribeToReconcileResults(dialogRef);
      });

      it("should call _unsubscribeFromDialog and reload table when reconcileSuccess is true", () => {

        // WHEN
        spyOn(component.reconcileStarted, 'emit');
        dialogRef.componentInstance.reconcileSuccess.emit(true);
        // THEN
        expect(component._unsubscribeFromDialog).toHaveBeenCalled();
        expect(component.table.clearSelection).toHaveBeenCalled();
        expect(component.reconcileStarted.emit).toHaveBeenCalled();
      });

      it("should show error as dialog when reconcileLoadingFailure is true",() => {
        // GIVEN
        component.showButtons = false;
        const dnrFailure: DnrFailure = {errorMessage: "error message", type: ErrorType.BackEnd};

        // WHEN
        dialogRef.componentInstance.reconcileLoadingFailure.emit(dnrFailure);

        // THEN
        expect(component._unsubscribeFromDialog).toHaveBeenCalled();
        expect(component.table.reloadTableItems).toHaveBeenCalled();
        expect(component._showErrorDialog).toHaveBeenCalledWith(dnrFailure);
        expect(component.showButtons).toBeTrue();
      });

      it("should set showButtons to false when reconcileOngoing is true", () => {
        // GIVEN
        component.showButtons = true;

        // WHEN
        dialogRef.componentInstance.reconcileOngoing.emit();

        // THEN
        expect(component.showButtons).toBeFalse();
      })

    });
  });
