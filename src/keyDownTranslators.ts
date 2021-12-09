import { elementIsEnabled } from '@/domUtils';
import { getIdOfNextEnabledTabStop } from '@/tabStopUtils';
import type {
  Item,
  ItemList,
  ItemToElementMap,
  KeyDownAction,
  KeyDownTranslator,
  KeyDownTranslatorOptions
} from '@/types';
import { isNil } from '@/utils';

function getNormalisedOptions(options?: KeyDownTranslatorOptions) {
  return { columnsCount: options?.columnsCount || null };
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
  return (event, items, itemToElementMap) => {
    if (!requireCtrl || event.ctrlKey) {
      if (event.key === 'Home') {
        // Search forwards from the first element for the first enabled element.
        const newTabStopItem = items.find((item) => elementIsEnabled(itemToElementMap.get(item)));
        if (!isNil(newTabStopItem)) {
          return { newTabStopItem };
        }
      } else if (event.key === 'End') {
        // Search backwards from the last element for the last enabled element.
        for (let i = items.length - 1; i >= 0; --i) {
          const newTabStopItem = items[i];
          if (elementIsEnabled(itemToElementMap.get(newTabStopItem))) {
            return { newTabStopItem };
          }
        }
      }
    }
    return null;
  };
}

/**
 * A key down translator for the Home and End keys in a grid
 * such that they select the first and last enabled tab stops
 * in the current row.
 */
export function gridRowExtremesNavigation(): KeyDownTranslator {
  return (
    event: React.KeyboardEvent,
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

    const rowStartIndex = Math.floor(currentItemIndex / columnsCount) * columnsCount;
    const rowEndIndex = Math.min(items.length, rowStartIndex + columnsCount);
    const rowItems = items.slice(rowStartIndex, rowEndIndex);

    if (event.key === 'Home') {
      // Search forwards from the first element for the first enabled element.
      const newTabStopItem = rowItems.find((item) => elementIsEnabled(itemToElementMap.get(item)));
      if (!isNil(newTabStopItem)) {
        return { newTabStopItem };
      }
    } else if (event.key === 'End') {
      // Search backwards from the last element for the last enabled element.
      for (let i = rowItems.length - 1; i >= 0; --i) {
        const newTabStopItem = rowItems[i];
        if (elementIsEnabled(itemToElementMap.get(newTabStopItem))) {
          return { newTabStopItem };
        }
      }
    }

    return null;
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
    if (offset) {
      const newTabStopItem = getIdOfNextEnabledTabStop(
        items,
        itemToElementMap,
        currentTabStopItem,
        offset,
        wraparound
      );
      if (newTabStopItem !== null) {
        return { newTabStopItem };
      }
    }
    return null;
  };
}

/**
 * A key down translator for the Arrow keys in a grid such that they select
 * the closest enabled tab stops to the left/right/top/bottom of the current
 * tab stop (according to the exact arrow key pressed).
 */
export function gridSingleStepNavigation(): KeyDownTranslator {
  return (
    event: React.KeyboardEvent,
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

    if (event.key === 'ArrowUp') {
      const newTabStopItem = getIdOfNextEnabledTabStop(
        items,
        itemToElementMap,
        currentTabStopItem,
        -columnsCount,
        false
      );
      if (newTabStopItem !== null) {
        return { newTabStopItem };
      }
    } else if (event.key === 'ArrowDown') {
      const newTabStopItem = getIdOfNextEnabledTabStop(
        items,
        itemToElementMap,
        currentTabStopItem,
        columnsCount,
        false
      );
      if (newTabStopItem !== null) {
        return { newTabStopItem };
      }
    } else {
      const rowStartIndex = Math.floor(currentItemIndex / columnsCount) * columnsCount;
      const rowEndIndex = Math.min(items.length, rowStartIndex + columnsCount);
      const rowItems = items.slice(rowStartIndex, rowEndIndex);

      if (event.key === 'ArrowLeft') {
        const newTabStopItem = getIdOfNextEnabledTabStop(
          rowItems,
          itemToElementMap,
          currentTabStopItem,
          -1,
          false
        );
        if (newTabStopItem !== null) {
          return { newTabStopItem };
        }
      } else if (event.key === 'ArrowRight') {
        const newTabStopItem = getIdOfNextEnabledTabStop(
          rowItems,
          itemToElementMap,
          currentTabStopItem,
          1,
          false
        );
        if (newTabStopItem !== null) {
          return { newTabStopItem };
        }
      }
    }

    return null;
  };
}

export function runKeyDownTranslators(
  keyDownTranslators: KeyDownTranslator[],
  event: React.KeyboardEvent,
  items: ItemList,
  itemToElementMap: ItemToElementMap,
  currentTabStopItem: Item | null,
  options?: KeyDownTranslatorOptions
): KeyDownAction | null {
  if (!currentTabStopItem) {
    return null;
  }

  let i = 0;
  let action = null;

  while (!action && i < keyDownTranslators.length) {
    action = keyDownTranslators[i](event, items, itemToElementMap, currentTabStopItem, options);
    ++i;
  }

  return action;
}
