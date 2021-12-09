import { elementIsEnabled } from '@/domUtils';
import type { Item, ItemList, ItemToElementMap } from '@/types';

export function shouldResetCurrentTabStopItem(
  itemToElementMap: ItemToElementMap,
  currentTabStopItem: Item | null
): boolean {
  if (!currentTabStopItem) {
    // Tab stops list needs to have at least one non-disabled tab stop
    // that can become the new selected tab stop.
    for (const [, value] of itemToElementMap) {
      if (elementIsEnabled(value)) {
        return true;
      }
    }
    return false;
  }
  // Return true if there is a currentTabStopItem but a tab stop
  // with that item no longer exists or it is now disabled:
  const currentElement = itemToElementMap.get(currentTabStopItem);
  return !currentElement || !elementIsEnabled(currentElement);
}

function findIndexOfTabStopItem(items: ItemList, tabStopItem: Item | null): number {
  return items.findIndex((item) => item === tabStopItem);
}

export function findTabStopItem(items: ItemList, tabStopItem: Item | null): Item | null {
  const index = findIndexOfTabStopItem(items, tabStopItem);
  return index === -1 ? null : items[index];
}

export function focusTabStopItem(itemToElementMap: ItemToElementMap, tabStopItem: Item | null): void {
  tabStopItem && itemToElementMap.get(tabStopItem)?.focus();
}

const DOCUMENT_POSITION_FOLLOWING = 4;

export function addTabStopItem(
  items: ItemList,
  itemToElementMap: ItemToElementMap,
  tabStopItem: Item
): ItemList {
  // Iterate backwards through items since it is most likely
  // that the tab stop will be inserted at the end of the array.
  let indexToInsertAt = -1;
  const tabStopElement = itemToElementMap.get(tabStopItem);

  for (let i = items.length - 1; i >= 0; --i) {
    const loopTabStopId = items[i];
    // The compareDocumentPosition condition is true if node follows loopTabStop.node:
    const loopTabStopElement = itemToElementMap.get(loopTabStopId);
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

  const newTabStopItems = items.slice();
  newTabStopItems.splice(indexToInsertAt, 0, tabStopItem);
  return newTabStopItems;
}

export function removeTabStopItem(items: ItemList, tabStopItem: Item): ItemList {
  return items.filter((item) => item !== tabStopItem);
}

export function getIdOfNextEnabledTabStop(
  items: ItemList,
  itemToElementMap: ItemToElementMap,
  currentTabStopItem: Item,
  offset: number,
  wraparound: boolean
): Item | null {
  const startIndex = findIndexOfTabStopItem(items, currentTabStopItem);
  if (startIndex === -1) {
    return null;
  }

  let nextIndex = startIndex + offset;
  let result: Item | null = null;

  for (;;) {
    if (nextIndex >= items.length) {
      if (wraparound) {
        nextIndex = 0;
      } else {
        break;
      }
    } else if (nextIndex <= -1) {
      if (wraparound) {
        nextIndex = items.length - 1;
      } else {
        break;
      }
    } else if (nextIndex === startIndex) {
      // We've looped right around back to where we started
      // so return null as there is nothing to do.
      break;
    } else if (elementIsEnabled(itemToElementMap.get(items[nextIndex]))) {
      result = items[nextIndex];
      break;
    } else {
      nextIndex += offset;
    }
  }

  return result;
}
