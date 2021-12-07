import { jest } from '@jest/globals';
import { stub } from 'jest-auto-stub';
import { JSDOM } from 'jsdom';

import {
  addTabStop,
  findTabStop,
  focusTabStop,
  getNextEnabledTabStop,
  removeTabStop,
  shouldResetCurrentTabStopId
} from './tabStopUtils';
import { createTabStops } from './testUtils';
import { TabStop } from '.';

export function createTabStopsFromDOM(domString: string): TabStop[] {
  const dom = new JSDOM(domString);

  const radioButtonOne = dom.window.document.getElementById('one') as HTMLButtonElement;
  const radioButtonTwo = dom.window.document.getElementById('two') as HTMLButtonElement;
  const radioButtonThree = dom.window.document.getElementById('three') as HTMLButtonElement;

  return [
    { id: 'one', element: radioButtonOne },
    { id: 'two', element: radioButtonTwo },
    { id: 'three', element: radioButtonThree }
  ];
}

describe('shouldResetCurrentTabStopId', () => {
  it('should return true if there is no current tab stop and there is at least one enabled tab stop', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStops, null)).toBeTruthy();
  });

  it('should return false if there is no current tab stop and all tab stops are disabled', () => {
    const tabStops = createTabStops([
      ['one', { disabled: true }],
      ['two', { disabled: true }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStops, null)).toBeFalsy();
  });

  it('should return false if there is no current tab stop and there are no tab stops', () => {
    expect(shouldResetCurrentTabStopId([], null)).toBeFalsy();
  });

  it('should return false if there is a current tab stop and it still exists', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStops, 'two')).toBeFalsy();
  });

  it('should return true if there is a current tab stop and it no longer exists', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStops, 'unknown')).toBeTruthy();
  });

  it('should return true if there is a current tab stop and it exists but it is not enabled', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }]
    ]);
    expect(shouldResetCurrentTabStopId(tabStops, 'two')).toBeTruthy();
  });
});

describe('findTabStop', () => {
  it('should return null if the tab stop does not exist', () => {
    const tabStops = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    expect(findTabStop(tabStops, 'unknown')).toBeNull();
  });

  it('should return null if the tab stop id to find is null', () => {
    const tabStops = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    expect(findTabStop(tabStops, null)).toBeNull();
  });

  it('should return the tab stop if it exists', () => {
    const tabStops = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    expect(findTabStop(tabStops, 'one')).toBe(tabStops[0]);
  });
});

describe('focusTabStop', () => {
  it('should focus the tab stop if it exists', () => {
    const tabStops = createTabStops([
      ['one', { focus: jest.fn() }],
      ['two', { focus: jest.fn() }]
    ]);
    focusTabStop(tabStops, 'two');
    expect(tabStops[0].element.focus).not.toHaveBeenCalled();
    expect(tabStops[1].element.focus).toHaveBeenCalled();
  });

  it('should not focus the tab stop if it does not exist', () => {
    const tabStops = createTabStops([
      ['one', { focus: jest.fn() }],
      ['two', { focus: jest.fn() }]
    ]);
    focusTabStop(tabStops, 'unknown');
    expect(tabStops[0].element.focus).not.toHaveBeenCalled();
    expect(tabStops[1].element.focus).not.toHaveBeenCalled();
  });
});

describe('removeTabStop', () => {
  it('should remove the tab stop when it exists', () => {
    const tabStops = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    const result = removeTabStop(tabStops, 'two');
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual('one');
  });

  it('should not remove the tab stop when it does not exist', () => {
    const tabStops = createTabStops([
      ['one', {}],
      ['two', {}]
    ]);
    const result = removeTabStop(tabStops, 'unknown');
    expect(result).toHaveLength(2);
  });
});

describe('getNextEnabledTabStop', () => {
  it('should handle the current tab stop being unknown', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStop(tabStops, 'unknown', 1, true)).toBeNull();
  });

  it('should handle roving forward with wraparound', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStop(tabStops, 'two', 1, true)).toEqual(tabStops[2]);
    expect(getNextEnabledTabStop(tabStops, 'three', 1, true)).toEqual(tabStops[0]);
  });

  it('should handle roving forward with no wraparound', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStop(tabStops, 'two', 1, false)).toEqual(tabStops[2]);
    expect(getNextEnabledTabStop(tabStops, 'three', 1, false)).toBeNull();
  });

  it('should handle roving forward when there are disabled tab stops', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStop(tabStops, 'one', 1, true)).toEqual(tabStops[2]);
  });

  it('should handle roving forward when all other tab stops are disabled', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: true }]
    ]);
    expect(getNextEnabledTabStop(tabStops, 'one', 1, true)).toBeNull();
  });

  it('should handle roving backwards with wraparound', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStop(tabStops, 'two', -1, true)).toEqual(tabStops[0]);
    expect(getNextEnabledTabStop(tabStops, 'one', -1, true)).toEqual(tabStops[2]);
  });

  it('should handle roving backwards with no wraparound', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStop(tabStops, 'two', -1, false)).toEqual(tabStops[0]);
    expect(getNextEnabledTabStop(tabStops, 'one', -1, false)).toBeNull();
  });

  it('should handle roving backwards when there are disabled tab stops', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStop(tabStops, 'three', -1, true)).toEqual(tabStops[0]);
  });
});

describe('addTabStop', () => {
  it('should handle adding at the start of the tab stop list', () => {
    const tabStops = createTabStopsFromDOM(`
      <!DOCTYPE html>
      <button id='one' role="radio"></button>
      <button id='two' role="radio"></button>
      <button id='three' role="radio"></button>`);

    const result = addTabStop([tabStops[1], tabStops[2]], 'one', tabStops[0].element);
    expect(result).toEqual(tabStops);
  });

  it('should handle adding in the middle of the tab stop list', () => {
    const tabStops = createTabStopsFromDOM(`
    <!DOCTYPE html>
    <button id='one' role="radio"></button>
    <button id='two' role="radio"></button>
    <button id='three' role="radio"></button>`);

    const result = addTabStop([tabStops[0], tabStops[2]], 'two', tabStops[1].element);
    expect(result).toEqual(tabStops);
  });

  it('should handle adding at the end of the tab stop list', () => {
    const tabStops = createTabStopsFromDOM(`
    <!DOCTYPE html>
    <button id='one' role="radio"></button>
    <button id='two' role="radio"></button>
    <button id='three' role="radio"></button>`);

    const result = addTabStop([tabStops[0], tabStops[1]], 'three', tabStops[2].element);
    expect(result).toEqual(tabStops);
  });

  it('should handle adding to an empty tab stop list', () => {
    const newElement = stub<HTMLButtonElement>();
    const result = addTabStop([], 'one', newElement);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual('one');
    expect(result[0].element).toBeDefined();
  });
});
