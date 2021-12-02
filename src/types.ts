// This file has a .ts rather than a .d.ts extension in order
// to simplify type file generation: https://stackoverflow.com/a/56440335/604006

export type TabStopId = string;
export type TabStop = { id: TabStopId; element: HTMLElement };
export type TabStopsList = TabStop[];

export type State = {
  currentTabStopId: TabStopId | null;
  shouldFocus: boolean;
};

export type Action =
  | {
      type: 'resetTabStop';
      payload: { tabStops: TabStopsList; initialTabStopId: TabStopId | null };
    }
  | {
      type: 'updateTabStopOnClick';
      payload: {
        tabStops: TabStopsList;
        newTabStopId: TabStopId;
        shouldFocus: boolean;
      };
    }
  | {
      type: 'updateTabStopOnKeyDown';
      payload: {
        tabStops: TabStopsList;
        newTabStopId: TabStopId;
      };
    };

export type KeyDownAction = {
  newTabStopId: TabStopId;
};

export type KeyDownTranslator = (
  event: React.KeyboardEvent,
  tabStops: TabStopsList,
  currentTabStop: TabStop
) => KeyDownAction | null;
