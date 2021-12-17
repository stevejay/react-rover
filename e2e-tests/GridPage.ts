import { Locator, Page } from '@playwright/test';

export class GridPage {
  readonly page: Page;
  readonly before: Locator;
  readonly after: Locator;

  constructor(page: Page) {
    this.page = page;
    this.before = this.page.locator('"Focus before"');
    this.after = this.page.locator('"Focus after"');
  }

  async goto(storyId: string) {
    await this.page.goto(`iframe.html?id=${storyId}&args=&viewMode=story`);
  }

  button(labelNumber: number) {
    return this.page.locator(`"${labelNumber}"`);
  }
}
