/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

export const StackedLayout = styled.div`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: 16px;
  }
`;
