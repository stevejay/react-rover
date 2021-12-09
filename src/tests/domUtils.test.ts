import { SyntheticEvent } from 'react';
import { jest } from '@jest/globals';
import { stub } from 'jest-auto-stub';
import { JSDOM } from 'jsdom';

import { callAllEventHandlers, elementIsEnabled, PreventReactRoverDefault } from '@/domUtils';

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

  it('returns false if the element is null', () => {
    expect(elementIsEnabled(null)).toBeFalsy();
  });

  it('returns false if the element is undefined', () => {
    expect(elementIsEnabled()).toBeFalsy();
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

  it('handles null event handlers without erroring', () => {
    const mockEvent = {} as SyntheticEvent;
    callAllEventHandlers(null, null)(mockEvent);
  });

  it('does not call the second event handler if the first handler sets preventReactRoverDefault', () => {
    const handlerOne = jest.fn<void, [SyntheticEvent & PreventReactRoverDefault]>((event) => {
      event.preventReactRoverDefault = true;
    });
    const handlerTwo = jest.fn<void, [SyntheticEvent]>();
    const mockEvent = {} as SyntheticEvent;

    callAllEventHandlers(handlerOne, handlerTwo)(mockEvent);

    expect(handlerOne).toHaveBeenCalledTimes(1);
    expect(handlerOne).toHaveBeenCalledWith(mockEvent);
    expect(handlerTwo).not.toHaveBeenCalled();
  });

  it('does not call the second event handler if the first handler sets preventReactRoverDefault on the native event', () => {
    const handlerOne = jest.fn<void, [SyntheticEvent & { nativeEvent: Event & PreventReactRoverDefault }]>(
      (event) => {
        event.nativeEvent = stub<Event & PreventReactRoverDefault>({
          preventReactRoverDefault: true
        });
      }
    );
    const handlerTwo = jest.fn<void, [SyntheticEvent]>();
    const mockEvent = {} as SyntheticEvent;

    callAllEventHandlers(handlerOne, handlerTwo)(mockEvent);

    expect(handlerOne).toHaveBeenCalledTimes(1);
    expect(handlerOne).toHaveBeenCalledWith(mockEvent);
    expect(handlerTwo).not.toHaveBeenCalled();
  });
});
