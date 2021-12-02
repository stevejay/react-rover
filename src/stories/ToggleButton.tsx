/** @jsxImportSource @emotion/react */
import { ButtonHTMLAttributes, ComponentType, forwardRef } from 'react';

import { ButtonBase } from './ButtonBase';

export type ToggleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ComponentType;
  pressed: boolean;
  disabledFocusable?: boolean;
};

// Does not support a mixed state.
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    { label, type = 'button', icon: Icon, pressed, disabled = false, disabledFocusable = false, ...rest },
    ref
  ) => (
    <ButtonBase
      {...rest}
      type={type}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      aria-disabled={disabledFocusable || disabled}
      ref={ref}
    >
      <Icon />
    </ButtonBase>
  )
);
