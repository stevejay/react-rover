import { elementIsEnabled } from '@/domUtils';
import { findTabStop } from '@/tabStopUtils';
import type { Action, State } from '@/types';

export function roverReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'resetTabStop': {
      const { items, itemToElementMap, initialItem } = action.payload;
      if (initialItem) {
        if (elementIsEnabled(itemToElementMap.get(initialItem))) {
          return { currentTabStopItem: initialItem, shouldFocus: false };
        }
      }

      const firstEnabledTabStopId = items.find((item) => elementIsEnabled(itemToElementMap.get(item)));
      return firstEnabledTabStopId !== undefined
        ? { currentTabStopItem: firstEnabledTabStopId, shouldFocus: false }
        : state;
    }
    case 'updateTabStopOnClick': {
      const { items, newTabStopItem, shouldFocus } = action.payload;
      const tabStop = findTabStop(items, newTabStopItem);
      return tabStop ? { currentTabStopItem: newTabStopItem, shouldFocus } : state;
    }
    case 'updateTabStopOnKeyDown': {
      const { items, newTabStopItem } = action.payload;
      const tabStop = findTabStop(items, newTabStopItem);
      return tabStop ? { currentTabStopItem: newTabStopItem, shouldFocus: true } : state;
    }
    default:
      /* istanbul ignore next */
      return state;
  }
}
