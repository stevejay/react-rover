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

export type ReactRoverContextType = {
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  register: (item: Item, node: HTMLElement) => void;
  unregister: (item: Item) => void;
  clicked: (item: Item) => void;
  currentTabStopItem: Item | null;
};

export const ReactRoverContext = createContext<ReactRoverContextType>({
  onKeyDown: () => void 0,
  register: () => void 0,
  unregister: () => void 0,
  clicked: () => void 0,
  currentTabStopItem: null
});

export type ReactRoverOptions = {
  /**
   * The number of items in each row of a grid. Only applicable if using React
   * Rover in a grid.
   */
  columnsCount?: number;
  /**
   * The initially focusable tab stop. Pass a value here if possible to avoid a
   * double render of the entire rover.
   */
  initialItem?: Item | null;
  /**
   * Optional callback for when the currently focusable tab stop in the rover
   * changes.
   */
  onTabStopChange?: OnTabStopChange;
  /**
   * Pass `true` if you want the rover to apply focus to a tab stop when it is
   * clicked on. This is set to `false` by default.
   */
  shouldFocusOnClick?: boolean;
};

export type ReactRoverProviderProps = {
  /**
   * An array of keyDown translators that give the required tabbing behaviour.
   * Must be memoized or be a constant.
   */
  keyDownTranslators: KeyDownTranslator[];
} & ReactRoverOptions;

export const ReactRoverProvider: FC<ReactRoverProviderProps> = ({
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

  // Repair the rover state in the case that the current tab stop has just been
  // removed, or the toolbar is being created and initialItem is not set.
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

  // A memoized keyDown handler for the rover container that runs the keyDown
  // translators.
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

  // A memoized callback for registering a tab stop.
  const register = useCallback<(item: Item, node: HTMLElement) => void>((item, node) => {
    tabStopElementMapRef.current.set(item, node);
    tabStopItemsRef.current = addTabStopItem(tabStopItemsRef.current, tabStopElementMapRef.current, item);
  }, []);

  // A memoized callback for unregistering a tab stop.
  const unregister = useCallback<(item: Item) => void>((item) => {
    tabStopElementMapRef.current.delete(item);
    tabStopItemsRef.current = removeTabStopItem(tabStopItemsRef.current, item);
  }, []);

  // A memoized callback for when a tab stop is clicked on.
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

  // The context value, memoized.
  const value = useMemo<ReactRoverContextType>(
    () => ({
      onKeyDown,
      register,
      unregister,
      clicked,
      currentTabStopItem: state.currentTabStopItem
    }),
    [onKeyDown, register, unregister, clicked, state.currentTabStopItem]
  );

  return <ReactRoverContext.Provider value={value}>{children}</ReactRoverContext.Provider>;
};

/**
 * The hook for the element that contains the tab stops of the rover.
 * @param onKeyDown An optional user-supplied `onKeyDown` callback. This will be
 * invoked before the rover's `onKeyDown` callback. You can cancel the rover's
 * callback by adding a `preventReactRoverDefault` property to the event and
 * setting it to `true`. This callback does not need to be stable.
 * @returns The props (`onKeyDown`) that must be applied to the rover container
 * element.
 */
export function useReactRoverContainer(onKeyDown?: KeyboardEventHandler<HTMLElement>): {
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
} {
  const { onKeyDown: contextOnKeyDown } = useContext<ReactRoverContextType>(ReactRoverContext);

  // Store the user's onKeyDown handler on a ref so we always have access to the
  // latest value for it in the internalOnKeyDown handler without needing to add
  // the onKeyDown handler to that handler's deps array.
  const onKeyDownRef = useRef<KeyboardEventHandler<HTMLElement> | undefined>(onKeyDown);
  useIsomorphicLayoutEffect(() => {
    onKeyDownRef.current = onKeyDown;
  });

  // A memoized onKeyDown callback that wraps the user's onKeyDown callback (if
  // given) and the rover's onKeyDown callback.
  const combinedOnKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (elementIsEnabled(event.target)) {
        callAllEventHandlers<KeyboardEvent<HTMLElement>>(onKeyDownRef.current, () => {
          contextOnKeyDown(event);
        })(event);
      }
    },
    [contextOnKeyDown]
  );

  return { onKeyDown: combinedOnKeyDown };
}

/**
 * The hook for the element that contains the tab stops of the rover.
 * @param item The identifier object for this tab stop. This is most often
 * a string that is unique within the rover or an object that is unique
 * to this tab stop and does not change identity.
 * @param onClick An optional user-supplied `onClick` callback. This will be
 * invoked before the rover's `onClick` callback. You can cancel the rover's
 * callback by adding a `preventReactRoverDefault` property to the event and
 * setting it to `true`. This callback does not need to be stable.
 * @returns The props (`ref`, `tabIndex` and `onClick`) that must be applied to
 * the rover container element.
 */
export function useReactRoverTabStop(
  item: Item,
  onClick?: MouseEventHandler<HTMLElement>
): {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>;
  tabIndex: number;
  onClick: MouseEventHandler<HTMLElement>;
} {
  const { register, unregister, clicked, currentTabStopItem } =
    useContext<ReactRoverContextType>(ReactRoverContext);

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

  // A memoized onClick callback that wraps the user's onClick callback (if
  // given) and the rover's onClick callback.
  const combinedOnClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (elementIsEnabled(event.target)) {
        callAllEventHandlers<MouseEvent<HTMLElement>>(onClickRef.current, () => {
          clicked(item);
        })(event);
      }
    },
    [clicked, item]
  );

  return { ref, onClick: combinedOnClick, tabIndex: item === currentTabStopItem ? 0 : -1 };
}
