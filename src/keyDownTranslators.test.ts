import { mock } from 'jest-mock-extended';

import { extremesNavigation } from './keyDownTranslators';
import { TabStop } from '.';

describe('extremesNavigation', () => {
  it('should navigate to the start', () => {
    const mockEvent = { key: 'Home' } as unknown as React.KeyboardEvent<Element>;
    const tabStops: TabStop[] = [
      { id: 'one', element: mock<HTMLButtonElement>() },
      { id: 'two', element: mock<HTMLButtonElement>() },
      { id: 'three', element: mock<HTMLButtonElement>() }
    ];
    const result = extremesNavigation(mockEvent, tabStops, tabStops[1]);
    expect(result).toEqual({ newTabStopId: 'one' });
  });

  it('should navigate to the end', () => {
    const mockEvent = { key: 'End' } as unknown as React.KeyboardEvent<Element>;
    const tabStops: TabStop[] = [
      { id: 'one', element: mock<HTMLButtonElement>() },
      { id: 'two', element: mock<HTMLButtonElement>() },
      { id: 'three', element: mock<HTMLButtonElement>() }
    ];
    const result = extremesNavigation(mockEvent, tabStops, tabStops[1]);
    expect(result).toEqual({ newTabStopId: 'three' });
  });
});
