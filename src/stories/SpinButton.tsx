/** @jsxImportSource @emotion/react */
import { forwardRef, HTMLAttributes, KeyboardEvent, MouseEvent, Ref } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import styled from '@emotion/styled';

const StyledSpinButton = styled.div`
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

  &:focus-within .increase,
  &:focus-within .decrease {
    fill: #005a9c;
    border-color: #005a9c;
  }
`;

const StyledIncDecButton = styled.span`
  width: 20px;
  border: 1px solid #ececea;
  border-radius: 3px;
  background-color: #ececea;
  display: inline-block;
  padding: 0;
  margin: 0;

  &:hover {
    fill: #005a9c;
    border-color: #005a9c;
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
        onKeyDown={(event) => {
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
        }}
      >
        <span
          css={{
            width: 60,
            display: 'inline-block',
            padding: 0,
            margin: 0
          }}
        >
          {value} Point
        </span>
        <StyledIncDecButton
          className="increase"
          onClick={(event) => increment(event, 1)}
          onMouseDown={onMouseDown}
        >
          <FaArrowUp />
        </StyledIncDecButton>
        <StyledIncDecButton
          className="decrease"
          onClick={(event) => decrement(event, 1)}
          onMouseDown={onMouseDown}
        >
          <FaArrowDown />
        </StyledIncDecButton>
      </StyledSpinButton>
    );
  }
);
