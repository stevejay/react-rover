/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { jest } from '@jest/globals';
import { stub } from 'jest-auto-stub';
import { JSDOM } from 'jsdom';

import {
  addTabStopItem,
  findTabStopItem,
  focusTabStopItem,
  removeTabStopItem,
  shouldResetCurrentTabStopItem
} from '@/tabStopUtils';
import { ItemList, ItemToElementMap } from '@/types';

import { createTabStops } from './testUtils';

export function createTabStopsFromDOM(domString: string): [ItemList, ItemToElementMap] {
  const dom = new JSDOM(domString);

  const radioButtonOne = dom.window.document.getElementById('one') as HTMLButtonElement;
  const radioButtonTwo = dom.window.document.getElementById('two') as HTMLButtonElement;
  const radioButtonThree = dom.window.document.getElementById('three') as HTMLButtonElement;

  return [
    ['one', 'two', 'three'],
    new Map([
      ['one', radioButtonOne],
      ['two', radioButtonTwo],
      ['three', radioButtonThree]
    ])
  ];
}

describe('shouldResetCurrentTabStopItem', () => {
  it('should return true if there is no current tab stop and there is at least one enabled tab stop', () => {
    const [, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }]
    ]);
    expect(shouldResetCurrentTabStopItem(itemToElementMap, null)).toBeTruthy();
  });

  it('should return false if there is no current tab stop and all tab stops are disabled', () => {
    const [, itemToElementMap] = createTabStops([
      ['one', { disabled: true }],
      ['two', { disabled: true }]
    ]);
    expect(shouldResetCurrentTabStopItem(itemToElementMap, null)).toBeFalsy();
  });

  it('should return false if there is no current tab stop and there are no tab stops', () => {
    expect(shouldResetCurrentTabStopItem(new Map(), null)).toBeFalsy();
  });

  it('should return false if there is a current tab stop and it still exists', () => {
    const [, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }]
    ]);
    expect(shouldResetCurrentTabStopItem(itemToElementMap, 'two')).toBeFalsy();
  });

  it('should return true if there is a current tab stop and it no longer exists', () => {
    const [, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }]
    ]);
    expect(shouldResetCurrentTabStopItem(itemToElementMap, 'unknown')).toBeTruthy();
  });

  it('should return true if there is a current tab stop and it exists but it is not enabled', () => {
    const [, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }]
    ]);
    expect(shouldResetCurrentTabStopItem(itemToElementMap, 'two')).toBeTruthy();
  });
});

describe('findTabStopItem', () => {
  it('should return null when the tab stop does not exist', () => {
    const [items] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    expect(findTabStopItem(items, 'unknown')).toBeNull();
  });

  it('should return null when the tab stop id to find is null', () => {
    const [items] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    expect(findTabStopItem(items, null)).toBeNull();
  });

  it('should return the tab stop when it exists', () => {
    const [items] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    expect(findTabStopItem(items, 'one')).toBe('one');
  });
});

describe('focusTabStopItem', () => {
  it('should focus the tab stop if it exists', () => {
    const [, itemToElementMap] = createTabStops([
      ['one', { focus: jest.fn() }],
      ['two', { focus: jest.fn() }]
    ]);
    focusTabStopItem(itemToElementMap, 'two');
    expect(itemToElementMap.get('one')!.focus).not.toHaveBeenCalled();
    expect(itemToElementMap.get('two')!.focus).toHaveBeenCalled();
  });

  it('should not focus the tab stop if it does not exist', () => {
    const [, itemToElementMap] = createTabStops([
      ['one', { focus: jest.fn() }],
      ['two', { focus: jest.fn() }]
    ]);
    focusTabStopItem(itemToElementMap, 'unknown');
    expect(itemToElementMap.get('one')!.focus).not.toHaveBeenCalled();
    expect(itemToElementMap.get('two')!.focus).not.toHaveBeenCalled();
  });
});

describe('removeTabStopItem', () => {
  it('should remove the tab stop when it exists', () => {
    const [items] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    const result = removeTabStopItem(items, 'two');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual('one');
  });

  it('should not remove the tab stop when it does not exist', () => {
    const [items] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    const result = removeTabStopItem(items, 'unknown');
    expect(result).toHaveLength(2);
  });
});

describe('addTabStopItem', () => {
  it('should handle adding at the start of the tab stop list', () => {
    const [items, itemToElementMap] = createTabStopsFromDOM(`
      <!DOCTYPE html>
      <button id='one' role="radio"></button>
      <button id='two' role="radio"></button>
      <button id='three' role="radio"></button>`);

    const result = addTabStopItem([items[1], items[2]], itemToElementMap, 'one');
    expect(result).toEqual(items);
  });

  it('should handle adding in the middle of the tab stop list', () => {
    const [items, itemToElementMap] = createTabStopsFromDOM(`
    <!DOCTYPE html>
    <button id='one' role="radio"></button>
    <button id='two' role="radio"></button>
    <button id='three' role="radio"></button>`);

    const result = addTabStopItem([items[0], items[2]], itemToElementMap, 'two');
    expect(result).toEqual(items);
  });

  it('should handle adding at the end of the tab stop list', () => {
    const [items, itemToElementMap] = createTabStopsFromDOM(`
    <!DOCTYPE html>
    <button id='one' role="radio"></button>
    <button id='two' role="radio"></button>
    <button id='three' role="radio"></button>`);

    const result = addTabStopItem([items[0], items[1]], itemToElementMap, 'three');
    expect(result).toEqual(items);
  });

  it('should handle adding to an empty tab stop list', () => {
    const newElement = stub<HTMLButtonElement>();
    const itemToElementMap = new Map([['one', newElement]]);
    const result = addTabStopItem([], itemToElementMap, 'one');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual('one');
  });
});
