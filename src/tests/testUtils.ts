import { stub } from 'jest-auto-stub';

import { TabStop, TabStopId } from '@/types';

export function createTabStops(tabStops: [TabStopId, Partial<HTMLButtonElement>][]): TabStop[] {
  return tabStops.map((tabStop) => ({
    id: tabStop[0],
    element: stub<HTMLButtonElement>(tabStop[1])
  }));
}
