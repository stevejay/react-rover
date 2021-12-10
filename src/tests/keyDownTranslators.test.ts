import type { KeyboardEvent } from 'react';
import { JSDOM } from 'jsdom';

import {
  extremesNavigation,
  getNextEnabledTabStopItem,
  gridExtremesNavigation,
  gridRowExtremesNavigation,
  gridSingleStepNavigation,
  horizontalNavigation,
  runKeyDownTranslators,
  verticalNavigation
} from '@/keyDownTranslators';
import { Item, ItemList, ItemToElementMap, KeyDownTranslator } from '@/types';

import { createTabStops } from './testUtils';

const arrowLeftEvent = { key: 'ArrowLeft' } as KeyboardEvent<Element>;
const arrowRightEvent = { key: 'ArrowRight' } as unknown as KeyboardEvent<Element>;
const arrowUpEvent = { key: 'ArrowUp' } as unknown as KeyboardEvent<Element>;
const arrowDownEvent = { key: 'ArrowDown' } as unknown as KeyboardEvent<Element>;
const homeKeyEvent = { key: 'Home' } as unknown as KeyboardEvent<Element>;
const endKeyEvent = { key: 'End' } as unknown as KeyboardEvent<Element>;
const ctrlHomeKeyEvent = {
  key: 'Home',
  ctrlKey: true
} as unknown as KeyboardEvent<Element>;
const ctrlEndKeyEvent = {
  key: 'End',
  ctrlKey: true
} as unknown as KeyboardEvent<Element>;

export function createTabStopsWithRadioGroupFromDOM(domString: string): [ItemList, ItemToElementMap] {
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
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: false }]
      ]);
      const translator = extremesNavigation();
      const result = translator(homeKeyEvent, items, itemToElementMap, 'three');
      expect(result).toBe('one');
    });

    it('should navigate to the first enabled tab stop when there are disabled tab stops', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: true }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: false }]
      ]);
      const translator = extremesNavigation();
      const result = translator(homeKeyEvent, items, itemToElementMap, 'four');
      expect(result).toBe('two');
    });

    it('should return null when the current tab stop is the first enabled tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: true }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = extremesNavigation();
      const result = translator(homeKeyEvent, items, itemToElementMap, 'two');
      expect(result).toBeNull();
    });
  });

  describe('when navigating to the end', () => {
    it('should navigate to the end when all tab stops are enabled', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: false }]
      ]);
      const translator = extremesNavigation();
      const result = translator(endKeyEvent, items, itemToElementMap, 'two');
      expect(result).toBe('four');
    });

    it('should navigate to the last enabled tab stop when there are disabled tab stops', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: true }]
      ]);
      const translator = extremesNavigation();
      const result = translator(endKeyEvent, items, itemToElementMap, 'one');
      expect(result).toBe('three');
    });

    it('should return null when the current tab stop is the last enabled tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: true }]
      ]);
      const translator = extremesNavigation();
      const result = translator(endKeyEvent, items, itemToElementMap, 'two');
      expect(result).toBeNull();
    });
  });

  it('should not respond to non-extremes navigation', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = extremesNavigation();
    expect(translator(arrowUpEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(arrowDownEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(arrowLeftEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(arrowRightEvent, items, itemToElementMap, 'two')).toBeNull();
  });
});

describe('horizontalNavigation', () => {
  describe('when navigating forwards with wraparound', () => {
    it('should navigate forwards from the first tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowRightEvent, items, itemToElementMap, 'one');
      expect(result).toBe('two');
    });

    it('should wraparound when navigating forwards from the last tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowRightEvent, items, itemToElementMap, 'three');
      expect(result).toBe('one');
    });

    it('should skip disabled tab stops when wrapping around', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: true }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowRightEvent, items, itemToElementMap, 'three');
      expect(result).toBe('one');
    });
  });

  describe('when navigating forwards without wraparound', () => {
    it('should not wraparound when navigating forwards from the last tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation(false);
      const result = translator(arrowRightEvent, items, itemToElementMap, 'three');
      expect(result).toBeNull();
    });
  });

  describe('when navigating backwards with wraparound', () => {
    it('should navigate backwards from the last tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowLeftEvent, items, itemToElementMap, 'three');
      expect(result).toBe('two');
    });

    it('should wraparound when navigating backwards from the first tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowLeftEvent, items, itemToElementMap, 'one');
      expect(result).toBe('three');
    });

    it('should skip disabled tab stops when wrapping around', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: true }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: false }]
      ]);
      const translator = horizontalNavigation();
      const result = translator(arrowLeftEvent, items, itemToElementMap, 'two');
      expect(result).toBe('four');
    });
  });

  describe('when navigating backwards without wraparound', () => {
    it('should not wraparound when navigating backwards from the first tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = horizontalNavigation(false);
      const result = translator(arrowLeftEvent, items, itemToElementMap, 'one');
      expect(result).toBeNull();
    });
  });

  it('should not respond to non-horizontal navigation', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = horizontalNavigation();
    expect(translator(arrowUpEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(arrowDownEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(homeKeyEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(endKeyEvent, items, itemToElementMap, 'two')).toBeNull();
  });
});

describe('verticalNavigation', () => {
  describe('when navigating down with wraparound', () => {
    it('should navigate down from the first tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowDownEvent, items, itemToElementMap, 'one');
      expect(result).toBe('two');
    });

    it('should wraparound when navigating down from the last tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowDownEvent, items, itemToElementMap, 'three');
      expect(result).toBe('one');
    });

    it('should skip disabled tab stops when wrapping around', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: true }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowDownEvent, items, itemToElementMap, 'three');
      expect(result).toBe('one');
    });
  });

  describe('when navigating down without wraparound', () => {
    it('should not wraparound when navigating down from the last tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation(false);
      const result = translator(arrowDownEvent, items, itemToElementMap, 'three');
      expect(result).toBeNull();
    });
  });

  describe('when navigating up with wraparound', () => {
    it('should navigate up from the last tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowUpEvent, items, itemToElementMap, 'three');
      expect(result).toBe('two');
    });

    it('should wraparound when navigating up from the first tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowUpEvent, items, itemToElementMap, 'one');
      expect(result).toBe('three');
    });

    it('should skip disabled tab stops when navigating up', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: true }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: false }]
      ]);
      const translator = verticalNavigation();
      const result = translator(arrowUpEvent, items, itemToElementMap, 'two');
      expect(result).toBe('four');
    });
  });

  describe('when navigating up without wraparound', () => {
    it('should not wraparound when navigating up from the first tab stop', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }]
      ]);
      const translator = verticalNavigation(false);
      const result = translator(arrowUpEvent, items, itemToElementMap, 'one');
      expect(result).toBeNull();
    });
  });

  it('should not respond to non-vertical navigation', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = verticalNavigation();
    expect(translator(arrowLeftEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(arrowRightEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(homeKeyEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(endKeyEvent, items, itemToElementMap, 'two')).toBeNull();
  });
});

describe('runKeyDownTranslators', () => {
  const translatorThatReturnsNull: KeyDownTranslator = () => null;

  function translatorThatReturns(item: Item): KeyDownTranslator {
    return () => item;
  }

  it('returns null when no translators return an action', () => {
    const translators = [translatorThatReturnsNull, translatorThatReturnsNull];
    const result = runKeyDownTranslators(translators, arrowDownEvent, [], new Map(), 'two');
    expect(result).toBeNull();
  });

  it('returns null when the current tab stop is null', () => {
    const translators = [translatorThatReturns('two')];
    const result = runKeyDownTranslators(translators, arrowDownEvent, [], new Map(), null);
    expect(result).toBeNull();
  });

  it('returns the first action returned by a translator', () => {
    const translators = [translatorThatReturns('two'), translatorThatReturns('three')];
    const result = runKeyDownTranslators(translators, arrowDownEvent, [], new Map(), 'one');
    expect(result).toBe('two');
  });
});

describe('gridExtremesNavigation', () => {
  describe('when Ctrl+Home is pressed', () => {
    it('should navigate to the start of the grid', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: false }],
        ['five', { disabled: false }]
      ]);
      const translator = gridExtremesNavigation();
      const result = translator(ctrlHomeKeyEvent, items, itemToElementMap, 'four');
      expect(result).toBe('one');
    });

    it('should navigate to the first enabled tab stop when the first tab stop is disabled', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: true }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: false }],
        ['five', { disabled: false }]
      ]);
      const translator = gridExtremesNavigation();
      const result = translator(ctrlHomeKeyEvent, items, itemToElementMap, 'four');
      expect(result).toBe('two');
    });
  });

  describe('when Ctrl+End is pressed', () => {
    it('should navigate to the end of the grid', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: false }],
        ['five', { disabled: false }]
      ]);
      const translator = gridExtremesNavigation();
      const result = translator(ctrlEndKeyEvent, items, itemToElementMap, 'two');
      expect(result).toBe('five');
    });

    it('should navigate to the last enabled tab stop when the last tab stop is disabled', () => {
      const [items, itemToElementMap] = createTabStops([
        ['one', { disabled: false }],
        ['two', { disabled: false }],
        ['three', { disabled: false }],
        ['four', { disabled: false }],
        ['five', { disabled: true }]
      ]);
      const translator = gridExtremesNavigation();
      const result = translator(ctrlEndKeyEvent, items, itemToElementMap, 'two');
      expect(result).toBe('four');
    });
  });

  it('should not respond to non-extremes navigation', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    const translator = gridExtremesNavigation();
    expect(translator(arrowLeftEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(arrowRightEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(homeKeyEvent, items, itemToElementMap, 'two')).toBeNull();
    expect(translator(endKeyEvent, items, itemToElementMap, 'two')).toBeNull();
  });
});

describe('gridRowExtremesNavigation', () => {
  describe('when Home is pressed', () => {
    it('should navigate to the start of the current row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridRowExtremesNavigation();
      const result = translator(homeKeyEvent, items, itemToElementMap, 'two-three', {
        columnsCount: 4
      });
      expect(result).toBe('two-one');
    });

    it('should navigate to the first enabled tab stop of the current row when the first tab stop is disabled', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: true }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridRowExtremesNavigation();
      const result = translator(homeKeyEvent, items, itemToElementMap, 'two-four', {
        columnsCount: 4
      });
      expect(result).toBe('two-two');
    });
  });

  describe('when End is pressed', () => {
    it('should navigate to the end of the current row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridRowExtremesNavigation();
      const result = translator(endKeyEvent, items, itemToElementMap, 'one-two', {
        columnsCount: 4
      });
      expect(result).toBe('one-four');
    });

    it('should navigate to the end of a final ragged row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }]
      ]);
      const translator = gridRowExtremesNavigation();
      const result = translator(endKeyEvent, items, itemToElementMap, 'two-one', {
        columnsCount: 4
      });
      expect(result).toBe('two-three');
    });

    it('should navigate to the last enabled tab stop of the current row when the last tab stop is disabled', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: true }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridRowExtremesNavigation();
      const result = translator(endKeyEvent, items, itemToElementMap, 'one-one', {
        columnsCount: 4
      });
      expect(result).toBe('one-three');
    });
  });

  it('should not respond to non- row extremes navigation', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one-one', { disabled: false }],
      ['one-two', { disabled: false }],
      ['one-three', { disabled: false }]
    ]);

    const translator = gridRowExtremesNavigation();
    const options = { columnsCount: 3 };

    expect(translator(arrowLeftEvent, items, itemToElementMap, 'one-two', options)).toBeNull();
    expect(translator(arrowRightEvent, items, itemToElementMap, 'one-two', options)).toBeNull();
    expect(translator(ctrlHomeKeyEvent, items, itemToElementMap, 'one-two', options)).toBeNull();
    expect(translator(ctrlEndKeyEvent, items, itemToElementMap, 'one-two', options)).toBeNull();
    expect(translator(endKeyEvent, items, itemToElementMap, 'unknown', options)).toBeNull();
    expect(translator(endKeyEvent, items, itemToElementMap, 'one-two')).toBeNull();
  });
});

describe('gridSingleStepNavigation', () => {
  describe('when ArrowLeft is pressed', () => {
    it('should navigate one tab stop to the left in the current row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowLeftEvent, items, itemToElementMap, 'two-three', {
        columnsCount: 4
      });
      expect(result).toBe('two-two');
    });

    it('should navigate over a disabled tab stop to the left in the current row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: true }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowLeftEvent, items, itemToElementMap, 'two-three', {
        columnsCount: 4
      });
      expect(result).toBe('two-one');
    });

    it('should not navigate when at the start of the row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowLeftEvent, items, itemToElementMap, 'two-one', {
        columnsCount: 4
      });
      expect(result).toBeNull();
    });

    it('should not navigate when there are only disabled tab stops to the left in the current row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: true }],
        ['two-two', { disabled: true }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowLeftEvent, items, itemToElementMap, 'two-three', {
        columnsCount: 4
      });
      expect(result).toBeNull();
    });
  });

  describe('when ArrowRight is pressed', () => {
    it('should navigate one tab stop to the right in the current row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowRightEvent, items, itemToElementMap, 'one-two', {
        columnsCount: 4
      });
      expect(result).toBe('one-three');
    });

    it('should navigate over a disabled tab stop to the right in the current row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: true }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowRightEvent, items, itemToElementMap, 'one-two', {
        columnsCount: 4
      });
      expect(result).toBe('one-four');
    });

    it('should not navigate when at the end of the row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        ['one-four', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowRightEvent, items, itemToElementMap, 'one-four', {
        columnsCount: 4
      });
      expect(result).toBeNull();
    });

    it('should not navigate when there are only disabled tab stops to the right in the current row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: true }],
        ['one-four', { disabled: true }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        ['two-four', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowRightEvent, items, itemToElementMap, 'one-two', {
        columnsCount: 4
      });
      expect(result).toBeNull();
    });
  });

  describe('when ArrowUp is pressed', () => {
    it('should navigate one row up', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        // row
        ['three-one', { disabled: false }],
        ['three-two', { disabled: false }],
        ['three-three', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowUpEvent, items, itemToElementMap, 'three-two', {
        columnsCount: 3
      });
      expect(result).toBe('two-two');
    });

    it('should navigate over a disabled tab stop to the row above it', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: true }],
        ['two-three', { disabled: false }],
        // row
        ['three-one', { disabled: false }],
        ['three-two', { disabled: false }],
        ['three-three', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowUpEvent, items, itemToElementMap, 'three-two', {
        columnsCount: 3
      });
      expect(result).toBe('one-two');
    });

    it('should navigate one row up from the end of a ragged row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        // row
        ['three-one', { disabled: false }],
        ['three-two', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowUpEvent, items, itemToElementMap, 'three-two', {
        columnsCount: 3
      });
      expect(result).toBe('two-two');
    });

    it('should not navigate when on the first row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowUpEvent, items, itemToElementMap, 'one-two', {
        columnsCount: 3
      });
      expect(result).toBeNull();
    });

    it('should not navigate when there are only disabled tab stops above', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: true }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowUpEvent, items, itemToElementMap, 'two-two', {
        columnsCount: 3
      });
      expect(result).toBeNull();
    });
  });

  describe('when ArrowDown is pressed', () => {
    it('should navigate one row down', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        // row
        ['three-one', { disabled: false }],
        ['three-two', { disabled: false }],
        ['three-three', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowDownEvent, items, itemToElementMap, 'one-two', {
        columnsCount: 3
      });
      expect(result).toBe('two-two');
    });

    it('should navigate over a disabled tab stop to the row below it', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: true }],
        ['two-three', { disabled: false }],
        // row
        ['three-one', { disabled: false }],
        ['three-two', { disabled: false }],
        ['three-three', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowDownEvent, items, itemToElementMap, 'one-two', {
        columnsCount: 3
      });
      expect(result).toBe('three-two');
    });

    it('should not navigate down when the next row is a ragged row and the tab stop is missing', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }],
        // row
        ['three-one', { disabled: false }],
        ['three-two', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowDownEvent, items, itemToElementMap, 'two-three', {
        columnsCount: 3
      });
      expect(result).toBeNull();
    });

    it('should not navigate when on the last row', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: false }],
        ['two-three', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowDownEvent, items, itemToElementMap, 'two-two', {
        columnsCount: 3
      });
      expect(result).toBeNull();
    });

    it('should not navigate when there are only disabled tab stops below', () => {
      const [items, itemToElementMap] = createTabStops([
        // row
        ['one-one', { disabled: false }],
        ['one-two', { disabled: false }],
        ['one-three', { disabled: false }],
        // row
        ['two-one', { disabled: false }],
        ['two-two', { disabled: true }],
        ['two-three', { disabled: false }]
      ]);
      const translator = gridSingleStepNavigation();
      const result = translator(arrowDownEvent, items, itemToElementMap, 'one-two', {
        columnsCount: 3
      });
      expect(result).toBeNull();
    });
  });

  it('should not respond to non- grid single step navigation', () => {
    const [items, itemToElementMap] = createTabStops([
      // row
      ['one-one', { disabled: false }],
      ['one-two', { disabled: false }],
      ['one-three', { disabled: false }],
      // row
      ['two-one', { disabled: false }],
      ['two-two', { disabled: false }],
      ['two-three', { disabled: false }]
    ]);

    const translator = gridSingleStepNavigation();
    const options = { columnsCount: 3 };

    expect(translator(homeKeyEvent, items, itemToElementMap, 'one-two', options)).toBeNull();
    expect(translator(endKeyEvent, items, itemToElementMap, 'one-two', options)).toBeNull();
    expect(translator(ctrlHomeKeyEvent, items, itemToElementMap, 'one-two', options)).toBeNull();
    expect(translator(ctrlEndKeyEvent, items, itemToElementMap, 'one-two', options)).toBeNull();
    expect(translator(arrowRightEvent, items, itemToElementMap, 'one-two')).toBeNull();
    expect(translator(arrowRightEvent, items, itemToElementMap, 'unknown', options)).toBeNull();
  });
});

describe('getNextEnabledTabStopItem', () => {
  it('should handle the current tab stop being unknown', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'unknown', 1, true)).toBeNull();
  });

  it('should handle roving forward with wraparound', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'two', 1, true)).toEqual('three');
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'three', 1, true)).toEqual('one');
  });

  it('should handle roving forward with no wraparound', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'two', 1, false)).toEqual('three');
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'three', 1, false)).toBeNull();
  });

  it('should handle roving forward when there are disabled tab stops', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'one', 1, true)).toEqual('three');
  });

  it('should handle roving forward when all other tab stops are disabled', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: true }]
    ]);
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'one', 1, true)).toBeNull();
  });

  it('should handle roving backwards with wraparound', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'two', -1, true)).toEqual('one');
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'one', -1, true)).toEqual('three');
  });

  it('should handle roving backwards with no wraparound', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: false }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'two', -1, false)).toEqual('one');
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'one', -1, false)).toBeNull();
  });

  it('should handle roving backwards when there are disabled tab stops', () => {
    const [items, itemToElementMap] = createTabStops([
      ['one', { disabled: false }],
      ['two', { disabled: true }],
      ['three', { disabled: false }]
    ]);
    expect(getNextEnabledTabStopItem(items, itemToElementMap, 'three', -1, true)).toEqual('one');
  });
});
