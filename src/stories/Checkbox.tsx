/** @jsxImportSource @emotion/react */
import { forwardRef, InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';

const StyledLabel = styled.label`
  border: 1px solid white;
  outline: none;
  display: inline-block;
  padding: 6px 12px;
  border-radius: 5px;
  text-align: center;
  background: white;
  color: #222428;
  font-size: 14px;
  line-height: 1.5em;
  margin-right: 4px;
  font-family: sans-serif;

  &:hover {
    border-color: #005a9c;
    background: rgb(226, 239, 255);
  }

  &:focus-within {
    border-width: 2px;
    border-color: #005a9c;
    background: rgb(226, 239, 255);
    padding: 5px 11px;
  }
`;

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
    <StyledLabel>
      <input
        {...rest}
        type="checkbox"
        ref={ref}
        checked={checked}
        aria-disabled={disabled}
        onChange={(event) => onChange(event, event.target.checked)}
      />
      &nbsp;{label}
    </StyledLabel>
  )
);
