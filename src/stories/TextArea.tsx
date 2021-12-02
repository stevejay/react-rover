/** @jsxImportSource @emotion/react */
import { forwardRef } from 'react';

import { TextEditorState } from './textEditorState';

export type TextAreaProps = {
  id: string;
  state: TextEditorState;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ id, state }, ref) => (
  <textarea
    ref={ref}
    id={id}
    rows={20}
    cols={80}
    css={{
      height: 400,
      padding: 8,
      border: '2px solid black',
      borderRadius: 5,
      fontSize: `${state.fontSize}pt`,
      fontFamily: state.fontFamily,
      outlineColor: '#005a9c',
      textAlign: state.justify,
      textDecoration: state.underline ? 'underline' : 'none',
      fontWeight: state.bold ? 700 : 400,
      fontStyle: state.italic ? 'italic' : 'normal',
      color: state.nightMode ? 'white' : 'black',
      backgroundColor: state.nightMode ? 'black' : 'white',
      '&:focus': {
        borderColor: '#005a9c',
        padding: 7,
        borderWidth: 3
      }
    }}
    defaultValue={state.text}
  />
));
