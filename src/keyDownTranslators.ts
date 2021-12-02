import { elementIsEnabled } from './domUtils';
import { findTabStop, getNextEnabledTabStop } from './tabStopUtils';

export const extremesNavigation: KeyDownTranslator = (event, tabStops) => {
  if (event.key === 'Home') {
    // Search forwards from the first element.
    const tabStop = tabStops.find((x) => elementIsEnabled(x.element));
    if (tabStop) {
      return { newTabStopId: tabStop.id };
    }
  } else if (event.key === 'End') {
    // Search backwards from the last element.
    for (let i = tabStops.length - 1; i >= 0; --i) {
      const tabStop = tabStops[i];
      if (elementIsEnabled(tabStop.element)) {
        return { newTabStopId: tabStop.id };
      }
    }
  }
  return null;
};

export function horizontalNavigation(wraparound = true): KeyDownTranslator {
  return (event, tabStops, currentTabStop) => {
    const offset = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : null;
    if (offset) {
      const nextTabStop = getNextEnabledTabStop(tabStops, currentTabStop.id, offset, wraparound);
      if (nextTabStop) {
        return { newTabStopId: nextTabStop.id };
      }
    }
    return null;
  };
}

export function verticalNavigation(wraparound = true): KeyDownTranslator {
  return (event, tabStops, currentTabStop) => {
    const offset = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : null;
    if (offset) {
      const nextTabStop = getNextEnabledTabStop(tabStops, currentTabStop.id, offset, wraparound);
      if (nextTabStop) {
        return { newTabStopId: nextTabStop.id };
      }
    }
    return null;
  };
}

export function horizontalRadioGroupNavigation(wraparound = true): KeyDownTranslator {
  return (event, tabStops, currentTabStop) => {
    const role = currentTabStop.element.getAttribute('role');
    if (role !== 'radio') {
      return null;
    }

    const offset = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : null;
    if (!offset) {
      return null;
    }

    const parent = currentTabStop.element.parentElement;
    if (!parent || parent.getAttribute('role') !== 'radiogroup') {
      return null;
    }

    // TODO make more efficient.
    const firstIndex = tabStops.findIndex((tabStop) => tabStop.element === parent.firstElementChild);
    const lastIndex = tabStops.findIndex((tabStop) => tabStop.element === parent.lastElementChild);

    if (firstIndex === -1 || lastIndex === -1) {
      return null;
    }

    const nextTabStop = getNextEnabledTabStop(
      tabStops.slice(firstIndex, lastIndex + 1),
      currentTabStop.id,
      offset,
      wraparound
    );

    return nextTabStop ? { newTabStopId: nextTabStop.id } : null;
  };
}

export function runKeyDownTranslators(
  keyDownTranslators: KeyDownTranslator[],
  tabStops: TabStopsList,
  currentTabStopId: TabStopId | null,
  event: React.KeyboardEvent<HTMLElement>
): KeyDownAction | null {
  const currentTabStop = findTabStop(tabStops, currentTabStopId);
  if (!currentTabStop) {
    return null;
  }

  let i = 0;
  let action = null;
  while (!action && i < keyDownTranslators.length) {
    action = keyDownTranslators[i](event, tabStops, currentTabStop);
    ++i;
  }

  return action;
}
