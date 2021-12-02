/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

export const ButtonBase = styled.button`
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

  &::-moz-focus-inner {
    border: 0;
  }

  &[aria-pressed='true'] {
    border-color: #555;
    font-weight: bold;
    background-color: #f4f4f4;
  }

  &[aria-disabled='true'],
  &:disabled {
    color: #889;
    cursor: not-allowed;
  }

  &[aria-checked='true'] {
    border-color: #555;
    font-weight: bold;
    background-color: #f4f4f4;
  }

  &:focus {
    border-width: 2px;
    border-color: #005a9c;
    background: rgb(226, 239, 255);
    padding: 5px 11px;
  }

  &:not(:disabled)[aria-disabled='true']:focus {
    border-color: #005a9c;
  }

  &:hover {
    border-color: #005a9c;
    background: rgb(226, 239, 255);
  }

  & svg {
    vertical-align: middle;
    pointer-events: none;
  }
`;
