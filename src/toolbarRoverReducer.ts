import { elementIsEnabled } from '@/domUtils';
import { findTabStop } from '@/tabStopUtils';
import type { Action, State } from '@/types';

export function toolbarRoverReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'resetTabStop': {
      const { tabStopsItems, tabStopsElementMap, initialTabStopId } = action.payload;
      if (initialTabStopId) {
        if (elementIsEnabled(tabStopsElementMap.get(initialTabStopId))) {
          return { currentTabStopId: initialTabStopId, shouldFocus: false };
        }
      }

      const firstEnabledTabStopId = tabStopsItems.find((id) => elementIsEnabled(tabStopsElementMap.get(id)));
      return firstEnabledTabStopId !== undefined
        ? { currentTabStopId: firstEnabledTabStopId, shouldFocus: false }
        : state;
    }
    case 'updateTabStopOnClick': {
      const { tabStopsItems, newTabStopId, shouldFocus } = action.payload;
      const tabStop = findTabStop(tabStopsItems, newTabStopId);
      return tabStop ? { currentTabStopId: newTabStopId, shouldFocus } : state;
    }
    case 'updateTabStopOnKeyDown': {
      const { tabStopsItems, newTabStopId } = action.payload;
      const tabStop = findTabStop(tabStopsItems, newTabStopId);
      return tabStop ? { currentTabStopId: newTabStopId, shouldFocus: true } : state;
    }
    default:
      /* istanbul ignore next */
      return state;
  }
}
