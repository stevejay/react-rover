import { Locator, Page } from '@playwright/test';

export class SimpleToolbarPage {
  readonly page: Page;
  readonly before: Locator;
  readonly after: Locator;
  readonly buttonOne: Locator;
  readonly buttonTwo: Locator;
  readonly buttonThree: Locator;
  readonly buttonFour: Locator;
  readonly buttonFive: Locator;

  constructor(page: Page) {
    this.page = page;
    this.before = this.page.locator('"Focus before"');
    this.after = this.page.locator('"Focus after"');
    this.buttonOne = this.page.locator('"One"');
    this.buttonTwo = this.page.locator('"Two"');
    this.buttonThree = this.page.locator('"Three"');
    this.buttonFour = this.page.locator('"Four"');
    this.buttonFive = this.page.locator('"Five"');
  }

  async goto(storyId: string) {
    await this.page.goto(`iframe.html?id=${storyId}&args=&viewMode=story`);
  }
}
