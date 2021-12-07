import { elementIsEnabled } from '@/domUtils';
import type { TabStop, TabStopId, TabStopsList } from '@/types';

export function shouldResetCurrentTabStopId(
  tabStops: TabStopsList,
  currentTabStopId: TabStopId | null
): boolean {
  if (!currentTabStopId) {
    // Tab stops list needs to have at least one non-disabled tab stop
    // that can become the new selected tab stop.
    return tabStops.some((tabStop) => elementIsEnabled(tabStop.element));
  }
  // Return true if there is a currentTabStopId but a tab stop
  // with that id no longer exists or it is now disabled:
  return !tabStops.some((tabStop) => tabStop.id === currentTabStopId && elementIsEnabled(tabStop.element));
}

function findIndexOfTabStop(tabStops: TabStopsList, tabStopId: TabStopId | null): number {
  return tabStops.findIndex((tabStop) => tabStop.id === tabStopId);
}

export function findTabStop(tabStops: TabStopsList, tabStopId: TabStopId | null): TabStop | null {
  const index = findIndexOfTabStop(tabStops, tabStopId);
  return index === -1 ? null : tabStops[index];
}

export function focusTabStop(tabStops: TabStopsList, tabStopId: TabStopId | null): void {
  const currentTabStop = findTabStop(tabStops, tabStopId);
  if (currentTabStop) {
    currentTabStop.element.focus();
  }
}

const DOCUMENT_POSITION_FOLLOWING = 4;

export function addTabStop(
  tabStops: TabStopsList,
  tabStopId: TabStopId,
  tabStopElement: HTMLElement
): TabStopsList {
  // Iterate backwards through state.tabStops since it is
  // most likely that the tab stop will be inserted
  // at the end of the array.
  let indexToInsertAt = -1;
  for (let i = tabStops.length - 1; i >= 0; --i) {
    const loopTabStop = tabStops[i];
    // The compareDocumentPosition condition is true if node follows loopTabStop.node:
    if (
      indexToInsertAt === -1 &&
      !!(loopTabStop.element.compareDocumentPosition(tabStopElement) & DOCUMENT_POSITION_FOLLOWING)
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

  const newTabStop = { id: tabStopId, element: tabStopElement };
  const newTabStops = tabStops.slice();
  newTabStops.splice(indexToInsertAt, 0, newTabStop);
  return newTabStops;
}

export function removeTabStop(tabStops: TabStopsList, tabStopId: TabStopId): TabStopsList {
  return tabStops.filter((x) => x.id !== tabStopId);
}

export function getNextEnabledTabStop(
  tabStops: TabStopsList,
  currentTabStopId: TabStopId,
  offset: 1 | -1,
  wraparound: boolean
): TabStop | null {
  const startIndex = findIndexOfTabStop(tabStops, currentTabStopId);
  if (startIndex === -1) {
    return null;
  }
  let nextIndex = startIndex + offset;
  let result: TabStop | null = null;

  for (;;) {
    if (nextIndex === tabStops.length) {
      if (wraparound) {
        nextIndex = 0;
      } else {
        break;
      }
    } else if (nextIndex === -1) {
      if (wraparound) {
        nextIndex = tabStops.length - 1;
      } else {
        break;
      }
    } else if (nextIndex === startIndex) {
      // We've looped right around back to where we started
      // so return null as there is nothing to do.
      break;
    } else if (elementIsEnabled(tabStops[nextIndex].element)) {
      result = tabStops[nextIndex];
      break;
    } else {
      nextIndex += offset;
    }
  }

  return result;
}
