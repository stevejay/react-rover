import { roverReducer } from '@/roverReducer';
import { Action, State } from '@/types';

import { createTabStops } from './testUtils';

describe('resetTabStop', () => {
  it('should reset the tab stop to the initial tab stop when it is enabled', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopItem: 'one', shouldFocus: true });
    const action: Action = {
      type: 'resetTabStop',
      payload: { items, itemToElementMap, initialItem: 'two' }
    };
    const result = roverReducer(state, action);
    expect(result).toEqual({ currentTabStopItem: 'two', shouldFocus: false });
  });

  it('should reset the tab stop to the first enabled tab stop when the initial tab stop is disabled', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopItem: 'three', shouldFocus: true });
    const action: Action = {
      type: 'resetTabStop',
      payload: { items, itemToElementMap, initialItem: 'two' }
    };
    const result = roverReducer(state, action);
    expect(result).toEqual({ currentTabStopItem: 'one', shouldFocus: false });
  });

  it('should reset the tab stop to the first enabled tab stop when no initial tab stop is given', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: true }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopItem: 'three', shouldFocus: true });
    const action: Action = {
      type: 'resetTabStop',
      payload: { items, itemToElementMap, initialItem: null }
    };
    const result = roverReducer(state, action);
    expect(result).toEqual({ currentTabStopItem: 'two', shouldFocus: false });
  });
});

describe('updateTabStopOnClick', () => {
  it('should update the current tab stop when the clicked tab stop exists', () => {
    const [items] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopItem: 'one', shouldFocus: true });
    const action: Action = {
      type: 'updateTabStopOnClick',
      payload: { items, newTabStopItem: 'two', shouldFocus: false }
    };
    const result = roverReducer(state, action);
    expect(result).toEqual({ currentTabStopItem: 'two', shouldFocus: false });
  });

  it('should do nothing when the clicked tab stop does not exist', () => {
    const [items] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopItem: 'one', shouldFocus: true });
    const action: Action = {
      type: 'updateTabStopOnClick',
      payload: { items, newTabStopItem: 'unknown', shouldFocus: false }
    };
    const result = roverReducer(state, action);
    expect(result).toBe(state);
  });
});

describe('updateTabStopOnKeyDown', () => {
  it('should update the current tab stop when the selected tab stop exists', () => {
    const [items] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopItem: 'one', shouldFocus: false });
    const action: Action = {
      type: 'updateTabStopOnKeyDown',
      payload: { items, newTabStopItem: 'two' }
    };
    const result = roverReducer(state, action);
    expect(result).toEqual({ currentTabStopItem: 'two', shouldFocus: true });
  });

  it('should do nothing when the selected tab stop does not exist', () => {
    const [items] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopItem: 'one', shouldFocus: false });
    const action: Action = {
      type: 'updateTabStopOnKeyDown',
      payload: { items, newTabStopItem: 'unknown' }
    };
    const result = roverReducer(state, action);
    expect(result).toBe(state);
  });
});
