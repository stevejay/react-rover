import { expect, test } from '@playwright/test';

import { GridPage } from './GridPage';
import { KeyboardNavigation } from './KeyboardNavigation';

const basicToolbar = 'grid--small-grid';

test('tabbing in and out of a grid', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const gridPage = new GridPage(page);
  await gridPage.goto(basicToolbar);

  // Focus on the before content:

  await gridPage.before.focus();

  // Tab forward into the grid:

  await keyboard.tabForwards();
  await expect(gridPage.button(2)).toBeFocused();

  // Tab out of the grid to the next button:

  await keyboard.tabForwards();
  await expect(gridPage.after).toBeFocused();

  // Tab back into the grid:

  await keyboard.tabBackwards();
  await expect(gridPage.button(2)).toBeFocused();

  // Rove to the next tab stop in the grid:

  await keyboard.rightArrow();
  await expect(gridPage.button(3)).toBeFocused();

  // Tab out of the grid to the after content:

  await keyboard.tabForwards();
  await expect(gridPage.after).toBeFocused();

  // Tab back into the grid:

  await keyboard.tabBackwards();
  await expect(gridPage.button(3)).toBeFocused();
});

test('roving within a grid', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const gridPage = new GridPage(page);
  await gridPage.goto(basicToolbar);

  // Focus on the before content:

  await gridPage.before.focus();

  // Tab forward into the grid:

  await keyboard.tabForwards();
  await expect(gridPage.button(2)).toBeFocused();

  // Tab to the extremes:

  await keyboard.ctrlEnd();
  await expect(gridPage.button(10)).toBeFocused();

  await keyboard.ctrlHome();
  await expect(gridPage.button(1)).toBeFocused();

  // Tab in a square around the disabled button:

  await keyboard.rightArrow();
  await expect(gridPage.button(2)).toBeFocused();
  await keyboard.rightArrow();
  await expect(gridPage.button(3)).toBeFocused();
  await keyboard.downArrow();
  await expect(gridPage.button(6)).toBeFocused();
  await keyboard.downArrow();
  await expect(gridPage.button(9)).toBeFocused();
  await keyboard.leftArrow();
  await expect(gridPage.button(8)).toBeFocused();
  await keyboard.leftArrow();
  await expect(gridPage.button(7)).toBeFocused();
  await keyboard.upArrow();
  await expect(gridPage.button(4)).toBeFocused();
  await keyboard.upArrow();
  await expect(gridPage.button(1)).toBeFocused();

  // Tab to the current row extremes:

  await keyboard.end();
  await expect(gridPage.button(3)).toBeFocused();

  await keyboard.home();
  await expect(gridPage.button(1)).toBeFocused();
});
