import { expect, test } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('http://localhost:6006/?path=/story/example-button--secondary');
  const button = page.frameLocator('#storybook-preview-iframe').locator('button.storybook-button');
  await expect(button).toHaveText('Button');
});
