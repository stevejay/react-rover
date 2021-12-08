import { KeyDownTranslator } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Item = any;

type GetTabContainerProps = (props?: { onKeyDown?: React.KeyboardEventHandler<HTMLElement> }) => {
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
};

type GetTabStopProps = (
  item: Item,
  rowIndex?: number,
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

// TODO extract?
export type OnCurrentItemChange = (item: Item | null) => void;

export type ItemRoverOptions = {
  initialItem?: Item | null;
  onCurrentItemChange?: OnCurrentItemChange;
  shouldFocusOnClick?: boolean;
};

export type ItemRoverResult = {
  currentItem: Item | null;
  getTabContainerProps: GetTabContainerProps;
  getTabStopProps: GetTabStopProps;
};

export function useItemRover(
  items: Item[],
  _keyDownTranslators: KeyDownTranslator[],
  _options: ItemRoverOptions = {}
): ItemRoverResult {
  //   const tabStopsMapRef = useRef<TabStopsMap>(new Map());

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    currentItem: items.length ? items[0] : null,
    getTabContainerProps: () => ({
      onKeyDown: () => void 0
    }),
    getTabStopProps: () => ({
      ref: null,
      tabIndex: -1,
      onClick: () => void 0
    })
  };
}
