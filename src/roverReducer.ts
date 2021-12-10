import { elementIsEnabled } from '@/domUtils';
import { findTabStopItem } from '@/tabStopUtils';
import type { Action, State } from '@/types';
import { isNil } from '@/utils';

export function roverReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'resetTabStop': {
      const { items, itemToElementMap, initialItem } = action.payload;
      if (initialItem) {
        if (elementIsEnabled(itemToElementMap.get(initialItem))) {
          return { currentTabStopItem: initialItem, shouldFocus: false };
        }
      }
      const firstEnabledTabStopItem = items.find((item) => elementIsEnabled(itemToElementMap.get(item)));
      return isNil(firstEnabledTabStopItem)
        ? state
        : { currentTabStopItem: firstEnabledTabStopItem, shouldFocus: false };
    }
    case 'updateTabStopOnClick': {
      const { items, newTabStopItem, shouldFocus } = action.payload;
      return findTabStopItem(items, newTabStopItem)
        ? { currentTabStopItem: newTabStopItem, shouldFocus }
        : state;
    }
    case 'updateTabStopOnKeyDown': {
      const { items, newTabStopItem } = action.payload;
      return findTabStopItem(items, newTabStopItem)
        ? { currentTabStopItem: newTabStopItem, shouldFocus: true }
        : state;
    }
    default:
      /* istanbul ignore next */
      return state;
  }
}
