/** @jsxImportSource @emotion/react */
import { FC, HTMLAttributes } from 'react';

export type ToolbarProps = HTMLAttributes<HTMLElement>;

export const Toolbar: FC<ToolbarProps> = ({ children, ...rest }) => (
  <div
    {...rest}
    role="toolbar"
    css={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      maxWidth: 1050
    }}
  >
    {children}
  </div>
);
