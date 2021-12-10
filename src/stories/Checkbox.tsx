/** @jsxImportSource @emotion/react */
import { ChangeEvent, forwardRef, InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';

const StyledLabel = styled.label`
  outline: none;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(27, 31, 36, 0.15);
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
  background: rgb(246, 248, 250);
  color: rgb(36, 41, 47);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  transition-property: color, background-color, border-color;

  &:hover {
    background-color: rgb(243, 244, 246);
  }

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
  }
`;

const StyledInput = styled.input`
  outline: none;
  cursor: pointer;
  margin: 0 3px 0 0;
`;

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string;
  checked: boolean;
  disabledFocusable?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, onChange, disabled = false, ...rest }, ref) => (
    <StyledLabel>
      <StyledInput
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
