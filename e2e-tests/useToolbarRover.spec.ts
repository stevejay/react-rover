import { expect, test } from '@playwright/test';

import { KeyboardNavigation } from './KeyboardNavigation';
import { SimpleToolbarPage } from './SimpleToolbarPage';

const basicToolbar = 'toolbar--basic';
const toolbarWithButtonTwoAsInitialTabStop = 'toolbar--with-button-two-as-initial-tab-stop';
const toolbarWithDisabledEndStops = 'toolbar--with-disabled-end-stops';
const toolbarWithDisabledFocusableEndStops = 'toolbar--with-disabled-focusable-end-stops';
const toolbarWithNoWraparound = 'toolbar--with-no-wraparound';
const dynamicToolbar = 'toolbar--dynamic-toolbar';

test('tabbing in and out of a toolbar', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(basicToolbar);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Tab out of the toolbar to the next button:

  await keyboard.tabForwards();
  await expect(toolbarPage.after).toBeFocused();

  // Tab back into the toolbar, which should be to button one:

  await keyboard.tabBackwards();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove to the next tab stop in the toolbar:

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  // Tab out of the toolbar to the after content:

  await keyboard.tabForwards();
  await expect(toolbarPage.after).toBeFocused();

  // Tab back into the toolbar, which should be to button two:

  await keyboard.tabBackwards();
  await expect(toolbarPage.buttonTwo).toBeFocused();
});

test('roving within a toolbar with horizontal navigation', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(basicToolbar);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove forwards and wrap around:

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove backwards and wrap around:

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove to the end:

  await keyboard.end();
  await expect(toolbarPage.buttonThree).toBeFocused();

  // Rove to the start:

  await keyboard.home();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Vertical navigation should have no effect:

  await keyboard.upArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();

  await keyboard.downArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();
});

test('clicking on an enabled tab stop', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(basicToolbar);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Click on an enabled tab stop:

  await toolbarPage.buttonThree.click();

  // Tab forward and then back into the toolbar:

  await keyboard.tabForwards();
  await keyboard.tabBackwards();
  await expect(toolbarPage.buttonThree).toBeFocused();
});

test('clicking on a disabled tab stop', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(toolbarWithDisabledEndStops);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Click on a disabled tab stop:
  // (Forcing as otherwise Playwright will complain that the button is not enabled.)

  await toolbarPage.buttonOne.click({ force: true });

  // Tab forward into the toolbar:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonTwo).toBeFocused();
});

test('initialisation of a toolbar with an initialItem value', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(toolbarWithButtonTwoAsInitialTabStop);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar, which should be to button two:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonTwo).toBeFocused();
});

test('roving when the end tab stops are disabled', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(toolbarWithDisabledEndStops);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar, which should be to button two:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  // Rove forwards:

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonFour).toBeFocused();

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  // Rove backwards:

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonFour).toBeFocused();

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  // Rove to the end:

  await keyboard.end();
  await expect(toolbarPage.buttonFour).toBeFocused();

  // Rove to the start:

  await keyboard.home();
  await expect(toolbarPage.buttonTwo).toBeFocused();
});

test('roving when the end tab stops are disabled but focusable', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(toolbarWithDisabledFocusableEndStops);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar, which should be to button one:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove forwards:

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove backwards:

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove to the end:

  await keyboard.end();
  await expect(toolbarPage.buttonThree).toBeFocused();

  // Rove to the start:

  await keyboard.home();
  await expect(toolbarPage.buttonOne).toBeFocused();
});

test('roving within a toolbar with no wraparound', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(toolbarWithNoWraparound);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove forwards without wraparound:

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();

  // Rove backwards without wraparound:

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();

  await keyboard.leftArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove to the end:

  await keyboard.end();
  await expect(toolbarPage.buttonThree).toBeFocused();

  // Rove to the start:

  await keyboard.home();
  await expect(toolbarPage.buttonOne).toBeFocused();
});

// TODO test the dynamic toolbar

test('the rover handles the current tab stop becoming disabled', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(dynamicToolbar);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove to button three:

  await keyboard.rightArrow();
  await keyboard.rightArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();

  // Click on the 'Disable Button Three' button:

  await page.locator('"Disable Button Three"').click();

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Check the rover still wraps around correctly:

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();
  await keyboard.rightArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();
});

test('the rover handles the current tab stop disappearing', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const toolbarPage = new SimpleToolbarPage(page);
  await toolbarPage.goto(dynamicToolbar);

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Rove to button two:

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonTwo).toBeFocused();

  // Click on the 'Hide Button Two' button:

  await page.locator('"Delete Button Two"').click();

  // Focus on the before content:

  await toolbarPage.before.focus();

  // Tab forward into the toolbar:

  await keyboard.tabForwards();
  await expect(toolbarPage.buttonOne).toBeFocused();

  // Check the rover still wraps around correctly:

  await keyboard.rightArrow();
  await expect(toolbarPage.buttonThree).toBeFocused();
  await keyboard.rightArrow();
  await expect(toolbarPage.buttonOne).toBeFocused();
});
