import {
  createContext,
  FC,
  KeyboardEvent,
  MouseEventHandler,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';

import { useIsomorphicLayoutEffect } from '@/domUtils';
import { runKeyDownTranslators } from '@/keyDownTranslators';
import { roverReducer } from '@/roverReducer';
import { focusTabStopItem, shouldResetCurrentTabStopItem } from '@/tabStopUtils';
import { Item, ItemList, KeyDownTranslator } from '@/types';

import { isNil } from './utils';

export type OnTabStopChange = (item: Item | null) => void;

export type ItemRoverOptions = {
  columnsCount?: number;
  initialItem?: Item | null;
  onTabStopChange?: OnTabStopChange;
  shouldFocusOnClick?: boolean;
};

export type RoverContextType = {
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  register: (item: Item, node: HTMLElement) => void;
  unregister: (item: Item) => void;
  clicked: (item: Item) => void;
  currentTabStopItem: Item | null;
};

export const RoverContext = createContext<RoverContextType>({
  onKeyDown: () => void 0,
  register: () => void 0,
  unregister: () => void 0,
  clicked: () => void 0,
  currentTabStopItem: null
});

export type RoverProviderProps = {
  items: ItemList;
  /** Must be memoized or be a constant. */
  keyDownTranslators: KeyDownTranslator[];
} & ItemRoverOptions;

export const RoverProvider: FC<RoverProviderProps> = ({
  items,
  keyDownTranslators,
  children,
  onTabStopChange,
  columnsCount,
  initialItem = null,
  shouldFocusOnClick = false
}) => {
  const [state, dispatch] = useReducer(roverReducer, {
    currentTabStopItem: initialItem ?? null,
    shouldFocus: false
  });

  const tabStopItemsRef = useRef<ItemList>([]);
  const tabStopElementMapRef = useRef(new Map<Item, HTMLElement>());
  const currentTabStopItemRef = useRef<Item | null>(state.currentTabStopItem);

  // Update the items ref if it has changed.
  // *** Must be the first effect ***
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
      focusTabStopItem(tabStopElementMapRef.current, state.currentTabStopItem);
    }
  }, [state.currentTabStopItem, state.shouldFocus]);

  // If required, notify the user that the current tab stop has changed.
  useEffect(() => {
    onTabStopChange && onTabStopChange(state.currentTabStopItem);
  }, [state.currentTabStopItem, onTabStopChange]);

  // Used so that the onKeyDown function does not need to depend directly on
  // state.currentTabStopItem.
  useIsomorphicLayoutEffect(() => {
    currentTabStopItemRef.current = state.currentTabStopItem;
  }, [state.currentTabStopItem]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const newTabStopItem = runKeyDownTranslators(
        keyDownTranslators,
        event,
        tabStopItemsRef.current,
        tabStopElementMapRef.current,
        currentTabStopItemRef.current,
        { columnsCount }
      );
      if (!isNil(newTabStopItem)) {
        event.preventDefault();
        event.stopPropagation();
        dispatch({
          type: 'updateTabStopOnKeyDown',
          payload: { items: tabStopItemsRef.current, newTabStopItem }
        });
      }
    },
    [keyDownTranslators, columnsCount]
  );

  const register = useCallback<(item: Item, node: HTMLElement) => void>(
    (item, node) => tabStopElementMapRef.current.set(item, node),
    []
  );

  const unregister = useCallback<(item: Item) => void>(
    (item) => tabStopElementMapRef.current.delete(item),
    []
  );

  const clicked = useCallback<(item: Item) => void>(
    (item) => {
      dispatch({
        type: 'updateTabStopOnClick',
        payload: {
          items: tabStopItemsRef.current,
          newTabStopItem: item,
          shouldFocus: shouldFocusOnClick
        }
      });
    },
    [shouldFocusOnClick]
  );

  const value = useMemo<RoverContextType>(
    () => ({
      onKeyDown,
      register,
      unregister,
      clicked,
      currentTabStopItem: state.currentTabStopItem
    }),
    [onKeyDown, register, unregister, clicked, state.currentTabStopItem]
  );

  return <RoverContext.Provider value={value}>{children}</RoverContext.Provider>;
};

export function useRoverContainer(): { onKeyDown: (event: KeyboardEvent<HTMLElement>) => void } {
  return { onKeyDown: useContext<RoverContextType>(RoverContext).onKeyDown };
}

export function useRoverTabStop(item: Item): {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>;
  tabIndex: number;
  onClick: MouseEventHandler<HTMLElement>;
} {
  const { register, unregister, clicked, currentTabStopItem } = useContext<RoverContextType>(RoverContext);

  const ref = useCallback(
    (node: HTMLElement) => (node ? register(item, node) : unregister(item)),
    [item, register, unregister]
  );

  const onClick = useCallback(() => clicked(item), [clicked, item]);

  return { ref, onClick, tabIndex: item === currentTabStopItem ? 0 : -1 };
}
