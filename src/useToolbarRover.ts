import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import mergeRefs from 'merge-refs';

import { callAllEventHandlers, elementIsEnabled } from '@/domUtils';
import { runKeyDownTranslators } from '@/keyDownTranslators';
import { useIsomorphicLayoutEffect } from '@/reactUtils';
import { addTabStopItem, focusTabStop, removeTabStopItem, shouldResetCurrentTabStopId } from '@/tabStopUtils';
import { toolbarRoverReducer } from '@/toolbarRoverReducer';
import type { KeyDownTranslator, TabStopId, TabStopsItems } from '@/types';

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

  const [state, dispatch] = useReducer(toolbarRoverReducer, {
    currentTabStopId: initialTabStopId,
    shouldFocus: false
  });

  const tabStopsItemsRef = useRef<TabStopsItems>([]);
  const tabStopsElementMapRef = useRef(new Map<TabStopId, HTMLElement>());

  // Repair the rover state in the case that the current tab stop
  // has just been removed, or the toolbar is being created and
  // initialTabStopId is not set.
  useIsomorphicLayoutEffect(() => {
    if (shouldResetCurrentTabStopId(tabStopsElementMapRef.current, state.currentTabStopId)) {
      dispatch({
        type: 'resetTabStop',
        payload: {
          tabStopsItems: tabStopsItemsRef.current,
          tabStopsElementMap: tabStopsElementMapRef.current,
          initialTabStopId
        }
      });
    }
  }); // Always run

  // If necessary, focus on the new current tab stop.
  useEffect(() => {
    if (state.currentTabStopId && state.shouldFocus) {
      focusTabStop(tabStopsElementMapRef.current, state.currentTabStopId);
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
            tabStopsItemsRef.current,
            tabStopsElementMapRef.current,
            state.currentTabStopId,
            event
          );
          if (action) {
            event.preventDefault();
            event.stopPropagation();
            dispatch({
              type: 'updateTabStopOnKeyDown',
              payload: { tabStopsItems: tabStopsItemsRef.current, ...action }
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
          tabStopsElementMapRef.current.set(id, node);
          tabStopsItemsRef.current = addTabStopItem(
            tabStopsItemsRef.current,
            tabStopsElementMapRef.current,
            id
          );
        } else {
          tabStopsElementMapRef.current.delete(id);
          tabStopsItemsRef.current = removeTabStopItem(tabStopsItemsRef.current, id);
        }
      };
      return {
        ...rest,
        tabIndex: id === state.currentTabStopId ? 0 : -1,
        // eslint-disable-next-line
        ref: userRef ? mergeRefs(userRef, ref) : ref,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          if (elementIsEnabled(event.target)) {
            callAllEventHandlers<React.MouseEvent<HTMLElement>>(userOnClick, () => {
              dispatch({
                type: 'updateTabStopOnClick',
                payload: {
                  tabStopsItems: tabStopsItemsRef.current,
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
