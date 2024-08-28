import { setConfirmDialogPrimaryButtonToRed }  from './common.utils';

describe('setConfirmDialogPrimaryButtonToRed', () => {

  it('should set the second button to red and assign the id', () => {

    const button1 = document.createElement('erad-button');
    const button2 = document.createElement('erad-button');
    document.body.appendChild(button1);
    document.body.appendChild(button2);

    // WHEN
    setConfirmDialogPrimaryButtonToRed();

    // THEN
    expect(button2.classList.contains('destructive')).toBe(true);
    expect(button2.id).toBe('primary-dialog-button-id');

    document.body.removeChild(button1);
    document.body.removeChild(button2);
  });

  it('should do nothing if there are not exactly two buttons', () => {

    const button1 = document.createElement('erad-button');
    document.body.appendChild(button1);

    // WHEN
    setConfirmDialogPrimaryButtonToRed();

    // Assert: check that no changes are made
    expect(button1.classList.contains('destructive')).toBe(false);
    expect(button1.id).toBe('');

    document.body.removeChild(button1);
  });
});
