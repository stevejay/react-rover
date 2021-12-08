import { JSDOM } from 'jsdom';

import {
  extremesNavigation,
  horizontalNavigation,
  horizontalRadioGroupNavigation,
  runKeyDownTranslators,
  verticalNavigation
} from '@/keyDownTranslators';
import { KeyDownAction, KeyDownTranslator, TabStopsElementMap, TabStopsItems } from '@/types';

import { createTabStops } from './testUtils';

const arrowLeftEvent = { key: 'ArrowLeft' } as React.KeyboardEvent<Element>;
const arrowRightEvent = { key: 'ArrowRight' } as unknown as React.KeyboardEvent<Element>;
const arrowUpEvent = { key: 'ArrowUp' } as unknown as React.KeyboardEvent<Element>;
const arrowDownEvent = { key: 'ArrowDown' } as unknown as React.KeyboardEvent<Element>;
const homeKeyEvent = { key: 'Home' } as unknown as React.KeyboardEvent<Element>;
const endKeyEvent = { key: 'End' } as unknown as React.KeyboardEvent<Element>;

export function createTabStopsWithRadioGroupFromDOM(domString: string): [TabStopsItems, TabStopsElementMap] {
  const dom = new JSDOM(domString);

  const beforeButton = dom.window.document.getElementById('before') as HTMLButtonElement;
  const radioButtonOne = dom.window.document.getElementById('one') as HTMLButtonElement;
  const radioButtonTwo = dom.window.document.getElementById('two') as HTMLButtonElement;
  const radioButtonThree = dom.window.document.getElementById('three') as HTMLButtonElement;
  const afterButton = dom.window.document.getElementById('after') as HTMLButtonElement;

  return [
    ['before', 'one', 'two', 'three', 'after'],
    new Map([
      ['before', beforeButton],
      ['one', radioButtonOne],
      ['two', radioButtonTwo],
      ['three', radioButtonThree],
      ['after', afterButton]
    ])
  ];
}

describe('extremesNavigation', () => {
  describe('when navigating to the start', () => {
    it('should navigate to the start when all tab stops are enabled', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const result = extremesNavigation(homeKeyEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toEqual({ newTabStopId: 'one' });
    });

    it('should navigate to the first enabled tab stop when there are disabled tab stops', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: true }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const result = extremesNavigation(homeKeyEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should return the current tab stop when it is the first enabled tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: true }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const result = extremesNavigation(homeKeyEvent, tabStopsItems, tabStopsElementMap, 'two');
      expect(result).toEqual({ newTabStopId: 'two' });
    });
  });

  describe('when navigating to the end', () => {
    it('should navigate to the end when all tab stops are enabled', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const result = extremesNavigation(endKeyEvent, tabStopsItems, tabStopsElementMap, 'one');
      expect(result).toEqual({ newTabStopId: 'three' });
    });

    it('should navigate to the last enabled tab stop when there are disabled tab stops', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: true }]
      ]);
      const result = extremesNavigation(endKeyEvent, tabStopsItems, tabStopsElementMap, 'one');
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should return the current tab stop when it is the last enabled tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: true }]
      ]);
      const result = extremesNavigation(endKeyEvent, tabStopsItems, tabStopsElementMap, 'two');
      expect(result).toEqual({ newTabStopId: 'two' });
    });
  });

  it('should not respond to non-extremes navigation', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(extremesNavigation(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(extremesNavigation(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(extremesNavigation(arrowLeftEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(extremesNavigation(arrowRightEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
  });
});

describe('horizontalNavigation', () => {
  describe('when navigating forwards with wraparound', () => {
    it('should navigate forwards from the first tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowRightEvent, tabStopsItems, tabStopsElementMap, 'one');
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating forwards from the last tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowRightEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toEqual({ newTabStopId: 'one' });
    });
  });

  describe('when navigating forwards without wraparound', () => {
    it('should not wraparound when navigating forwards from the last tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation(false);
      const result = translator(arrowRightEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toBeNull();
    });
  });

  describe('when navigating backwards with wraparound', () => {
    it('should navigate backwards from the last tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowLeftEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating backwards from the first tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowLeftEvent, tabStopsItems, tabStopsElementMap, 'one');
      expect(result).toEqual({ newTabStopId: 'three' });
    });
  });

  describe('when navigating backwards without wraparound', () => {
    it('should not wraparound when navigating backwards from the first tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation(false);
      const result = translator(arrowLeftEvent, tabStopsItems, tabStopsElementMap, 'one');
      expect(result).toBeNull();
    });
  });

  it('should skip disabled tab stops when navigation forwards', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: true }]
    ]);
    const translator = horizontalNavigation();
    const result = translator(arrowRightEvent, tabStopsItems, tabStopsElementMap, 'two');
    expect(result).toEqual({ newTabStopId: 'one' });
  });

  it('should skip disabled tab stops when navigating backwards', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: true }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = horizontalNavigation();
    const result = translator(arrowLeftEvent, tabStopsItems, tabStopsElementMap, 'two');
    expect(result).toEqual({ newTabStopId: 'three' });
  });

  it('should not respond to non-horizontal navigation', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = horizontalNavigation();
    expect(translator(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(homeKeyEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(endKeyEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
  });
});

describe('verticalNavigation', () => {
  describe('when navigating down with wraparound', () => {
    it('should navigate down from the first tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'one');
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating down from the last tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toEqual({ newTabStopId: 'one' });
    });
  });

  describe('when navigating down without wraparound', () => {
    it('should not wraparound when navigating down from the last tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation(false);
      const result = translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toBeNull();
    });
  });

  describe('when navigating up with wraparound', () => {
    it('should navigate up from the last tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating up from the first tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'one');
      expect(result).toEqual({ newTabStopId: 'three' });
    });
  });

  describe('when navigating up without wraparound', () => {
    it('should not wraparound when navigating up from the first tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation(false);
      const result = translator(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'one');
      expect(result).toBeNull();
    });
  });

  it('should skip disabled tab stops when navigating down', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: true }]
    ]);
    const translator = verticalNavigation();
    const result = translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'two');
    expect(result).toEqual({ newTabStopId: 'one' });
  });

  it('should skip disabled tab stops when navigating up', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: true }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = verticalNavigation();
    const result = translator(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'two');
    expect(result).toEqual({ newTabStopId: 'three' });
  });

  it('should not respond to non-vertical navigation', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = verticalNavigation();
    expect(translator(arrowLeftEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(arrowRightEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(homeKeyEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(endKeyEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
  });
});

describe('horizontalRadioGroupNavigation', () => {
  describe('when navigating a radio group with wraparound', () => {
    it('should navigate forwards from the first radio group tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

      const translator = horizontalRadioGroupNavigation();
      const result = translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'one');
      expect(result).toEqual({ newTabStopId: 'two' });
    });

    it('should wraparound when navigating forwards from the last radio group tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

      const translator = horizontalRadioGroupNavigation();
      const result = translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toEqual({ newTabStopId: 'one' });
    });
  });

  describe('horizontalRadioGroupNavigation when navigating a radio group without wraparound', () => {
    it('should not wraparound when navigating forwards from the last radio group tab stop', () => {
      const [tabStopsItems, tabStopsElementMap] = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

      const translator = horizontalRadioGroupNavigation(false);
      const result = translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'three');
      expect(result).toBeNull();
    });
  });

  it('should skip disabled tab stops when navigating forwards in the radio group', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio" disabled></button>
        </div>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    const result = translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'two');
    expect(result).toEqual({ newTabStopId: 'one' });
  });

  it('should skip disabled tab stops when navigating backwards in the radio group', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio" disabled></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    const result = translator(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'two');
    expect(result).toEqual({ newTabStopId: 'three' });
  });

  it('should not respond to non- horizontal radio group navigation', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div role="radiogroup">
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    expect(translator(arrowLeftEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(arrowRightEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(homeKeyEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(endKeyEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
  });

  it('should not respond when the parent element does not have the radiogroup role', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <div>
            <button id='one' role="radio"></button>
            <button id='two' role="radio"></button>
            <button id='three' role="radio"></button>
        </div>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    expect(translator(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'one')).toBeNull();
    expect(translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'one')).toBeNull();
  });

  it('should not respond when the tab stop has the radio role but is not in a radio group', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStopsWithRadioGroupFromDOM(`
        <!DOCTYPE html>
        <button id='before'></button>
        <button id='one' role="radio"></button>
        <button id='two' role="radio"></button>
        <button id='three' role="radio"></button>
        <button id='after'></button>`);

    const translator = horizontalRadioGroupNavigation();
    expect(translator(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'one')).toBeNull();
    expect(translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'one')).toBeNull();
  });

  it('should not respond when the tab stop is not in a radio group', () => {
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = horizontalRadioGroupNavigation();
    expect(translator(arrowUpEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
    expect(translator(arrowDownEvent, tabStopsItems, tabStopsElementMap, 'two')).toBeNull();
  });
});

describe('runKeyDownTranslators', () => {
  const translatorThatReturnsNull: KeyDownTranslator = () => null;

  function translatorThatReturnsAnAction(action: KeyDownAction): KeyDownTranslator {
    return () => action;
  }

  it('returns null when no translators return an action', () => {
    const translators = [translatorThatReturnsNull, translatorThatReturnsNull];
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const result = runKeyDownTranslators(
      translators,
      tabStopsItems,
      tabStopsElementMap,
      'two',
      arrowDownEvent
    );
    expect(result).toBeNull();
  });

  it('returns null when the current tab stop is null', () => {
    const translators = [translatorThatReturnsAnAction({ newTabStopId: 'two' })];
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const result = runKeyDownTranslators(
      translators,
      tabStopsItems,
      tabStopsElementMap,
      null,
      arrowDownEvent
    );
    expect(result).toBeNull();
  });

  it('returns the first action returned by a translator', () => {
    const translators = [
      translatorThatReturnsAnAction({ newTabStopId: 'two' }),
      translatorThatReturnsAnAction({ newTabStopId: 'three' })
    ];
    const [tabStopsItems, tabStopsElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const result = runKeyDownTranslators(
      translators,
      tabStopsItems,
      tabStopsElementMap,
      'one',
      arrowDownEvent
    );
    expect(result).toEqual({ newTabStopId: 'two' });
  });
});
