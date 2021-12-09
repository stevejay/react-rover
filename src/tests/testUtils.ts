import { stub } from 'jest-auto-stub';

import { Item, ItemList, ItemToElementMap } from '@/types';

export function createTabStops(tabStops: [Item, Partial<HTMLButtonElement>][]): [ItemList, ItemToElementMap] {
  const items = tabStops.map((tabStop) => tabStop[0]);
  const itemToElementMap = new Map<Item, HTMLElement>();
  tabStops.forEach((tabStop) => {
    itemToElementMap.set(tabStop[0], stub<HTMLButtonElement>(tabStop[1]));
  });
  return [items, itemToElementMap];
}
