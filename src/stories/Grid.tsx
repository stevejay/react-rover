/** @jsxImportSource @emotion/react */
import { forwardRef, HTMLAttributes } from 'react';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  columnsCount: number;
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(({ columnsCount, children, ...rest }, ref) => (
  <div
    {...rest}
    ref={ref}
    css={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
      gap: 8,
      padding: 8,
      backgroundColor: '#ececea'
    }}
  >
    {children}
  </div>
));
