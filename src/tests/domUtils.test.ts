import { SyntheticEvent } from 'react';
import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

import { callAllEventHandlers, elementIsEnabled } from '@/domUtils';

describe('elementIsEnabled', () => {
  it('returns true if the element is enabled', () => {
    const dom = new JSDOM('<!DOCTYPE html><button>Test</button>');
    const button = dom.window.document.querySelector('button');
    expect(elementIsEnabled(button)).toBeTruthy();
  });

  it('returns false if the element is not enabled', () => {
    const dom = new JSDOM('<!DOCTYPE html><button disabled>Test</button>');
    const button = dom.window.document.querySelector('button');
    expect(elementIsEnabled(button)).toBeFalsy();
  });
});

describe('callAllEventHandlers', () => {
  it('calls all event handlers', () => {
    const handlerOne = jest.fn<void, [SyntheticEvent]>();
    const handlerTwo = jest.fn<void, [SyntheticEvent]>();
    const mockEvent = {} as SyntheticEvent;

    callAllEventHandlers(handlerOne, handlerTwo)(mockEvent);

    expect(handlerOne).toHaveBeenCalledTimes(1);
    expect(handlerOne).toHaveBeenCalledWith(mockEvent);
    expect(handlerTwo).toHaveBeenCalledTimes(1);
    expect(handlerTwo).toHaveBeenCalledWith(mockEvent);
  });

  it('does not call the second event handler if the first handler sets preventReactRoverDefault', () => {
    const handlerOne = jest.fn<void, [SyntheticEvent & { preventReactRoverDefault?: boolean }]>((event) => {
      event.preventReactRoverDefault = true;
    });
    const handlerTwo = jest.fn<void, [SyntheticEvent]>();
    const mockEvent = {} as SyntheticEvent;

    callAllEventHandlers(handlerOne, handlerTwo)(mockEvent);

    expect(handlerOne).toHaveBeenCalledTimes(1);
    expect(handlerOne).toHaveBeenCalledWith(mockEvent);
    expect(handlerTwo).not.toHaveBeenCalled();
  });
});
