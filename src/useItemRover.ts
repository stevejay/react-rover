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
import { focusTabStop, shouldResetCurrentTabStopItem } from '@/tabStopUtils';
import { Item, ItemList, KeyDownTranslator } from '@/types';

type GetTabContainerProps = (props?: { onKeyDown?: KeyboardEventHandler<HTMLElement> }) => {
  onKeyDown: KeyboardEventHandler<HTMLElement>;
};

type GetTabStopProps = (
  item: Item,
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

export type OnCurrentItemChange = (item: Item | null) => void;

export type ItemRoverOptions = {
  columnsCount?: number;
  initialItem?: Item | null;
  onCurrentItemChange?: OnCurrentItemChange;
  shouldFocusOnClick?: boolean;
};

export type ItemRoverResult = {
  currentTabStopItem: Item | null;
  getTabContainerProps: GetTabContainerProps;
  getTabStopProps: GetTabStopProps;
};

export function useItemRover(
  items: ItemList,
  keyDownTranslators: KeyDownTranslator[],
  options: ItemRoverOptions = {}
): ItemRoverResult {
  const { onCurrentItemChange, columnsCount, initialItem = null, shouldFocusOnClick = false } = options;

  const [state, dispatch] = useReducer(roverReducer, {
    currentTabStopItem: initialItem,
    shouldFocus: false
  });

  const tabStopItemsRef = useRef<ItemList>([]);
  const tabStopElementMapRef = useRef(new Map<Item, HTMLElement>());

  // Update the items ref if it has changed. Must be first effect.
  useIsomorphicLayoutEffect(() => {
    tabStopItemsRef.current = items;
  }, [items]);

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
      focusTabStop(tabStopElementMapRef.current, state.currentTabStopItem);
    }
  }, [state.currentTabStopItem, state.shouldFocus]);

  // If required, notify the user that the current tab stop has changed.
  useEffect(() => {
    onCurrentItemChange && onCurrentItemChange(state.currentTabStopItem);
  }, [state.currentTabStopItem, onCurrentItemChange]);

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
            state.currentTabStopItem,
            { columnsCount }
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
    [state.currentTabStopItem, keyDownTranslators, columnsCount]
  );

  const getTabStopProps: GetTabStopProps = useCallback(
    (id, { ref: userRef, onClick: userOnClick, ...rest } = {}) => {
      const ref = (node: HTMLElement) => {
        if (node) {
          tabStopElementMapRef.current.set(id, node);
        } else {
          tabStopElementMapRef.current.delete(id);
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
    currentTabStopItem: state.currentTabStopItem,
    getTabContainerProps,
    getTabStopProps
  };
}
