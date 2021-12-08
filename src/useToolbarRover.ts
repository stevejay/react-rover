import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import mergeRefs from 'merge-refs';

import { callAllEventHandlers, elementIsEnabled } from '@/domUtils';
import { runKeyDownTranslators } from '@/keyDownTranslators';
import { useIsomorphicLayoutEffect } from '@/reactUtils';
import { roverReducer } from '@/roverReducer';
import {
  addTabStopItem,
  focusTabStop,
  removeTabStopItem,
  shouldResetCurrentTabStopItem
} from '@/tabStopUtils';
import type { Item, ItemList, KeyDownTranslator } from '@/types';

type GetTabContainerProps = (props?: { onKeyDown?: React.KeyboardEventHandler<HTMLElement> }) => {
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
};

type GetTabStopProps = (
  id: string,
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

export type OnTabStopChange = (item: string | null) => void;

export type ToolbarRoverOptions = {
  initialId?: string | null;
  onTabStopChange?: OnTabStopChange;
  shouldFocusOnClick?: boolean;
};

export type ToolbarRoverResult = {
  currentTabStopId: string | null;
  getTabContainerProps: GetTabContainerProps;
  getTabStopProps: GetTabStopProps;
};

export function useToolbarRover(
  keyDownTranslators: KeyDownTranslator[],
  options: ToolbarRoverOptions = {}
): ToolbarRoverResult {
  const { onTabStopChange, initialId = null, shouldFocusOnClick = false } = options;

  const [state, dispatch] = useReducer(roverReducer, {
    currentTabStopItem: initialId,
    shouldFocus: false
  });

  const tabStopsItemsRef = useRef<ItemList>([]);
  const tabStopsElementMapRef = useRef(new Map<Item, HTMLElement>());

  // Repair the rover state in the case that the current tab stop
  // has just been removed, or the toolbar is being created and
  // initialItem is not set.
  useIsomorphicLayoutEffect(() => {
    if (shouldResetCurrentTabStopItem(tabStopsElementMapRef.current, state.currentTabStopItem)) {
      dispatch({
        type: 'resetTabStop',
        payload: {
          items: tabStopsItemsRef.current,
          itemToElementMap: tabStopsElementMapRef.current,
          initialItem: initialId
        }
      });
    }
  }); // Always run

  // If necessary, focus on the new current tab stop.
  useEffect(() => {
    if (state.currentTabStopItem && state.shouldFocus) {
      focusTabStop(tabStopsElementMapRef.current, state.currentTabStopItem);
    }
  }, [state.currentTabStopItem, state.shouldFocus]);

  // If required, notify the user that the current tab stop has changed.
  useEffect(() => {
    onTabStopChange && onTabStopChange(state.currentTabStopItem as string);
  }, [state.currentTabStopItem, onTabStopChange]);

  const getTabContainerProps: GetTabContainerProps = useCallback(
    ({ onKeyDown: userOnKeyDown, ...rest } = {}) => {
      return {
        ...rest,
        onKeyDown: callAllEventHandlers(userOnKeyDown, (event: React.KeyboardEvent<HTMLElement>) => {
          const action = runKeyDownTranslators(
            keyDownTranslators,
            tabStopsItemsRef.current,
            tabStopsElementMapRef.current,
            state.currentTabStopItem,
            event
          );
          if (action) {
            event.preventDefault();
            event.stopPropagation();
            dispatch({
              type: 'updateTabStopOnKeyDown',
              payload: { items: tabStopsItemsRef.current, ...action }
            });
          }
        })
      };
    },
    [state.currentTabStopItem, keyDownTranslators]
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
        tabIndex: id === state.currentTabStopItem ? 0 : -1,
        // eslint-disable-next-line
        ref: userRef ? mergeRefs(userRef, ref) : ref,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          if (elementIsEnabled(event.target)) {
            callAllEventHandlers<React.MouseEvent<HTMLElement>>(userOnClick, () => {
              dispatch({
                type: 'updateTabStopOnClick',
                payload: {
                  items: tabStopsItemsRef.current,
                  newTabStopItem: id,
                  shouldFocus: shouldFocusOnClick
                }
              });
            })(event);
          }
        }
      };
    },
    [state.currentTabStopItem, shouldFocusOnClick]
  );

  return {
    currentTabStopId: state.currentTabStopItem as string,
    getTabContainerProps,
    getTabStopProps
  };
}
