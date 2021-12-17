import {
  createContext,
  FC,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';

import { callAllEventHandlers, elementIsEnabled, useIsomorphicLayoutEffect } from '@/domUtils';
import { runKeyDownTranslators } from '@/keyDownTranslators';
import { roverReducer } from '@/roverReducer';
import {
  addTabStopItem,
  focusTabStopItem,
  removeTabStopItem,
  shouldResetCurrentTabStopItem
} from '@/tabStopUtils';
import { Item, ItemList, KeyDownTranslator } from '@/types';

import { isNil } from './utils';

export type OnTabStopChange = (item: Item | null) => void;

export type ItemRoverOptions = {
  columnsCount?: number;
  initialItem?: Item | null;
  onTabStopChange?: OnTabStopChange;
  shouldFocusOnClick?: boolean;
};

export type ToolbarRoverContextType = {
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  register: (item: Item, node: HTMLElement) => void;
  unregister: (item: Item) => void;
  clicked: (item: Item) => void;
  currentTabStopItem: Item | null;
};

export const ToolbarRoverContext = createContext<ToolbarRoverContextType>({
  onKeyDown: () => void 0,
  register: () => void 0,
  unregister: () => void 0,
  clicked: () => void 0,
  currentTabStopItem: null
});

export type ToolbarRoverProviderProps = {
  /** Must be memoized or be a constant. */
  keyDownTranslators: KeyDownTranslator[];
} & ItemRoverOptions;

export const ToolbarRoverProvider: FC<ToolbarRoverProviderProps> = ({
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

  const register = useCallback<(item: Item, node: HTMLElement) => void>((item, node) => {
    tabStopElementMapRef.current.set(item, node);
    tabStopItemsRef.current = addTabStopItem(tabStopItemsRef.current, tabStopElementMapRef.current, item);
  }, []);

  const unregister = useCallback<(item: Item) => void>((item) => {
    tabStopElementMapRef.current.delete(item);
    tabStopItemsRef.current = removeTabStopItem(tabStopItemsRef.current, item);
  }, []);

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

  const value = useMemo<ToolbarRoverContextType>(
    () => ({
      onKeyDown,
      register,
      unregister,
      clicked,
      currentTabStopItem: state.currentTabStopItem
    }),
    [onKeyDown, register, unregister, clicked, state.currentTabStopItem]
  );

  return <ToolbarRoverContext.Provider value={value}>{children}</ToolbarRoverContext.Provider>;
};

export function useToolbarRoverContainer(onKeyDown?: KeyboardEventHandler<HTMLElement>): {
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
} {
  const { onKeyDown: contextOnKeyDown } = useContext<ToolbarRoverContextType>(ToolbarRoverContext);

  // Store the user's onKeyDown handler on a ref so we always have access to the
  // latest value for it in the internalOnKeyDown handler without needing to add the
  // onKeyDown handler to that handler's deps array.
  const onKeyDownRef = useRef<KeyboardEventHandler<HTMLElement> | undefined>(onKeyDown);
  useIsomorphicLayoutEffect(() => {
    onKeyDownRef.current = onKeyDown;
  });

  const internalOnKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (elementIsEnabled(event.target)) {
        callAllEventHandlers<KeyboardEvent<HTMLElement>>(onKeyDownRef.current, () => {
          contextOnKeyDown(event);
        })(event);
      }
    },
    [contextOnKeyDown]
  );

  return { onKeyDown: internalOnKeyDown };
}

export function useToolbarRoverTabStop(
  item: Item,
  onClick?: MouseEventHandler<HTMLElement>
): {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>;
  tabIndex: number;
  onClick: MouseEventHandler<HTMLElement>;
} {
  const { register, unregister, clicked, currentTabStopItem } =
    useContext<ToolbarRoverContextType>(ToolbarRoverContext);

  const ref = useCallback(
    (node: HTMLElement) => (node ? register(item, node) : unregister(item)),
    [item, register, unregister]
  );

  // Store the user's onClick handler on a ref so we always have access to the
  // latest value for it in the internalOnClick handler without needing to add the
  // onClick handler to that handler's deps array.
  const onClickRef = useRef<MouseEventHandler<HTMLElement> | undefined>(onClick);
  useIsomorphicLayoutEffect(() => {
    onClickRef.current = onClick;
  });

  const internalOnClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (elementIsEnabled(event.target)) {
        callAllEventHandlers<MouseEvent<HTMLElement>>(onClickRef.current, () => {
          clicked(item);
        })(event);
      }
    },
    [clicked, item]
  );

  return { ref, onClick: internalOnClick, tabIndex: item === currentTabStopItem ? 0 : -1 };
}
