export type TextEditorState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  justify: 'left' | 'right' | 'center';
  nightMode: boolean;
  fontSize: number;
  fontFamily: string;
  fontFamilies: string[];
  text: string;
};

export const initialEditorState: TextEditorState = {
  bold: false,
  italic: false,
  underline: false,
  justify: 'left',
  nightMode: false,
  fontSize: 16,
  fontFamily: 'Readex Pro',
  fontFamilies: ['Readex Pro', 'sans-serif', 'serif', 'monospace', 'fantasy', 'cursive'],
  text: `Abraham Lincoln's Gettysburg Address

Four score and seven years ago our fathers brought forth on this continent a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.`
};
