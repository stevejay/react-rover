/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { jest } from '@jest/globals';
import { stub } from 'jest-auto-stub';
import { JSDOM } from 'jsdom';

import {
  addTabStopItem,
  findTabStop,
  focusTabStop,
  getIdOfNextEnabledTabStop,
  removeTabStopItem,
  shouldResetCurrentTabStopId
} from '@/tabStopUtils';
import { TabStopsElementMap, TabStopsItems } from '@/types';

import { createTabStops } from './testUtils';

export function createTabStopsFromDOM(domString: string): [TabStopsItems, TabStopsElementMap] {
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

describe('shouldResetCurrentTabStopId', () => {
  it('should return true if there is no current tab stop and there is at least one enabled tab stop', () => {
    const [, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStopsElementMap, null)).toBeTruthy();
  });

  it('should return false if there is no current tab stop and all tab stops are disabled', () => {
    const [, tabStopsElementMap] = createTabStops([
      ['one', { disabled: true }],
      ['two', { disabled: true }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStopsElementMap, null)).toBeFalsy();
  });

  it('should return false if there is no current tab stop and there are no tab stops', () => {
    expect(shouldResetCurrentTabStopId(new Map(), null)).toBeFalsy();
  });

  it('should return false if there is a current tab stop and it still exists', () => {
    const [, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStopsElementMap, 'two')).toBeFalsy();
  });

  it('should return true if there is a current tab stop and it no longer exists', () => {
    const [, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStopsElementMap, 'unknown')).toBeTruthy();
  });

  it('should return true if there is a current tab stop and it exists but it is not enabled', () => {
    const [, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStopsElementMap, 'two')).toBeTruthy();
  });
});

describe('findTabStop', () => {
  it('should return null when the tab stop does not exist', () => {
    const [tabStopsItems] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    expect(findTabStop(tabStopsItems, 'unknown')).toBeNull();
  });

  it('should return null when the tab stop id to find is null', () => {
    const [tabStopsItems] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    expect(findTabStop(tabStopsItems, null)).toBeNull();
  });

  it('should return the tab stop when it exists', () => {
    const [tabStopsItems] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    expect(findTabStop(tabStopsItems, 'one')).toBe('one');
  });
});

describe('focusTabStop', () => {
  it('should focus the tab stop if it exists', () => {
    const [, tabStopsElementMap] = createTabStops([
      ['one', { focus: jest.fn() }],
      ['two', { focus: jest.fn() }]
    ]);
    focusTabStop(tabStopsElementMap, 'two');
    expect(tabStopsElementMap.get('one')!.focus).not.toHaveBeenCalled();
    expect(tabStopsElementMap.get('two')!.focus).toHaveBeenCalled();
  });

  it('should not focus the tab stop if it does not exist', () => {
    const [, tabStopsElementMap] = createTabStops([
      ['one', { focus: jest.fn() }],
      ['two', { focus: jest.fn() }]
    ]);
    focusTabStop(tabStopsElementMap, 'unknown');
    expect(tabStopsElementMap.get('one')!.focus).not.toHaveBeenCalled();
    expect(tabStopsElementMap.get('two')!.focus).not.toHaveBeenCalled();
  });
});

describe('removeTabStopItem', () => {
  it('should remove the tab stop when it exists', () => {
    const [tabStopsItems] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    const result = removeTabStopItem(tabStopsItems, 'two');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual('one');
  });

  it('should not remove the tab stop when it does not exist', () => {
    const [tabStopsItems] = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    const result = removeTabStopItem(tabStopsItems, 'unknown');
    expect(result).toHaveLength(2);
  });
});

describe('getIdOfNextEnabledTabStop', () => {
  it('should handle the current tab stop being unknown', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'unknown', 1, true)).toBeNull();
  });

  it('should handle roving forward with wraparound', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'two', 1, true)).toEqual('three');
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'three', 1, true)).toEqual('one');
  });

  it('should handle roving forward with no wraparound', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'two', 1, false)).toEqual('three');
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'three', 1, false)).toBeNull();
  });

  it('should handle roving forward when there are disabled tab stops', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: false }]
    ]);
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'one', 1, true)).toEqual('three');
  });

  it('should handle roving forward when all other tab stops are disabled', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: true }]
    ]);
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'one', 1, true)).toBeNull();
  });

  it('should handle roving backwards with wraparound', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'two', -1, true)).toEqual('one');
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'one', -1, true)).toEqual('three');
  });

  it('should handle roving backwards with no wraparound', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'two', -1, false)).toEqual('one');
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'one', -1, false)).toBeNull();
  });

  it('should handle roving backwards when there are disabled tab stops', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: false }]
    ]);
    expect(getIdOfNextEnabledTabStop(tabStopsItems, tabStopsElementMap, 'three', -1, true)).toEqual('one');
  });
});

describe('addTabStopItem', () => {
  it('should handle adding at the start of the tab stop list', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStopsFromDOM(`
      <!DOCTYPE html>
      <button id='one' role="radio"></button>
      <button id='two' role="radio"></button>
      <button id='three' role="radio"></button>`);

    const result = addTabStopItem([tabStopsItems[1], tabStopsItems[2]], tabStopsElementMap, 'one');
    expect(result).toEqual(tabStopsItems);
  });

  it('should handle adding in the middle of the tab stop list', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStopsFromDOM(`
    <!DOCTYPE html>
    <button id='one' role="radio"></button>
    <button id='two' role="radio"></button>
    <button id='three' role="radio"></button>`);

    const result = addTabStopItem([tabStopsItems[0], tabStopsItems[2]], tabStopsElementMap, 'two');
    expect(result).toEqual(tabStopsItems);
  });

  it('should handle adding at the end of the tab stop list', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStopsFromDOM(`
    <!DOCTYPE html>
    <button id='one' role="radio"></button>
    <button id='two' role="radio"></button>
    <button id='three' role="radio"></button>`);

    const result = addTabStopItem([tabStopsItems[0], tabStopsItems[1]], tabStopsElementMap, 'three');
    expect(result).toEqual(tabStopsItems);
  });

  it('should handle adding to an empty tab stop list', () => {
    const newElement = stub<HTMLButtonElement>();
    const tabStopsElementMap = new Map([['one', newElement]]);
    const result = addTabStopItem([], tabStopsElementMap, 'one');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual('one');
  });
});
