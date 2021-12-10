/** @jsxImportSource @emotion/react */
import { forwardRef, HTMLAttributes, KeyboardEvent, MouseEvent, Ref } from 'react';
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from 'react-icons/fa';
import styled from '@emotion/styled';

const StyledSpinButton = styled.div`
  font-family: inherit;
  outline: none;
  display: flex;
  align-items: center;
  border: 1px solid rgba(27, 31, 36, 0.15);
  border-radius: 6px;
  padding: 0 14px;
  margin: 0;
  background: rgb(246, 248, 250);
  color: rgb(36, 41, 47);
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  transition-property: color, background-color, border-color;
  cursor: pointer;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;

  & > * + * {
    margin-left: 4px;
  }

  &:hover {
    background-color: rgb(243, 244, 246);
  }

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
  }
`;

const StyledLabel = styled.span`
  min-width: 5ch;
  display: inline-block;
  margin: 0;
  padding: 5px 0;
`;

const StyledIncDecButton = styled.span`
  outline: none;
  display: block;
  padding: 0;
  color: rgb(87, 96, 106);
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: black;
  }

  &[data-disabled='true'] {
    color: rgb(140, 149, 159);
  }
`;

export type SpinButtonProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
  value: number;
  min: number;
  max: number;
  label: string;
  disabled?: boolean;
  disabledFocusable?: boolean;
  onChange: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>, newValue: number) => void;
};

export const SpinButton = forwardRef<HTMLElement, SpinButtonProps>(
  ({ value, min, max, label, onChange, onMouseDown, disabled = false, ...rest }, ref) => {
    const increment = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>, inc = 1) =>
      onChange(event, Math.min(value + inc, max));

    const decrement = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>, dec = 1) =>
      onChange(event, Math.max(value - dec, min));

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      let handled = false;
      if (event.key === 'ArrowUp') {
        increment(event, 1);
        handled = true;
      } else if (event.key === 'ArrowDown') {
        decrement(event, 1);
        handled = true;
      } else if (event.key === 'PageUp') {
        increment(event, 5);
        handled = true;
      } else if (event.key === 'PageDown') {
        decrement(event, 5);
        handled = true;
      }
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    return (
      <StyledSpinButton
        {...rest}
        role="spinbutton"
        ref={ref as Ref<HTMLDivElement>}
        aria-valuenow={value}
        aria-valuetext={`${value} point`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        aria-disabled={disabled}
        onKeyDown={onKeyDown}
      >
        <StyledLabel>{value} px</StyledLabel>
        <StyledIncDecButton
          className="increase"
          onClick={(event) => increment(event, 1)}
          onMouseDown={onMouseDown}
          data-disabled={value >= max}
        >
          <FaRegArrowAltCircleUp />
        </StyledIncDecButton>
        <StyledIncDecButton
          className="decrease"
          onClick={(event) => decrement(event, 1)}
          onMouseDown={onMouseDown}
          data-disabled={value <= min}
        >
          <FaRegArrowAltCircleDown />
        </StyledIncDecButton>
      </StyledSpinButton>
    );
  }
);
