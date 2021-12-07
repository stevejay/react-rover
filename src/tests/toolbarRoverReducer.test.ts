import { toolbarRoverReducer } from '@/toolbarRoverReducer';
import { Action, State } from '@/types';

import { createTabStops } from './testUtils';

describe('resetTabStop', () => {
  it('should reset the tab stop to the initial tab stop when it is enabled', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopId: 'one', shouldFocus: true });
    const action: Action = { type: 'resetTabStop', payload: { tabStops, initialTabStopId: 'two' } };
    const result = toolbarRoverReducer(state, action);
    expect(result).toEqual({ currentTabStopId: 'two', shouldFocus: false });
  });

  it('should reset the tab stop to the first enabled tab stop when the initial tab stop is disabled', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopId: 'three', shouldFocus: true });
    const action: Action = { type: 'resetTabStop', payload: { tabStops, initialTabStopId: 'two' } };
    const result = toolbarRoverReducer(state, action);
    expect(result).toEqual({ currentTabStopId: 'one', shouldFocus: false });
  });

  it('should reset the tab stop to the first enabled tab stop when no initial tab stop is given', () => {
    const tabStops = createTabStops([
      ['one', { disabled: true }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopId: 'three', shouldFocus: true });
    const action: Action = { type: 'resetTabStop', payload: { tabStops, initialTabStopId: null } };
    const result = toolbarRoverReducer(state, action);
    expect(result).toEqual({ currentTabStopId: 'two', shouldFocus: false });
  });
});

describe('updateTabStopOnClick', () => {
  it('should update the current tab stop when the clicked tab stop exists', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopId: 'one', shouldFocus: true });
    const action: Action = {
      type: 'updateTabStopOnClick',
      payload: { tabStops, newTabStopId: 'two', shouldFocus: false }
    };
    const result = toolbarRoverReducer(state, action);
    expect(result).toEqual({ currentTabStopId: 'two', shouldFocus: false });
  });

  it('should do nothing when the clicked tab stop does not exist', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopId: 'one', shouldFocus: true });
    const action: Action = {
      type: 'updateTabStopOnClick',
      payload: { tabStops, newTabStopId: 'unknown', shouldFocus: false }
    };
    const result = toolbarRoverReducer(state, action);
    expect(result).toBe(state);
  });
});

describe('updateTabStopOnKeyDown', () => {
  it('should update the current tab stop when the selected tab stop exists', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopId: 'one', shouldFocus: false });
    const action: Action = {
      type: 'updateTabStopOnKeyDown',
      payload: { tabStops, newTabStopId: 'two' }
    };
    const result = toolbarRoverReducer(state, action);
    expect(result).toEqual({ currentTabStopId: 'two', shouldFocus: true });
  });

  it('should do nothing when the selected tab stop does not exist', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const state: State = Object.freeze({ currentTabStopId: 'one', shouldFocus: false });
    const action: Action = {
      type: 'updateTabStopOnKeyDown',
      payload: { tabStops, newTabStopId: 'unknown' }
    };
    const result = toolbarRoverReducer(state, action);
    expect(result).toBe(state);
  });
});
