import { expect, test } from '@playwright/test';

import { KeyboardNavigation } from './KeyboardNavigation';
import { TextEditorPage } from './TextEditorPage';

test('clicking on a toolbar item when focus is in the text area', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const textEditorPage = new TextEditorPage(page);
  await textEditorPage.goto();

  // Focus on the text area:

  await textEditorPage.textArea.focus();

  // Click on the Copy button:

  await textEditorPage.copyButton.click();

  // Focus should still be on the text area:

  await expect(textEditorPage.textArea).toBeFocused();

  // Tab backwards into the toolbar:

  await keyboard.tabBackwards();
  await expect(textEditorPage.copyButton).toBeFocused();
});

test('clicking on a toolbar item when focus is not in the text area', async ({ page }) => {
  const keyboard = new KeyboardNavigation(page);
  const textEditorPage = new TextEditorPage(page);
  await textEditorPage.goto();

  // Click on the Copy button without first focusing on the text area:

  await textEditorPage.copyButton.click();

  // Focus should be on the copy button:

  await keyboard.tabForwards();
  await keyboard.tabBackwards();
  await expect(textEditorPage.copyButton).toBeFocused();

  //   await expect(textEditorPage.copyButton).toBeFocused();
});
