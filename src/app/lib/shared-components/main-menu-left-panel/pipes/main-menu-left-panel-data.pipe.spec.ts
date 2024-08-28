import { inputMock, outputMock } from './main-menu-left-panel-data.pipe.mock.data';

import { MainMenuLeftPanelDataPipe } from './main-menu-left-panel-data.pipe';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';

describe('MainMenuLeftPanelDataPipe', () => {
  let mainMenuLeftPanelDataPipe: MainMenuLeftPanelDataPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MainMenuLeftPanelDataPipe },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        }
      ]
    });
  });

  beforeEach(() => {
    mainMenuLeftPanelDataPipe = TestBed.inject(MainMenuLeftPanelDataPipe);
  })

  it(`should create an instance`, () => {
    expect(mainMenuLeftPanelDataPipe).toBeTruthy();
  });

  it(`should transform data correctly`, () => {
    const result = mainMenuLeftPanelDataPipe.transform(inputMock);
    const mockResult = outputMock;
    expect(result).toEqual(mockResult);
  });
});
