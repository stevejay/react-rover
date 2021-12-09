import { SyntheticEvent, useEffect, useLayoutEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction<Type = any> = (...args: any[]) => Type;

export type PreventReactRoverDefault = { preventReactRoverDefault?: boolean };

// Credit to https://github.com/remirror/remirror/blob/a2ca7a83f35b3831b97817eb2cb38b1a82d60ab8/packages/multishift/src/multishift-utils.ts#L1019
// and https://github.com/downshift-js/downshift/blob/26c93a539dad09e41adba69ddc3a7d7ecccfc8bb/src/utils.js#L93
export function callAllEventHandlers<
  Type extends SyntheticEvent<Element, Event & PreventReactRoverDefault>,
  Method extends (event: Type, ...args: unknown[]) => void | undefined | false | true = AnyFunction
>(...fns: Array<Method | undefined | null | false>) {
  return (event: Type & PreventReactRoverDefault, ...args: unknown[]): void => {
    fns.some((fn) => {
      if (fn) {
        fn(event, ...args);
      }
      return (
        event.preventReactRoverDefault || (event.nativeEvent && event.nativeEvent.preventReactRoverDefault)
      );
    });
  };
}

function hasProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return prop in obj;
}

// Element can be a tab stop.
export function elementIsEnabled(element?: HTMLElement | EventTarget | null): boolean {
  return !!element && (!hasProperty(element, 'disabled') || !element.disabled);
}

export const useIsomorphicLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;
