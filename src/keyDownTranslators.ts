import type { KeyboardEvent } from 'react';

import { elementIsEnabled } from '@/domUtils';
import { findIndexOfTabStopItem } from '@/tabStopUtils';
import type { Item, ItemList, ItemToElementMap, KeyDownTranslator, KeyDownTranslatorOptions } from '@/types';
import { isNil } from '@/utils';

function getNormalisedOptions(options?: KeyDownTranslatorOptions) {
  return { columnsCount: options?.columnsCount || null };
}

function itemIsEnabled(item: Item, itemToElementMap: ItemToElementMap): boolean {
  return elementIsEnabled(itemToElementMap.get(item));
}

function getRowItems(items: ItemList, currentItemIndex: number, columnsCount: number): ItemList {
  const rowStartIndex = Math.floor(currentItemIndex / columnsCount) * columnsCount;
  const rowEndIndex = Math.min(items.length, rowStartIndex + columnsCount);
  return items.slice(rowStartIndex, rowEndIndex);
}

export function getNextEnabledTabStopItem(
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
    } else if (nextIndex < 0) {
      if (wraparound) {
        nextIndex = items.length - 1;
      } else {
        break;
      }
    } else if (nextIndex === startIndex) {
      // We've looped right around back to where we started
      // so return null as there is nothing to do.
      break;
    } else if (itemIsEnabled(items[nextIndex], itemToElementMap)) {
      result = items[nextIndex];
      break;
    } else {
      nextIndex += offset;
    }
  }

  return result;
}

/**
 * A key down translator for the Home and End keys such that they select
 * the very first and very last enabled tab stops respectively.
 */
export function extremesNavigation(): KeyDownTranslator {
  return generalisedExtremesNavigation(false);
}

/**
 * A key down translator for the Ctrl+Home and Ctrl+End key combinations
 * in a grid such that they select the very first and very last enabled
 * tab stops respectively.
 */
export function gridExtremesNavigation(): KeyDownTranslator {
  return generalisedExtremesNavigation(true);
}

function generalisedExtremesNavigation(requireCtrl: boolean): KeyDownTranslator {
  return (event, items, itemToElementMap, currentTabStopItem) => {
    let result: Item | null = null;

    if (!requireCtrl || event.ctrlKey) {
      if (event.key === 'Home') {
        // Search forwards from the start for the first enabled element.
        result = items.find((item) => itemIsEnabled(item, itemToElementMap)) ?? null;
      } else if (event.key === 'End') {
        // Search backwards from the end for the last enabled element.
        for (let i = items.length - 1; i >= 0; --i) {
          const newTabStopItem = items[i];
          if (itemIsEnabled(newTabStopItem, itemToElementMap)) {
            result = newTabStopItem;
            break;
          }
        }
      }
    }

    return result !== currentTabStopItem ? result : null;
  };
}

/**
 * A key down translator for the Home and End keys in a grid
 * such that they select the first and last enabled tab stops
 * respectively in the current row.
 */
export function gridRowExtremesNavigation(): KeyDownTranslator {
  return (
    event: KeyboardEvent,
    items: ItemList,
    itemToElementMap: ItemToElementMap,
    currentTabStopItem: Item,
    options?: KeyDownTranslatorOptions
  ) => {
    // It's only for grids.
    const { columnsCount } = getNormalisedOptions(options);
    if (!columnsCount) {
      return null;
    }

    // This translator should not respond to Ctrl+Home or Ctrl+End.
    if (event.ctrlKey || (event.key !== 'Home' && event.key !== 'End')) {
      return null;
    }

    const currentItemIndex = items.findIndex((item) => item === currentTabStopItem);
    if (currentItemIndex === -1) {
      return null;
    }

    const rowItems = getRowItems(items, currentItemIndex, columnsCount);
    return extremesNavigation()(event, rowItems, itemToElementMap, currentTabStopItem);
  };
}

/**
 * A key down translator for the ArrowLeft and ArrowRight keys such
 * that they select the previous and next enabled tab stops respectively.
 */
export function horizontalNavigation(wraparound = true): KeyDownTranslator {
  return singleStepNavigation(wraparound, 'ArrowLeft', 'ArrowRight');
}

/**
 * A key down translator for the ArrowUp and ArrowDown keys such
 * that they select the previous and next enabled tab stops respectively.
 */
export function verticalNavigation(wraparound = true): KeyDownTranslator {
  return singleStepNavigation(wraparound, 'ArrowUp', 'ArrowDown');
}

function singleStepNavigation(
  wraparound: boolean,
  stepBackKey: string,
  stepForwardKey: string
): KeyDownTranslator {
  return (event, items, itemToElementMap, currentTabStopItem) => {
    const offset = event.key === stepBackKey ? -1 : event.key === stepForwardKey ? 1 : null;
    if (!offset) {
      return null;
    }
    const result = getNextEnabledTabStopItem(items, itemToElementMap, currentTabStopItem, offset, wraparound);
    return result !== currentTabStopItem ? result : null;
  };
}

/**
 * A key down translator for the Arrow keys in a grid such that they select
 * the closest enabled tab stops to the left/right/top/bottom of the current
 * tab stop (according to the exact arrow key pressed).
 */
export function gridSingleStepNavigation(): KeyDownTranslator {
  return (
    event: KeyboardEvent,
    items: ItemList,
    itemToElementMap: ItemToElementMap,
    currentTabStopItem: Item,
    options?: KeyDownTranslatorOptions
  ) => {
    // It's only for grids.
    const { columnsCount } = getNormalisedOptions(options);
    if (!columnsCount) {
      return null;
    }

    const currentItemIndex = items.findIndex((item) => item === currentTabStopItem);
    if (currentItemIndex === -1) {
      return null;
    }

    let result: Item | null = null;

    if (event.key === 'ArrowUp') {
      result = getNextEnabledTabStopItem(items, itemToElementMap, currentTabStopItem, -columnsCount, false);
    } else if (event.key === 'ArrowDown') {
      result = getNextEnabledTabStopItem(items, itemToElementMap, currentTabStopItem, columnsCount, false);
    } else {
      const rowItems = getRowItems(items, currentItemIndex, columnsCount);
      if (event.key === 'ArrowLeft') {
        result = getNextEnabledTabStopItem(rowItems, itemToElementMap, currentTabStopItem, -1, false);
      } else if (event.key === 'ArrowRight') {
        result = getNextEnabledTabStopItem(rowItems, itemToElementMap, currentTabStopItem, 1, false);
      }
    }

    return result !== currentTabStopItem ? result : null;
  };
}

export function runKeyDownTranslators(
  keyDownTranslators: KeyDownTranslator[],
  event: KeyboardEvent,
  items: ItemList,
  itemToElementMap: ItemToElementMap,
  currentTabStopItem: Item | null,
  options?: KeyDownTranslatorOptions
): Item | null {
  let result: Item | null = null;

  if (!isNil(currentTabStopItem)) {
    let i = 0;
    while (isNil(result) && i < keyDownTranslators.length) {
      result = keyDownTranslators[i](event, items, itemToElementMap, currentTabStopItem, options);
      ++i;
    }
  }

  return result;
}
