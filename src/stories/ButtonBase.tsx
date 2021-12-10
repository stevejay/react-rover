/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

export const ButtonBase = styled.button`
  font-family: inherit;
  outline: none;
  display: inline-block;
  border: 1px solid rgba(27, 31, 36, 0.15);
  border-radius: 6px;
  padding: 5px 14px;
  margin: 0;
  text-align: center;
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

  &::-moz-focus-inner {
    border: 0;
  }

  &[aria-disabled='true'],
  &:disabled {
    color: rgb(140, 149, 159);
    background-color: rgb(246, 248, 250);
    border-color: rgba(27, 31, 36, 0.15);
    cursor: default;
  }

  &:hover:not(:disabled):not([aria-disabled='true']):not([aria-pressed='true']):not([aria-checked='true']) {
    background-color: rgb(243, 244, 246);
  }

  &:active:not(:disabled):not([aria-disabled='true']):not([aria-pressed='true']):not([aria-checked='true']) {
    background-color: rgb(235, 236, 240);
    transition: none;
  }

  &:focus {
    /* for browsers that do not support focus-visible */
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
  }

  &:focus:not(:focus-visible) {
    /* undo the focus styles for browsers that support focus-visible */
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
  }

  &[aria-pressed='true'],
  &[aria-checked='true'] {
    background-color: rgb(238, 239, 242);
  }

  /* Support an icon in the button */
  & svg {
    vertical-align: text-bottom;
    pointer-events: none;
    color: rgb(87, 96, 106);
    font-size: 0.875rem;
    margin-bottom: 2px;
  }
`;
