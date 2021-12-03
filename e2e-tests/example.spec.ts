import { expect, FrameLocator, test } from '@playwright/test';

async function tabForwards(frame: FrameLocator) {
  await frame.locator(':focus').press('Tab');
}

async function tabBackwards(frame: FrameLocator) {
  await frame.locator(':focus').press('Shift+Tab');
}

async function pressRightArrow(frame: FrameLocator) {
  await frame.locator(':focus').press('ArrowRight');
}

async function pressLeftArrow(frame: FrameLocator) {
  await frame.locator(':focus').press('ArrowLeft');
}

async function pressHome(frame: FrameLocator) {
  await frame.locator(':focus').press('Home');
}

async function pressEnd(frame: FrameLocator) {
  await frame.locator(':focus').press('End');
}

test('tabbing in and out of the toolbar', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/toolbar--basic');

  const frame = page.frameLocator('#storybook-preview-iframe').first();
  const focusBeforeButton = frame.locator('"Focus before"');
  const focusAfterButton = frame.locator('"Focus after"');
  const buttonOne = frame.locator('"One"');
  const buttonTwo = frame.locator('"Two"');

  // Focus on the before button:

  await focusBeforeButton.focus();

  // Tab forward into the toolbar:

  await tabForwards(frame);
  await expect(buttonOne).toBeFocused();

  // Tab out of the toolbar to the next button:

  await tabForwards(frame);
  await expect(focusAfterButton).toBeFocused();

  // Tab back into the toolbar, which should be to button one:

  await tabBackwards(frame);
  await expect(buttonOne).toBeFocused();

  // Rove to the next tab stop in the toolbar:

  await pressRightArrow(frame);
  await expect(buttonTwo).toBeFocused();

  // Tab out of the toolbar to the next button:

  await tabForwards(frame);
  await expect(focusAfterButton).toBeFocused();

  // Tab back into the toolbar, which should be to button two:

  await tabBackwards(frame);
  await expect(buttonTwo).toBeFocused();
});

test('roving within the toolbar', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/toolbar--basic');

  const frame = page.frameLocator('#storybook-preview-iframe').first();
  const focusBeforeButton = frame.locator('"Focus before"');
  const buttonOne = frame.locator('"One"');
  const buttonTwo = frame.locator('"Two"');
  const buttonThree = frame.locator('"Three"');

  // Focus on the before button:

  await focusBeforeButton.focus();

  // Tab forward into the toolbar:

  await tabForwards(frame);
  await expect(buttonOne).toBeFocused();

  // Rove forwards and wrap around:

  await pressRightArrow(frame);
  await expect(buttonTwo).toBeFocused();

  await pressRightArrow(frame);
  await expect(buttonThree).toBeFocused();

  await pressRightArrow(frame);
  await expect(buttonOne).toBeFocused();

  // Rove backwards and wrap around:

  await pressLeftArrow(frame);
  await expect(buttonThree).toBeFocused();

  await pressLeftArrow(frame);
  await expect(buttonTwo).toBeFocused();

  await pressLeftArrow(frame);
  await expect(buttonOne).toBeFocused();

  // Rove to the end:

  await pressEnd(frame);
  await expect(buttonThree).toBeFocused();

  // Rove to the start:

  await pressHome(frame);
  await expect(buttonOne).toBeFocused();
});
