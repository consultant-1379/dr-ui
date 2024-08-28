import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock } from '@erad/core';

import { AppItemActionsComponent } from './app-item-actions.component';
import { RbacService } from 'src/app/services/rbac.service';
import { RbacServiceMock } from 'src/app/services/rbac.service.mock';

describe('AppItemActionsComponent', () => {
  let component: AppItemActionsComponent;
  let fixture: ComponentFixture<AppItemActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppItemActionsComponent],
      providers: [
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
        },
        {
          provide: RbacService,
          useClass: RbacServiceMock
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppItemActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onActionsClicked method execution should emit contextActionClicked event to parent', () => {
    spyOn(component.contextActionClicked, 'emit');
    component.onActionsClicked(null);

    expect(component.contextActionClicked.emit).toHaveBeenCalled();
  });

  describe('userHasAccess', () => {
    it('should return true if isActionForAdminOnly is true and hasAdminAccess is true', () => {
      component.isActionForAdminOnly = true;
      component.hasAdminAccess = true;

      expect(component.userHasAccess()).toBeTrue();
    });

    it('should return true if isActionForAdminOnly is false and hasRbacWriteAccess is true', () => {
      component.isActionForAdminOnly = false;
      component.hasRbacWriteAccess = true;

      expect(component.userHasAccess()).toBeTrue();
    });

    it('should return false if isActionForAdminOnly is true and hasAdminAccess is false', () => {
      component.isActionForAdminOnly = true;
      component.hasAdminAccess = false;

      expect(component.userHasAccess()).toBeFalse();
    });

    it('should return false if isActionForAdminOnly is false and hasRbacWriteAccess is false', () => {
      component.isActionForAdminOnly = false;
      component.hasRbacWriteAccess = false;

      expect(component.userHasAccess()).toBeFalse();
    });

  });
});
