// This file has a .ts rather than a .d.ts extension in order to
// simplify type file generation: https://stackoverflow.com/a/56440335/604006

export type TabStopId = string;
export type TabStopsItems = TabStopId[];
export type TabStopsElementMap = Map<TabStopId, HTMLElement>;

export type State = {
  currentTabStopId: TabStopId | null;
  shouldFocus: boolean;
};

export type Action =
  | {
      type: 'resetTabStop';
      payload: {
        tabStopsItems: TabStopsItems;
        tabStopsElementMap: TabStopsElementMap;
        initialTabStopId: TabStopId | null;
      };
    }
  | {
      type: 'updateTabStopOnClick';
      payload: {
        tabStopsItems: TabStopsItems;
        newTabStopId: TabStopId;
        shouldFocus: boolean;
      };
    }
  | {
      type: 'updateTabStopOnKeyDown';
      payload: {
        tabStopsItems: TabStopsItems;
        newTabStopId: TabStopId;
      };
    };

export type KeyDownAction = {
  newTabStopId: TabStopId;
};

export type KeyDownTranslator = (
  event: React.KeyboardEvent,
  tabStopsItems: TabStopsItems,
  tabStopsElementMap: TabStopsElementMap,
  currentTabStopId: TabStopId
) => KeyDownAction | null;
