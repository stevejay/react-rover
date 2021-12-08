import { elementIsEnabled } from '@/domUtils';
import type { TabStopId, TabStopsElementMap, TabStopsItems } from '@/types';

export function shouldResetCurrentTabStopId(
  tabStopsElementMap: TabStopsElementMap,
  currentTabStopId: TabStopId | null
): boolean {
  if (!currentTabStopId) {
    // Tab stops list needs to have at least one non-disabled tab stop
    // that can become the new selected tab stop.
    for (const [, value] of tabStopsElementMap) {
      if (elementIsEnabled(value)) {
        return true;
      }
    }
    return false;
  }
  // Return true if there is a currentTabStopId but a tab stop
  // with that id no longer exists or it is now disabled:
  const currentElement = tabStopsElementMap.get(currentTabStopId);
  return !currentElement || !elementIsEnabled(currentElement);
}

function findIndexOfTabStop(tabStopsItems: TabStopsItems, tabStopId: TabStopId | null): number {
  return tabStopsItems.findIndex((id) => id === tabStopId);
}

export function findTabStop(tabStopsItems: TabStopsItems, tabStopId: TabStopId | null): TabStopId | null {
  const index = findIndexOfTabStop(tabStopsItems, tabStopId);
  return index === -1 ? null : tabStopsItems[index];
}

export function focusTabStop(tabStopsElementMap: TabStopsElementMap, tabStopId: TabStopId | null): void {
  tabStopId && tabStopsElementMap.get(tabStopId)?.focus();
}

const DOCUMENT_POSITION_FOLLOWING = 4;

export function addTabStopItem(
  tabStopsItems: TabStopsItems,
  tabStopsElementMap: TabStopsElementMap,
  tabStopId: TabStopId
): TabStopsItems {
  // Iterate backwards through tabStopsItems since it is
  // most likely that the tab stop will be inserted
  // at the end of the array.
  let indexToInsertAt = -1;
  const tabStopElement = tabStopsElementMap.get(tabStopId);

  for (let i = tabStopsItems.length - 1; i >= 0; --i) {
    const loopTabStopId = tabStopsItems[i];
    // The compareDocumentPosition condition is true if node follows loopTabStop.node:
    const loopTabStopElement = tabStopsElementMap.get(loopTabStopId);
    if (
      indexToInsertAt === -1 &&
      loopTabStopElement &&
      tabStopElement &&
      !!(loopTabStopElement.compareDocumentPosition(tabStopElement) & DOCUMENT_POSITION_FOLLOWING)
    ) {
      indexToInsertAt = i + 1;
      break;
    }
  }

  // The indexToInsertAt is -1 when newTabStop should be inserted
  // at the start of tabStops (the compareDocumentPosition condition
  // always returns false in that case).
  if (indexToInsertAt === -1) {
    indexToInsertAt = 0;
  }

  const newTabStopItems = tabStopsItems.slice();
  newTabStopItems.splice(indexToInsertAt, 0, tabStopId);
  return newTabStopItems;
}

export function removeTabStopItem(tabStopsItems: TabStopsItems, tabStopId: TabStopId): TabStopsItems {
  return tabStopsItems.filter((id) => id !== tabStopId);
}

export function getIdOfNextEnabledTabStop(
  tabStopsItems: TabStopsItems,
  tabStopsElementMap: TabStopsElementMap,
  currentTabStopId: TabStopId,
  offset: 1 | -1,
  wraparound: boolean
): TabStopId | null {
  const startIndex = findIndexOfTabStop(tabStopsItems, currentTabStopId);
  if (startIndex === -1) {
    return null;
  }

  let nextIndex = startIndex + offset;
  let result: TabStopId | null = null;

  for (;;) {
    if (nextIndex === tabStopsItems.length) {
      if (wraparound) {
        nextIndex = 0;
      } else {
        break;
      }
    } else if (nextIndex === -1) {
      if (wraparound) {
        nextIndex = tabStopsItems.length - 1;
      } else {
        break;
      }
    } else if (nextIndex === startIndex) {
      // We've looped right around back to where we started
      // so return null as there is nothing to do.
      break;
    } else if (elementIsEnabled(tabStopsElementMap.get(tabStopsItems[nextIndex]))) {
      result = tabStopsItems[nextIndex];
      break;
    } else {
      nextIndex += offset;
    }
  }

  return result;
}
