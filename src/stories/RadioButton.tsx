/** @jsxImportSource @emotion/react */
import { ButtonHTMLAttributes, ComponentType, forwardRef } from 'react';

import { ButtonBase } from './ButtonBase';

export type RadioButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ComponentType;
  checked: boolean;
  disabledFocusable?: boolean;
};

export const RadioButton = forwardRef<HTMLButtonElement, RadioButtonProps>(
  (
    { label, type = 'button', icon: Icon, checked, disabled = false, disabledFocusable = false, ...rest },
    ref
  ) => (
    <ButtonBase
      {...rest}
      type={type}
      role="radio"
      aria-label={label}
      aria-checked={checked}
      disabled={disabled}
      aria-disabled={disabledFocusable || disabled}
      ref={ref}
    >
      <Icon />
    </ButtonBase>
  )
);
