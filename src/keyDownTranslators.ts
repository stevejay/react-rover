import { elementIsEnabled } from '@/domUtils';
import { getIdOfNextEnabledTabStop } from '@/tabStopUtils';
import type { KeyDownAction, KeyDownTranslator, TabStopId, TabStopsElementMap, TabStopsItems } from '@/types';

export const extremesNavigation: KeyDownTranslator = (event, tabStopsItems, tabStopsElementMap) => {
  if (event.key === 'Home') {
    // Search forwards from the first element for the first enabled element.
    const newTabStopId = tabStopsItems.find((id) => elementIsEnabled(tabStopsElementMap.get(id)));
    if (newTabStopId !== undefined) {
      return { newTabStopId };
    }
  } else if (event.key === 'End') {
    // Search backwards from the last element for the last enabled element.
    for (let i = tabStopsItems.length - 1; i >= 0; --i) {
      const newTabStopId = tabStopsItems[i];
      if (elementIsEnabled(tabStopsElementMap.get(newTabStopId))) {
        return { newTabStopId };
      }
    }
  }
  return null;
};

export function horizontalNavigation(wraparound = true): KeyDownTranslator {
  return stepNavigation(wraparound, 'ArrowLeft', 'ArrowRight');
}

export function verticalNavigation(wraparound = true): KeyDownTranslator {
  return stepNavigation(wraparound, 'ArrowUp', 'ArrowDown');
}

function stepNavigation(wraparound: boolean, stepBackKey: string, stepForwardKey: string): KeyDownTranslator {
  return (event, tabStopsItems, tabStopsElementMap, currentTabStopId) => {
    const offset = event.key === stepBackKey ? -1 : event.key === stepForwardKey ? 1 : null;
    if (offset) {
      const newTabStopId = getIdOfNextEnabledTabStop(
        tabStopsItems,
        tabStopsElementMap,
        currentTabStopId,
        offset,
        wraparound
      );
      if (newTabStopId !== null) {
        return { newTabStopId };
      }
    }
    return null;
  };
}

function getRoleAttribute(element: HTMLElement | null): string | null {
  return element ? element.getAttribute('role') : null;
}

function getRadioGroupTabStopRange(
  tabStopsItems: TabStopsItems,
  tabStopsElementMap: TabStopsElementMap,
  radioGroupElement: HTMLElement
): [number, number] {
  let firstIndex = -1;
  let lastIndex = -1;

  // Find both firstIndex and lastIndex in a single pass through tabStops:
  for (let i = 0; i < tabStopsItems.length; ++i) {
    const currentElement = tabStopsElementMap.get(tabStopsItems[i]);
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
  return (event, tabStopsItems, tabStopsElementMap, currentTabStopId) => {
    const currentTabStopElement = tabStopsElementMap.get(currentTabStopId);
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

    const [firstIndex, lastIndex] = getRadioGroupTabStopRange(tabStopsItems, tabStopsElementMap, parent);
    if (firstIndex === -1 || lastIndex === -1) {
      /* istanbul ignore next */
      return null;
    }

    const newTabStopId = getIdOfNextEnabledTabStop(
      tabStopsItems.slice(firstIndex, lastIndex + 1),
      tabStopsElementMap,
      currentTabStopId,
      offset,
      wraparound
    );

    return newTabStopId ? { newTabStopId } : null;
  };
}

export function runKeyDownTranslators(
  keyDownTranslators: KeyDownTranslator[],
  tabStopsItems: TabStopsItems,
  tabStopsElementMap: TabStopsElementMap,
  currentTabStopId: TabStopId | null,
  event: React.KeyboardEvent
): KeyDownAction | null {
  if (!currentTabStopId) {
    return null;
  }

  let i = 0;
  let action = null;
  while (!action && i < keyDownTranslators.length) {
    action = keyDownTranslators[i](event, tabStopsItems, tabStopsElementMap, currentTabStopId);
    ++i;
  }

  return action;
}
