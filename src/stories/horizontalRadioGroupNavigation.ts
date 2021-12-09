import { getNextEnabledTabStopItem, ItemList, ItemToElementMap, KeyDownTranslator } from '@/index';

function getRoleAttribute(element: HTMLElement | null): string | null {
  return element ? element.getAttribute('role') : null;
}

function getRadioGroupTabStopRange(
  items: ItemList,
  itemToElementMap: ItemToElementMap,
  radioGroupElement: HTMLElement
): [number, number] {
  let firstIndex = -1;
  let lastIndex = -1;

  // Find both firstIndex and lastIndex in a single pass through tabStops:
  for (let i = 0; i < items.length; ++i) {
    const currentElement = itemToElementMap.get(items[i]);
    if (currentElement === radioGroupElement.firstElementChild) {
      firstIndex = i;
    }
    if (currentElement === radioGroupElement.lastElementChild) {
      lastIndex = i;
    }
    // Break out of the loop if we have found both indexes:
    if (firstIndex > -1 && lastIndex > -1) {
      break;
    }
  }

  return [firstIndex, lastIndex];
}

export function horizontalRadioGroupNavigation(wraparound = true): KeyDownTranslator {
  return (event, items, itemToElementMap, currentTabStopItem) => {
    const currentTabStopElement = itemToElementMap.get(currentTabStopItem);
    if (!currentTabStopElement) {
      return null;
    }

    const role = getRoleAttribute(currentTabStopElement);
    if (role !== 'radio') {
      return null;
    }

    const offset = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : null;
    if (!offset) {
      return null;
    }

    const parent = currentTabStopElement.parentElement;
    if (!parent || getRoleAttribute(parent) !== 'radiogroup') {
      return null;
    }

    const [firstIndex, lastIndex] = getRadioGroupTabStopRange(items, itemToElementMap, parent);
    if (firstIndex === -1 || lastIndex === -1) {
      /* istanbul ignore next */
      return null;
    }

    const newTabStopItem = getNextEnabledTabStopItem(
      items.slice(firstIndex, lastIndex + 1),
      itemToElementMap,
      currentTabStopItem,
      offset,
      wraparound
    );

    return newTabStopItem ? { newTabStopItem } : null;
  };
}
