import { stub } from 'jest-auto-stub';

import type { TabStop } from '.';
import { extremesNavigation } from './keyDownTranslators';

describe('extremesNavigation when navigating to the start', () => {
  it('should navigate to the start when all tab stops are enabled', () => {
    const mockEvent = { key: 'Home' } as unknown as React.KeyboardEvent<Element>;
    const tabStops: TabStop[] = [
      { id: 'one', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'two', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'three', element: stub<HTMLButtonElement>({ disabled: false }) }
    ];
    const result = extremesNavigation(mockEvent, tabStops, tabStops[2]);
    expect(result).toEqual({ newTabStopId: 'one' });
  });

  it('should navigate to the first enabled tab stop when there are disabled tab stops', () => {
    const mockEvent = { key: 'Home' } as unknown as React.KeyboardEvent<Element>;
    const tabStops: TabStop[] = [
      { id: 'one', element: stub<HTMLButtonElement>({ disabled: true }) },
      { id: 'two', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'three', element: stub<HTMLButtonElement>({ disabled: false }) }
    ];
    const result = extremesNavigation(mockEvent, tabStops, tabStops[2]);
    expect(result).toEqual({ newTabStopId: 'two' });
  });

  it('should return the current tab stop when it is the first enabled tab stop', () => {
    const mockEvent = { key: 'Home' } as unknown as React.KeyboardEvent<Element>;
    const tabStops: TabStop[] = [
      { id: 'one', element: stub<HTMLButtonElement>({ disabled: true }) },
      { id: 'two', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'three', element: stub<HTMLButtonElement>({ disabled: false }) }
    ];
    const result = extremesNavigation(mockEvent, tabStops, tabStops[1]);
    expect(result).toEqual({ newTabStopId: 'two' });
  });
});

describe('extremesNavigation when navigating to the end', () => {
  it('should navigate to the end when all tab stops are enabled', () => {
    const mockEvent = { key: 'End' } as unknown as React.KeyboardEvent<Element>;
    const tabStops: TabStop[] = [
      { id: 'one', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'two', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'three', element: stub<HTMLButtonElement>({ disabled: false }) }
    ];
    const result = extremesNavigation(mockEvent, tabStops, tabStops[0]);
    expect(result).toEqual({ newTabStopId: 'three' });
  });

  it('should navigate to the last enabled tab stop when there are disabled tab stops', () => {
    const mockEvent = { key: 'End' } as unknown as React.KeyboardEvent<Element>;
    const tabStops: TabStop[] = [
      { id: 'one', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'two', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'three', element: stub<HTMLButtonElement>({ disabled: true }) }
    ];
    const result = extremesNavigation(mockEvent, tabStops, tabStops[0]);
    expect(result).toEqual({ newTabStopId: 'two' });
  });

  it('should return the current tab stop when it is the last enabled tab stop', () => {
    const mockEvent = { key: 'End' } as unknown as React.KeyboardEvent<Element>;
    const tabStops: TabStop[] = [
      { id: 'one', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'two', element: stub<HTMLButtonElement>({ disabled: false }) },
      { id: 'three', element: stub<HTMLButtonElement>({ disabled: true }) }
    ];
    const result = extremesNavigation(mockEvent, tabStops, tabStops[1]);
    expect(result).toEqual({ newTabStopId: 'two' });
  });
});
