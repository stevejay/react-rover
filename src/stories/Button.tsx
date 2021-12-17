/** @jsxImportSource @emotion/react */
import { ButtonHTMLAttributes, forwardRef } from 'react';

import { ButtonBase } from './ButtonBase';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  disabledFocusable?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, type = 'button', disabled = false, disabledFocusable = false, ...rest }: ButtonProps, ref) => {
    return (
      <ButtonBase
        {...rest}
        type={type}
        disabled={disabled}
        aria-disabled={disabledFocusable || disabled}
        ref={ref}
      >
        {label}
      </ButtonBase>
    );
  }
);
