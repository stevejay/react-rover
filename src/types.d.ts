type TabStopId = string;
type TabStop = { id: TabStopId; element: HTMLElement };
type TabStopsList = TabStop[];

type State = {
  currentTabStopId: TabStopId | null;
  shouldFocus: boolean;
};

type Action =
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

type KeyDownAction = {
  newTabStopId: TabStopId;
};

type KeyDownTranslator = (
  event: React.KeyboardEvent,
  tabStops: TabStopsList,
  currentTabStop: TabStop
) => KeyDownAction | null;

type EditorState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  justify: 'left' | 'right' | 'center';
  nightMode: boolean;
  fontSize: number;
  fontFamily: string;
  fontFamilies: string[];
  text: string;
};
