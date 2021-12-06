import { Locator, Page } from '@playwright/test';

export class TextEditorPage {
  readonly page: Page;
  readonly textArea: Locator;
  readonly copyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.textArea = this.page.locator('#text-area');
    this.copyButton = this.page.locator('"Copy"');
  }

  async goto() {
    await this.page.goto(`iframe.html?id=toolbar--text-editor&args=&viewMode=story`);
  }
}
