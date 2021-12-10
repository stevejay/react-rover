/** @jsxImportSource @emotion/react */
import { FC } from 'react';
import styled from '@emotion/styled';

export type ButtonGroupProps = {
  role?: string;
};

export const ButtonGroup = styled.div<ButtonGroupProps>`
  position: relative;
  display: flex;
  flex-shrink: 0;

  & > button {
    border-right-width: 0;
    border-radius: 0;
    position: relative;
  }

  & > button:first-of-type {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  & > button:last-of-type {
    border-right-width: 1px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  & > button:focus {
    z-index: 1;
  }

  & > button:focus-visible,
  & > button.active {
    z-index: 1;
  }

  & > button:focus-visible {
    border-right-width: 1px;
  }

  & > button:focus-visible + button {
    border-left-width: 0px;
  }
`;

export const RadioButtonGroup: FC = (props) => <ButtonGroup role="radiogroup" {...props} />;
