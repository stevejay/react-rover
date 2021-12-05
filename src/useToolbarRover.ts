import React, { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from 'react';
import mergeRefs from 'merge-refs';

import { callAllEventHandlers, elementIsEnabled } from '@/domUtils';
import { runKeyDownTranslators } from '@/keyDownTranslators';
import {
  addTabStop,
  findTabStop,
  focusTabStop,
  removeTabStop,
  shouldResetCurrentTabStopId
} from '@/tabStopUtils';
import type { Action, KeyDownTranslator, State, TabStopId, TabStopsList } from '@/types';

const useIsomorphicLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;

function reducer(state: State, action: Action): State {
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
      return state;
  }
}

type GetTabContainerProps = (props?: { onKeyDown?: React.KeyboardEventHandler<HTMLElement> }) => {
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
};

type GetTabStopProps = (
  id: TabStopId,
  props?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref?: React.Ref<any>;
    onClick?: React.MouseEventHandler<HTMLElement>;
  }
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: React.Ref<any>;
  tabIndex: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export type OnTabStopChange = (id: TabStopId | null) => void;

export type ToolbarRoverOptions = {
  initialTabStopId?: TabStopId | null;
  onTabStopChange?: OnTabStopChange;
  shouldFocusOnClick?: boolean;
};

export type ToolbarRoverResult = {
  tabStopId: TabStopId | null;
  getTabContainerProps: GetTabContainerProps;
  getTabStopProps: GetTabStopProps;
};

export function useToolbarRover(
  keyDownTranslators: KeyDownTranslator[],
  options: ToolbarRoverOptions = {}
): ToolbarRoverResult {
  const { onTabStopChange, initialTabStopId = null, shouldFocusOnClick = false } = options;

  const [state, dispatch] = useReducer(reducer, {
    currentTabStopId: initialTabStopId,
    shouldFocus: false
  });

  const tabStopsListRef = useRef<TabStopsList>([]);

  // Repair the rover state in the case that the current tab stop
  // has just been removed, or the toolbar is being created and
  // initialTabStopId is not set.
  useIsomorphicLayoutEffect(() => {
    if (shouldResetCurrentTabStopId(tabStopsListRef.current, state.currentTabStopId)) {
      dispatch({
        type: 'resetTabStop',
        payload: { tabStops: tabStopsListRef.current, initialTabStopId }
      });
    }
  }); // Always run

  // If necessary, focus on the new current tab stop.
  useEffect(() => {
    if (state.currentTabStopId && state.shouldFocus) {
      focusTabStop(tabStopsListRef.current, state.currentTabStopId);
    }
  }, [state.currentTabStopId, state.shouldFocus]);

  // If required, notify the user that the current tab stop has changed.
  useEffect(() => {
    onTabStopChange && onTabStopChange(state.currentTabStopId);
  }, [state.currentTabStopId, onTabStopChange]);

  const getTabContainerProps: GetTabContainerProps = useCallback(
    ({ onKeyDown: userOnKeyDown, ...rest } = {}) => {
      return {
        ...rest,
        onKeyDown: callAllEventHandlers(userOnKeyDown, (event: React.KeyboardEvent<HTMLElement>) => {
          const action = runKeyDownTranslators(
            keyDownTranslators,
            tabStopsListRef.current,
            state.currentTabStopId,
            event
          );
          if (action) {
            event.preventDefault();
            event.stopPropagation();
            dispatch({
              type: 'updateTabStopOnKeyDown',
              payload: { tabStops: tabStopsListRef.current, ...action }
            });
          }
        })
      };
    },
    [state.currentTabStopId, keyDownTranslators]
  );

  const getTabStopProps: GetTabStopProps = useCallback(
    (id, { ref: userRef, onClick: userOnClick, ...rest } = {}) => {
      const ref = (node: HTMLElement) => {
        if (node) {
          tabStopsListRef.current = addTabStop(tabStopsListRef.current, id, node);
        } else {
          tabStopsListRef.current = removeTabStop(tabStopsListRef.current, id);
        }
      };
      return {
        ...rest,
        tabIndex: id === state.currentTabStopId ? 0 : -1,
        // eslint-disable-next-line
        ref: userRef ? mergeRefs(userRef, ref) : ref,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          if (elementIsEnabled(event.target) /*&& elementIsAriaEnabled(event.target)*/) {
            callAllEventHandlers<React.MouseEvent<HTMLElement>>(userOnClick, () => {
              dispatch({
                type: 'updateTabStopOnClick',
                payload: {
                  tabStops: tabStopsListRef.current,
                  newTabStopId: id,
                  shouldFocus: shouldFocusOnClick
                }
              });
            })(event);
          }
        }
      };
    },
    [state.currentTabStopId, shouldFocusOnClick]
  );

  return {
    tabStopId: state.currentTabStopId,
    getTabContainerProps,
    getTabStopProps
  };
}
