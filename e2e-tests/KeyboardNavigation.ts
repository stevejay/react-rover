import { Page } from '@playwright/test';

export class KeyboardNavigation {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async tabForwards() {
    await this.page.locator(':focus').press('Tab');
  }

  async tabBackwards() {
    await this.page.locator(':focus').press('Shift+Tab');
  }

  async rightArrow() {
    await this.page.locator(':focus').press('ArrowRight');
  }

  async leftArrow() {
    await this.page.locator(':focus').press('ArrowLeft');
  }

  async upArrow() {
    await this.page.locator(':focus').press('ArrowUp');
  }

  async downArrow() {
    await this.page.locator(':focus').press('ArrowDown');
  }

  async home() {
    await this.page.locator(':focus').press('Home');
  }

  async end() {
    await this.page.locator(':focus').press('End');
  }
}
