/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from 'react';
import styled from '@emotion/styled';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  columnsCount: number;
};

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.columnsCount}, 1fr)`};
  gap: 8px;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
`;
