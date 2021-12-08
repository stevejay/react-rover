// This file has a .ts rather than a .d.ts extension in order to
// simplify type file generation: https://stackoverflow.com/a/56440335/604006

export type Item = string | object;
export type ItemList = Item[];
export type ItemToElementMap = Map<Item, HTMLElement>;

export type State = {
  currentTabStopItem: Item | null;
  shouldFocus: boolean;
};

export type Action =
  | {
      type: 'resetTabStop';
      payload: {
        items: ItemList;
        itemToElementMap: ItemToElementMap;
        initialItem: Item | null;
      };
    }
  | {
      type: 'updateTabStopOnClick';
      payload: {
        items: ItemList;
        newTabStopItem: Item;
        shouldFocus: boolean;
      };
    }
  | {
      type: 'updateTabStopOnKeyDown';
      payload: {
        items: ItemList;
        newTabStopItem: Item;
      };
    };

export type KeyDownAction = {
  newTabStopItem: Item;
};

export type KeyDownTranslator = (
  event: React.KeyboardEvent,
  items: ItemList,
  itemToElementMap: ItemToElementMap,
  currentTabStopItem: Item
) => KeyDownAction | null;
