import { stub } from 'jest-auto-stub';

import { TabStopId, TabStopsElementMap, TabStopsItems } from '@/types';

export function createTabStops(
  tabStops: [TabStopId, Partial<HTMLButtonElement>][]
): [TabStopsItems, TabStopsElementMap] {
  const tabStopsItems = tabStops.map((tabStop) => tabStop[0]);
  const tabStopsElementMap = new Map<TabStopId, HTMLElement>();
  tabStops.forEach((tabStop) => {
    tabStopsElementMap.set(tabStop[0], stub<HTMLButtonElement>(tabStop[1]));
  });
  return [tabStopsItems, tabStopsElementMap];
}
