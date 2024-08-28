import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { EnableSwitchComponent } from './enable-switch.component';

describe('EnableSwitchComponent', () => {
  let component: EnableSwitchComponent;
  let fixture: ComponentFixture<EnableSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnableSwitchComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        {
          provide: TranslateService,
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy tests', () => {
    it('should nullify the switcher', () => {
      // GIVEN
      spyOn(document, 'querySelector').and.returnValue(document.createElement('eui-switch'));
      component.ngAfterViewInit();
      expect(component.switcher).not.toEqual(null)

      // WHEN
      component.ngOnDestroy();

      // THEN
      expect(component.switcher).toEqual(null)
    });
  });

  it('ngDoCheck should initialize the switcher if it is not already initiated', () => {
    // GIVEN
    spyOn(document, 'querySelector').and.returnValue(document.createElement('eui-switch'));
    component.switcher = null;

    // WHEN
    component.ngDoCheck();

    // THEN
    expect(component.switcher).not.toEqual(null)
  });

  describe('onSwitchChange', () => {
    let emitSpy: jasmine.Spy;
    beforeEach(() => {
      emitSpy = spyOn(component.switchChange, 'emit');
    });
    it('should emit a switch change event with false boolean when component.switcher.on = false', () => {
      // GIVEN
      component.switcher.on = false;

      // WHEN
      component.onSwitchChange();

      // THEN
      expect(emitSpy).toHaveBeenCalledWith(false);
    });

    it('should emit a switch change event with false boolean when component.switcher.on = true', () => {
      // GIVEN
      component.switcher.on = true;

      // WHEN
      component.onSwitchChange();

      // THEN
      expect(emitSpy).toHaveBeenCalledWith(true);
    });
  });

});
