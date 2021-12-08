import { elementIsEnabled } from '@/domUtils';
import { getIdOfNextEnabledTabStop } from '@/tabStopUtils';
import type { Item, ItemList, ItemToElementMap, KeyDownAction, KeyDownTranslator } from '@/types';

function generalisedExtremesNavigation(requireCtrl: boolean): KeyDownTranslator {
  return (event, items, itemToElementMap) => {
    if (!requireCtrl || event.ctrlKey) {
      if (event.key === 'Home') {
        // Search forwards from the first element for the first enabled element.
        const newTabStopItem = items.find((item) => elementIsEnabled(itemToElementMap.get(item)));
        if (newTabStopItem !== undefined) {
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

export function extremesNavigation(): KeyDownTranslator {
  return generalisedExtremesNavigation(false);
}

export function gridExtremesNavigation(): KeyDownTranslator {
  return generalisedExtremesNavigation(true);
}

// TODO wraparound option?
// export const gridStepNavigation: KeyDownTranslator = (
//   event: React.KeyboardEvent,
//   items: ItemList,
//   itemToElementMap: ItemToElementMap,
//   currentTabStopItem: Item
// ) => {
//   if (
//     event.key !== 'ArrowLeft' &&
//     event.key !== 'ArrowRight' &&
//     event.key !== 'ArrowUp' &&
//     event.key !== 'ArrowDown'
//   ) {
//     return null;
//   }

//   const currentTabStopElement = itemToElementMap.get(currentTabStopItem);
//   if (!currentTabStopElement) {
//     return null;
//   }

//   const dataRow = getColumnIndex(currentTabStopElement);
//   if (!dataRow) {
//     return null;
//   }

// };

function getColumnIndex(element?: HTMLElement | null): number | null {
  return element ? parseInt(element.dataset.columnIndex || '', 10) || null : null;
}

export const gridRowExtremesNavigation: KeyDownTranslator = (
  event: React.KeyboardEvent,
  items: ItemList,
  itemToElementMap: ItemToElementMap,
  currentTabStopItem: Item
) => {
  if (event.key !== 'Home' && event.key !== 'End') {
    return null;
  }

  const currentTabStopIndex = items.findIndex((item) => item === currentTabStopItem);
  if (currentTabStopIndex === -1) {
    return null;
  }

  //   const currentTabStopElement = itemToElementMap.get(currentTabStopItem);
  //   if (!currentTabStopElement) {
  //     return null;
  //   }

  const [firstIndex, lastIndex] = getGridRowTabStopRange(
    items,
    itemToElementMap,
    currentTabStopItem,
    currentTabStopIndex
  );

  if (firstIndex === -1 || lastIndex === -1) {
    /* istanbul ignore next */
    return null;
  }

  const rowItems = items.slice(firstIndex, lastIndex + 1);

  if (event.key === 'Home') {
    // Search forwards from the first element for the first enabled element.
    const newTabStopItem = rowItems.find((item) => elementIsEnabled(itemToElementMap.get(item)));
    if (newTabStopItem !== undefined) {
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

function getGridRowTabStopRange(
  items: ItemList,
  itemToElementMap: ItemToElementMap,
  currentTabStopItem: Item,
  currentTabStopIndex: number
): [number, number] {
  const currentTabStopElement = itemToElementMap.get(currentTabStopItem);
  if (!currentTabStopElement) {
    return [-1, -1];
  }

  const columnIndex = getColumnIndex();
  if (columnIndex === null) {
    return [-1, -1];
  }

  let firstIndex = currentTabStopIndex;
  let lastIndex = currentTabStopIndex;

  if (columnIndex > 0) {
    for (let i = currentTabStopIndex - 1; i >= 0; --i) {
      const loopElement = itemToElementMap.get(items[i]);
      const loopColumnIndex = getColumnIndex(loopElement);
      if (loopColumnIndex === 0) {
        firstIndex = loopColumnIndex;
        break;
      }
    }
  }

  for (let i = currentTabStopIndex + 1; i < items.length; ++i) {
    const loopElement = itemToElementMap.get(items[i]);
    const loopColumnIndex = getColumnIndex(loopElement);
    if (loopColumnIndex === 0) {
      break;
    } else if (loopColumnIndex !== null) {
      lastIndex = loopColumnIndex;
    }
  }

  return [firstIndex, lastIndex];
}

export function horizontalNavigation(wraparound = true): KeyDownTranslator {
  return singleStepNavigation(wraparound, 'ArrowLeft', 'ArrowRight');
}

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

export function runKeyDownTranslators(
  keyDownTranslators: KeyDownTranslator[],
  items: ItemList,
  itemToElementMap: ItemToElementMap,
  currentTabStopItem: Item | null,
  event: React.KeyboardEvent
): KeyDownAction | null {
  if (!currentTabStopItem) {
    return null;
  }

  let i = 0;
  let action = null;
  while (!action && i < keyDownTranslators.length) {
    action = keyDownTranslators[i](event, items, itemToElementMap, currentTabStopItem);
    ++i;
  }

  return action;
}
