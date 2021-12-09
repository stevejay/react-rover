import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  Ref,
  useCallback,
  useEffect,
  useReducer,
  useRef
} from 'react';
import mergeRefs from 'merge-refs';

import { callAllEventHandlers, elementIsEnabled, useIsomorphicLayoutEffect } from '@/domUtils';
import { runKeyDownTranslators } from '@/keyDownTranslators';
import { roverReducer } from '@/roverReducer';
import {
  addTabStopItem,
  focusTabStopItem,
  removeTabStopItem,
  shouldResetCurrentTabStopItem
} from '@/tabStopUtils';
import type { Item, ItemList, KeyDownTranslator } from '@/types';

type GetTabContainerProps = (props?: { onKeyDown?: KeyboardEventHandler<HTMLElement> }) => {
  onKeyDown: KeyboardEventHandler<HTMLElement>;
};

type GetTabStopProps = (
  id: string,
  props?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref?: Ref<any>;
    onClick?: MouseEventHandler<HTMLElement>;
  }
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: Ref<any>;
  tabIndex: number;
  onClick?: MouseEventHandler<HTMLElement>;
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
  const { onTabStopChange, initialId: initialItem = null, shouldFocusOnClick = false } = options;

  const [state, dispatch] = useReducer(roverReducer, {
    currentTabStopItem: initialItem,
    shouldFocus: false
  });

  const tabStopItemsRef = useRef<ItemList>([]);
  const tabStopElementMapRef = useRef(new Map<Item, HTMLElement>());

  // Repair the rover state in the case that the current tab stop
  // has just been removed, or the toolbar is being created and
  // initialItem is not set.
  useIsomorphicLayoutEffect(() => {
    if (shouldResetCurrentTabStopItem(tabStopElementMapRef.current, state.currentTabStopItem)) {
      dispatch({
        type: 'resetTabStop',
        payload: {
          items: tabStopItemsRef.current,
          itemToElementMap: tabStopElementMapRef.current,
          initialItem
        }
      });
    }
  }); // Always run

  // If necessary, focus on the new current tab stop.
  useEffect(() => {
    if (state.currentTabStopItem && state.shouldFocus) {
      focusTabStopItem(tabStopElementMapRef.current, state.currentTabStopItem);
    }
  }, [state.currentTabStopItem, state.shouldFocus]);

  // If required, notify the user that the current tab stop has changed.
  useEffect(() => {
    onTabStopChange && onTabStopChange(state.currentTabStopItem as string | null);
  }, [state.currentTabStopItem, onTabStopChange]);

  const getTabContainerProps: GetTabContainerProps = useCallback(
    ({ onKeyDown: userOnKeyDown, ...rest } = {}) => {
      return {
        ...rest,
        onKeyDown: callAllEventHandlers(userOnKeyDown, (event: KeyboardEvent<HTMLElement>) => {
          const action = runKeyDownTranslators(
            keyDownTranslators,
            event,
            tabStopItemsRef.current,
            tabStopElementMapRef.current,
            state.currentTabStopItem
          );
          if (action) {
            event.preventDefault();
            event.stopPropagation();
            dispatch({
              type: 'updateTabStopOnKeyDown',
              payload: { items: tabStopItemsRef.current, ...action }
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
          tabStopElementMapRef.current.set(id, node);
          tabStopItemsRef.current = addTabStopItem(tabStopItemsRef.current, tabStopElementMapRef.current, id);
        } else {
          tabStopElementMapRef.current.delete(id);
          tabStopItemsRef.current = removeTabStopItem(tabStopItemsRef.current, id);
        }
      };
      return {
        ...rest,
        tabIndex: id === state.currentTabStopItem ? 0 : -1,
        // eslint-disable-next-line
        ref: userRef ? mergeRefs(userRef, ref) : ref,
        onClick: (event: MouseEvent<HTMLElement>) => {
          if (elementIsEnabled(event.target)) {
            callAllEventHandlers<MouseEvent<HTMLElement>>(userOnClick, () => {
              dispatch({
                type: 'updateTabStopOnClick',
                payload: {
                  items: tabStopItemsRef.current,
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
    currentTabStopId: state.currentTabStopItem as string | null,
    getTabContainerProps,
    getTabStopProps
  };
}
