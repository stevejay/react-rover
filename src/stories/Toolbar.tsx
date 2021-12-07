/** @jsxImportSource @emotion/react */
import { FC, HTMLAttributes } from 'react';
import styled from '@emotion/styled';

const StyledToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 6px;
  max-width: 1050px;
  background-color: #ececea;

  /* &:focus-within {
    border-color: #005a9c;
    border-width: 3px;
    padding: 5px;
  } */
`;

export type ToolbarGroupProps = {
  role?: string;
};

const ToolbarGroup: FC<ToolbarGroupProps> = ({ role, children }) => (
  <div
    role={role}
    css={{
      //   padding: '0.25em',
      position: 'relative',
      flexShrink: 0
    }}
  >
    {children}
  </div>
);

const ToolbarRadioButtonGroup: FC = ({ children }) => (
  <ToolbarGroup role="radiogroup">{children}</ToolbarGroup>
);

export type ToolbarProps = HTMLAttributes<HTMLElement>;

const ToolbarContainer: FC<ToolbarProps> = ({ children, ...rest }) => (
  <StyledToolbar {...rest} role="toolbar">
    {children}
  </StyledToolbar>
);

export const Toolbar = Object.assign(ToolbarContainer, {
  Group: ToolbarGroup,
  RadioButtonGroup: ToolbarRadioButtonGroup
});
