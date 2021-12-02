/** @jsxImportSource @emotion/react */
import { forwardRef, InputHTMLAttributes } from 'react';

import { LabelBase } from './LabelBase';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string;
  checked: boolean;
  disabledFocusable?: boolean;
  onChange: (
    event: Parameters<NonNullable<InputHTMLAttributes<HTMLInputElement>['onChange']>>[0],
    checked: boolean
  ) => void;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, onChange, disabled = false, ...rest }, ref) => (
    <LabelBase>
      <input
        {...rest}
        type="checkbox"
        ref={ref}
        checked={checked}
        aria-disabled={disabled}
        onChange={(event) => onChange(event, event.target.checked)}
      />
      &nbsp;{label}
    </LabelBase>
  )
);
