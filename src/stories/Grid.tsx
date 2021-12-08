/** @jsxImportSource @emotion/react */
import { forwardRef, HTMLAttributes } from 'react';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  columns: number;
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(({ columns, children, ...rest }, ref) => (
  <div
    {...rest}
    ref={ref}
    css={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 8
    }}
  >
    {children}
  </div>
));
