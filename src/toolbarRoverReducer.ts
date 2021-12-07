import { elementIsEnabled } from '@/domUtils';
import { findTabStop } from '@/tabStopUtils';
import type { Action, State } from '@/types';

export function toolbarRoverReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'resetTabStop': {
      const { tabStops, initialTabStopId } = action.payload;
      if (initialTabStopId) {
        if (
          tabStops.some((tabStop) => tabStop.id === initialTabStopId && elementIsEnabled(tabStop.element))
        ) {
          return { currentTabStopId: initialTabStopId, shouldFocus: false };
        }
      }
      const firstEnabledTabStop = tabStops.find((tabStop) => elementIsEnabled(tabStop.element));
      return firstEnabledTabStop ? { currentTabStopId: firstEnabledTabStop.id, shouldFocus: false } : state;
    }
    case 'updateTabStopOnClick': {
      const { tabStops, newTabStopId, shouldFocus } = action.payload;
      const tabStop = findTabStop(tabStops, newTabStopId);
      return tabStop ? { currentTabStopId: newTabStopId, shouldFocus } : state;
    }
    case 'updateTabStopOnKeyDown': {
      const { tabStops, newTabStopId } = action.payload;
      const tabStop = findTabStop(tabStops, newTabStopId);
      return tabStop ? { currentTabStopId: newTabStopId, shouldFocus: true } : state;
    }
    default:
      /* istanbul ignore next */
      return state;
  }
}
