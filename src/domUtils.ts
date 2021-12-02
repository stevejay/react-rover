import { SyntheticEvent } from 'react';

export function preventDefault(event: SyntheticEvent) {
  event.preventDefault();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction<Type = any> = (...args: any[]) => Type;

// Credit to https://github.com/remirror/remirror/blob/a2ca7a83f35b3831b97817eb2cb38b1a82d60ab8/packages/multishift/src/multishift-utils.ts#L1019
// and https://github.com/downshift-js/downshift/blob/26c93a539dad09e41adba69ddc3a7d7ecccfc8bb/src/utils.js#L93
export function callAllEventHandlers<
  Type extends Event = Event,
  Method extends (event: Type, ...args: unknown[]) => void | undefined | false | true = AnyFunction
>(...fns: Array<Method | undefined | null | false>) {
  return (event: Type, ...args: unknown[]): void => {
    fns.some((fn) => {
      if (fn) {
        fn(event, ...args);
      }
      return (
        // eslint-disable-next-line
        (event as any).preventReactRoverDefault ||
        (Object.prototype.hasOwnProperty.call(event, 'nativeEvent') &&
          // eslint-disable-next-line
          (event as any).nativeEvent.preventReactRoverDefault)
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
export function elementIsEnabled(element: HTMLElement | EventTarget | null): boolean {
  return !!element && (!hasProperty(element, 'disabled') || !element.disabled);
}

// Element can be focused if clicked.
export function elementIsAriaEnabled(element: HTMLElement | EventTarget | null): boolean {
  return !!element && (!hasProperty(element, 'ariaDisabled') || element.ariaDisabled == 'false');
}
