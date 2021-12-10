import { Page } from '@playwright/test';

export class KeyboardNavigation {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async tabForwards() {
    await this.page.keyboard.press('Tab');
  }

  async tabBackwards() {
    await this.page.keyboard.press('Shift+Tab');
  }

  async rightArrow() {
    await this.page.keyboard.press('ArrowRight');
  }

  async leftArrow() {
    await this.page.keyboard.press('ArrowLeft');
  }

  async upArrow() {
    await this.page.keyboard.press('ArrowUp');
  }

  async downArrow() {
    await this.page.keyboard.press('ArrowDown');
  }

  async home() {
    await this.page.keyboard.press('Home');
  }

  async end() {
    await this.page.keyboard.press('End');
  }

  async ctrlHome() {
    await this.page.keyboard.press('Control+Home');
  }

  async ctrlEnd() {
    await this.page.keyboard.press('Control+End');
  }
}
