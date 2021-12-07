import { JSDOM } from 'jsdom';

import {
  extremesNavigation,
  horizontalRadioGroupNavigation,
  runKeyDownTranslators
} from './keyDownTranslators';
import { createTabStops } from './testUtils';
import { horizontalNavigation, KeyDownAction, KeyDownTranslator, TabStop, verticalNavigation } from '.';

const arrowLeftEvent = { key: 'ArrowLeft' } as React.KeyboardEvent<Element>;
const arrowRightEvent = { key: 'ArrowRight' } as unknown as React.KeyboardEvent<Element>;
const arrowUpEvent = { key: 'ArrowUp' } as unknown as React.KeyboardEvent<Element>;
const arrowDownEvent = { key: 'ArrowDown' } as unknown as React.KeyboardEvent<Element>;
const homeKeyEvent = { key: 'Home' } as unknown as React.KeyboardEvent<Element>;
const endKeyEvent = { key: 'End' } as unknown as React.KeyboardEvent<Element>;

export function createTabStopsWithRadioGroupFromDOM(domString: string): TabStop[] {
  const dom = new JSDOM(domString);

  const beforeButton = dom.window.document.getElementById('before') as HTMLButtonElement;
  const radioButtonOne = dom.window.document.getElementById('one') as HTMLButtonElement;
  const radioButtonTwo = dom.window.document.getElementById('two') as HTMLButtonElement;
  const radioButtonThree = dom.window.document.getElementById('three') as HTMLButtonElement;
  const afterButton = dom.window.document.getElementById('after') as HTMLButtonElement;

  return [
    { id: 'before', element: beforeButton },
    { id: 'one', element: radioButtonOne },
    { id: 'two', element: radioButtonTwo },
    { id: 'three', element: radioButtonThree },
    { id: 'after', element: afterButton }
  ];
}

describe('extremesNavigation', () => {
  describe('when navigating to the start', () => {
    it('should navigate to the start when all tab stops are enabled', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const result = extremesNavigation(homeKeyEvent, tabStops, tabStops[2]);
      expect(result).toEqual({ newTabStopId: 'one' });
    });

    it('should navigate to the first enabled tab stop when there are disabled tab stops', () => {
      const tabStops = createTabStops([
        ['one', { disabled: true }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const result = extremesNavigation(homeKeyEvent, tabStops, tabStops[2]);
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should return the current tab stop when it is the first enabled tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: true }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const result = extremesNavigation(homeKeyEvent, tabStops, tabStops[1]);
      expect(result).toEqual({ newTabStopId: 'two' });
    });
  });

  describe('when navigating to the end', () => {
    it('should navigate to the end when all tab stops are enabled', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const result = extremesNavigation(endKeyEvent, tabStops, tabStops[0]);
      expect(result).toEqual({ newTabStopId: 'three' });
    });

    it('should navigate to the last enabled tab stop when there are disabled tab stops', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: true }]
      ]);
      const result = extremesNavigation(endKeyEvent, tabStops, tabStops[0]);
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should return the current tab stop when it is the last enabled tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: true }]
      ]);
      const result = extremesNavigation(endKeyEvent, tabStops, tabStops[1]);
      expect(result).toEqual({ newTabStopId: 'two' });
    });
  });

  it('should not respond to non-extremes navigation', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(extremesNavigation(arrowUpEvent, tabStops, tabStops[1])).toBeNull();
    expect(extremesNavigation(arrowDownEvent, tabStops, tabStops[1])).toBeNull();
    expect(extremesNavigation(arrowLeftEvent, tabStops, tabStops[1])).toBeNull();
    expect(extremesNavigation(arrowRightEvent, tabStops, tabStops[1])).toBeNull();
  });
});

describe('horizontalNavigation', () => {
  describe('when navigating forwards with wraparound', () => {
    it('should navigate forwards from the first tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowRightEvent, tabStops, tabStops[0]);
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating forwards from the last tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowRightEvent, tabStops, tabStops[2]);
      expect(result).toEqual({ newTabStopId: 'one' });
    });
  });

  describe('when navigating forwards without wraparound', () => {
    it('should not wraparound when navigating forwards from the last tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation(false);
      const result = translator(arrowRightEvent, tabStops, tabStops[2]);
      expect(result).toBeNull();
    });
  });

  describe('when navigating backwards with wraparound', () => {
    it('should navigate backwards from the last tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowLeftEvent, tabStops, tabStops[2]);
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating backwards from the first tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowLeftEvent, tabStops, tabStops[0]);
      expect(result).toEqual({ newTabStopId: 'three' });
    });
  });

  describe('when navigating backwards without wraparound', () => {
    it('should not wraparound when navigating backwards from the first tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation(false);
      const result = translator(arrowLeftEvent, tabStops, tabStops[0]);
      expect(result).toBeNull();
    });
  });

  it('should skip disabled tab stops when navigation forwards', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: true }]
    ]);
    const translator = horizontalNavigation();
    const result = translator(arrowRightEvent, tabStops, tabStops[1]);
    expect(result).toEqual({ newTabStopId: 'one' });
  });

  it('should skip disabled tab stops when navigating backwards', () => {
    const tabStops = createTabStops([
      ['one', { disabled: true }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = horizontalNavigation();
    const result = translator(arrowLeftEvent, tabStops, tabStops[1]);
    expect(result).toEqual({ newTabStopId: 'three' });
  });

  it('should not respond to non-horizontal navigation', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = horizontalNavigation();
    expect(translator(arrowUpEvent, tabStops, tabStops[1])).toBeNull();
    expect(translator(arrowDownEvent, tabStops, tabStops[1])).toBeNull();
    expect(translator(homeKeyEvent, tabStops, tabStops[1])).toBeNull();
    expect(translator(endKeyEvent, tabStops, tabStops[1])).toBeNull();
  });
});

describe('verticalNavigation', () => {
  describe('when navigating down with wraparound', () => {
    it('should navigate down from the first tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowDownEvent, tabStops, tabStops[0]);
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating down from the last tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowDownEvent, tabStops, tabStops[2]);
      expect(result).toEqual({ newTabStopId: 'one' });
    });
  });

  describe('when navigating down without wraparound', () => {
    it('should not wraparound when navigating down from the last tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation(false);
      const result = translator(arrowDownEvent, tabStops, tabStops[2]);
      expect(result).toBeNull();
    });
  });

  describe('when navigating up with wraparound', () => {
    it('should navigate up from the last tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowUpEvent, tabStops, tabStops[2]);
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating up from the first tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowUpEvent, tabStops, tabStops[0]);
      expect(result).toEqual({ newTabStopId: 'three' });
    });
  });

  describe('when navigating up without wraparound', () => {
    it('should not wraparound when navigating up from the first tab stop', () => {
      const tabStops = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation(false);
      const result = translator(arrowUpEvent, tabStops, tabStops[0]);
      expect(result).toBeNull();
    });
  });

  it('should skip disabled tab stops when navigating down', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: true }]
    ]);
    const translator = verticalNavigation();
    const result = translator(arrowDownEvent, tabStops, tabStops[1]);
    expect(result).toEqual({ newTabStopId: 'one' });
  });

  it('should skip disabled tab stops when navigating up', () => {
    const tabStops = createTabStops([
      ['one', { disabled: true }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = verticalNavigation();
    const result = translator(arrowUpEvent, tabStops, tabStops[1]);
    expect(result).toEqual({ newTabStopId: 'three' });
  });

  it('should not respond to non-vertical navigation', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = verticalNavigation();
    expect(translator(arrowLeftEvent, tabStops, tabStops[1])).toBeNull();
    expect(translator(arrowRightEvent, tabStops, tabStops[1])).toBeNull();
    expect(translator(homeKeyEvent, tabStops, tabStops[1])).toBeNull();
    expect(translator(endKeyEvent, tabStops, tabStops[1])).toBeNull();
  });
});

describe('horizontalRadioGroupNavigation', () => {
  describe('when navigating a radio group with wraparound', () => {
    it('should navigate forwards from the first radio group tab stop', () => {
      const tabStops = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

      const translator = horizontalRadioGroupNavigation();
      const result = translator(arrowDownEvent, tabStops, tabStops[1]);
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating forwards from the last radio group tab stop', () => {
      const tabStops = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

      const translator = horizontalRadioGroupNavigation();
      const result = translator(arrowDownEvent, tabStops, tabStops[3]);
      expect(result).toEqual({ newTabStopId: 'one' });
    });
  });

  describe('horizontalRadioGroupNavigation when navigating a radio group without wraparound', () => {
    it('should not wraparound when navigating forwards from the last radio group tab stop', () => {
      const tabStops = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

      const translator = horizontalRadioGroupNavigation(false);
      const result = translator(arrowDownEvent, tabStops, tabStops[3]);
      expect(result).toBeNull();
    });
  });

  it('should skip disabled tab stops when navigating forwards in the radio group', () => {
    const tabStops = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio" disabled></button>
        </div>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    const result = translator(arrowDownEvent, tabStops, tabStops[2]);
    expect(result).toEqual({ newTabStopId: 'one' });
  });

  it('should skip disabled tab stops when navigating backwards in the radio group', () => {
    const tabStops = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio" disabled></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    const result = translator(arrowUpEvent, tabStops, tabStops[2]);
    expect(result).toEqual({ newTabStopId: 'three' });
  });

  it('should not respond to non- horizontal radio group navigation', () => {
    const tabStops = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    expect(translator(arrowLeftEvent, tabStops, tabStops[2])).toBeNull();
    expect(translator(arrowRightEvent, tabStops, tabStops[2])).toBeNull();
    expect(translator(homeKeyEvent, tabStops, tabStops[2])).toBeNull();
    expect(translator(endKeyEvent, tabStops, tabStops[2])).toBeNull();
  });

  it('should not respond when the parent element does not have the radiogroup role', () => {
    const tabStops = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div>
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    expect(translator(arrowUpEvent, tabStops, tabStops[1])).toBeNull();
    expect(translator(arrowDownEvent, tabStops, tabStops[1])).toBeNull();
  });

  it('should not respond when the tab stop has the radio role but is not in a radio group', () => {
    const tabStops = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <button id='one' role="radio"></button>
        <button id='two' role="radio"></button>
        <button id='three' role="radio"></button>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    expect(translator(arrowUpEvent, tabStops, tabStops[1])).toBeNull();
    expect(translator(arrowDownEvent, tabStops, tabStops[1])).toBeNull();
  });

  it('should not respond when the tab stop is not in a radio group', () => {
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = horizontalRadioGroupNavigation();
    expect(translator(arrowUpEvent, tabStops, tabStops[1])).toBeNull();
    expect(translator(arrowDownEvent, tabStops, tabStops[1])).toBeNull();
  });
});

describe('runKeyDownTranslators', () => {
  const translatorThatReturnsNull: KeyDownTranslator = () => null;

  function translatorThatReturnsAnAction(action: KeyDownAction): KeyDownTranslator {
    return () => action;
  }

  it('returns null when no translators return an action', () => {
    const translators = [translatorThatReturnsNull, translatorThatReturnsNull];
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const result = runKeyDownTranslators(translators, tabStops, 'two', arrowDownEvent);
    expect(result).toBeNull();
  });

  it('returns null when the current tab stop is not found', () => {
    const translators = [translatorThatReturnsAnAction({ newTabStopId: 'two' })];
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const result = runKeyDownTranslators(translators, tabStops, 'unknown', arrowDownEvent);
    expect(result).toBeNull();
  });

  it('returns the first action returned by a translator', () => {
    const translators = [
      translatorThatReturnsAnAction({ newTabStopId: 'two' }),
      translatorThatReturnsAnAction({ newTabStopId: 'three' })
    ];
    const tabStops = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const result = runKeyDownTranslators(translators, tabStops, 'one', arrowDownEvent);
    expect(result).toEqual({ newTabStopId: 'two' });
  });
});
