/** @jsxImportSource @emotion/react */
import { forwardRef, KeyboardEvent, MouseEvent, MouseEventHandler, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import styled from '@emotion/styled';

import { ButtonBase } from './ButtonBase';

const StyledMenu = styled.ul<{ open: boolean }>`
  padding: 0;
  width: 9.5em;
  border: 2px solid #ddd;
  border-radius: 5px;
  background-color: white;
  display: none;
  position: absolute;
  margin: 0;
  /* z-index: 1; */
  display: ${(props) => (props.open ? 'block' : 'none')};
  position: absolute;
  top: 34px;
  left: 0px;
  z-index: 100;

  &:focus-visible {
    border-color: #005a9c;
  }
`;

const StyledMenuItem = styled.li`
  padding: 0;
  margin: 0;
  display: block;
  text-align: left;
  list-style: none;

  padding: 0;
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 2px;
  padding-right: 2px;
  outline: 0;
  border: none;
  border-radius: 0;

  &::before {
    content: url('../images/menuitemradio-unchecked.svg');
  }

  &[aria-checked='true']::before {
    content: url('../images/menuitemradio-checked.svg');
  }

  &:focus-visible,
  &:hover {
    background: rgb(226, 239, 255);
    border-top: 1px solid #005a9c;
    border-bottom: 1px solid #005a9c;
    padding-top: 0;
    padding-bottom: 0;
  }

  &:focus-visible {
    border-color: #005a9c;
  }
`;

export type MenuProps = {
  tabIndex: number;
  onClick: MouseEventHandler<HTMLButtonElement>;
  valueFormatter: (value: string) => string;
  menuLabel: string;
  value: string;
  options: string[];
  disabled?: boolean;
  disabledFocusable?: boolean;
  onChange: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>, newValue: string) => void;
};

// TODO work out how to support disable on the menu.

export const Menu = forwardRef<HTMLButtonElement, MenuProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ valueFormatter, menuLabel, value, options, onChange, disabled = false, ...rest }, ref) => {
    const menuId = 'menu1'; // TODO fix
    const [open] = useState<boolean>(false);
    return (
      <>
        <ButtonBase
          {...rest}
          type="button"
          aria-haspopup="true"
          aria-controls={menuId}
          aria-label={valueFormatter(value)}
          aria-expanded={open}
          ref={ref}
          //   onClick={(event) => {
          //     setOpen((open) => !open);
          //     onClick(event);
          //   }}
        >
          {value.toUpperCase()}
          <FaCaretDown style={{ marginLeft: 4, marginRight: -4 }} />
        </ButtonBase>
        <StyledMenu role="menu" id={menuId} aria-label={menuLabel} open={open}>
          {options.map((option) => (
            <StyledMenuItem
              key={option}
              role="menuitemradio"
              aria-checked={value === option}
              style={{ fontFamily: option }}
            >
              {option}
            </StyledMenuItem>
          ))}
        </StyledMenu>
      </>
    );
  }
);
