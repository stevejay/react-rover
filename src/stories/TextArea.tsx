/** @jsxImportSource @emotion/react */
import { forwardRef } from 'react';
import styled from '@emotion/styled';

import { TextEditorState } from './textEditorState';

const StyledTextArea = styled.textarea<TextAreaProps>`
  outline: none;
  height: 400px;
  padding: 8px;
  border: 1px solid rgba(27, 31, 36, 0.15);
  border-radius: 5px;
  font-size: ${({ state }) => `${state.fontSize}px`};
  font-family: ${({ state }) => state.fontFamily};
  text-align: ${({ state }) => state.justify};
  text-decoration: ${({ state }) => (state.underline ? 'underline' : 'none')};
  font-weight: ${({ state }) => (state.bold ? 700 : 400)};
  font-style: ${({ state }) => (state.italic ? 'italic' : 'normal')};
  color: ${({ state }) => (state.nightMode ? 'white' : 'black')};
  background-color: ${({ state }) => (state.nightMode ? 'black' : 'white')};

  &:focus {
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
  }
`;

export type TextAreaProps = {
  id: string;
  state: TextEditorState;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ id, state }, ref) => (
  <StyledTextArea ref={ref} id={id} state={state} rows={20} cols={80} defaultValue={state.text} />
));
