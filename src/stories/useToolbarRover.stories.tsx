import { useCallback, useState } from 'react';
import { FaAlignCenter, FaAlignLeft, FaAlignRight, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { Meta, Story } from '@storybook/react';

import {
  extremesNavigation,
  horizontalNavigation,
  horizontalRadioGroupNavigation
} from '@/keyDownTranslators';
import { OnTabStopChange, useToolbarRover } from '@/useToolbarRover';

import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Link } from './Link';
import { Menu } from './Menu';
import { RadioButton } from './RadioButton';
import { SpinButton } from './SpinButton';
import { TextArea } from './TextArea';
import { ToggleButton } from './ToggleButton';
import { Toolbar } from './Toolbar';

const meta: Meta = {
  title: 'useToolbarRover',
  argTypes: {
    children: {
      control: {
        type: 'text'
      }
    }
  },
  parameters: {
    controls: { expanded: true }
  }
};

export default meta;

const horizontalToolbarKeyDownTranslators = [
  horizontalRadioGroupNavigation(true),
  horizontalNavigation(true),
  extremesNavigation
];

const initialEditorState: EditorState = {
  bold: false,
  italic: false,
  underline: false,
  justify: 'left',
  nightMode: false,
  fontSize: 14,
  fontFamily: 'sans-serif',
  fontFamilies: ['sans-serif', 'serif', 'monospace', 'fantasy', 'cursive'],
  text: `Abraham Lincoln's Gettysburg Address

Four score and seven years ago our fathers brought forth on this continent a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.`
};

const Template: Story<void> = () => {
  const [state, setState] = useState(initialEditorState);
  const onTabStopChange = useCallback<OnTabStopChange>(
    (id) => console.log(`new tab stop: ${id || '---'}`),
    []
  );
  const { getTabContainerProps, getTabStopProps } = useToolbarRover(horizontalToolbarKeyDownTranslators, {
    initialTabStopId: 'italic',
    onTabStopChange
  });
  return (
    <>
      <Toolbar aria-label="Text Formatting" aria-controls="textarea1" {...getTabContainerProps()}>
        <Toolbar.Group>
          <ToggleButton
            label="Bold"
            icon={FaBold}
            pressed={state.bold}
            {...getTabStopProps('bold', {
              onClick: () => setState((state) => ({ ...state, bold: !state.bold }))
            })}
          />
          <ToggleButton
            label="Italic"
            icon={FaItalic}
            pressed={state.italic}
            {...getTabStopProps('italic', {
              onClick: () => setState((state) => ({ ...state, italic: !state.italic }))
            })}
          />
          <ToggleButton
            label="Underline"
            icon={FaUnderline}
            pressed={state.underline}
            disabled
            {...getTabStopProps('underline', {
              onClick: () =>
                setState((state) => ({
                  ...state,
                  underline: !state.underline
                }))
            })}
          />
        </Toolbar.Group>
        <Toolbar.RadioButtonGroup>
          <RadioButton
            label="Align left"
            icon={FaAlignLeft}
            checked={state.justify === 'left'}
            {...getTabStopProps('align-left', {
              onClick: () => setState((state) => ({ ...state, justify: 'left' }))
            })}
          />
          <RadioButton
            label="Align center"
            icon={FaAlignCenter}
            checked={state.justify === 'center'}
            {...getTabStopProps('align-center', {
              onClick: () => setState((state) => ({ ...state, justify: 'center' }))
            })}
          />
          <RadioButton
            label="Align right"
            icon={FaAlignRight}
            checked={state.justify === 'right'}
            {...getTabStopProps('align-right', {
              onClick: () => setState((state) => ({ ...state, justify: 'right' }))
            })}
          />
        </Toolbar.RadioButtonGroup>
        <Toolbar.Group>
          <Button
            label="Copy"
            disabledFocusable
            {...getTabStopProps('copy', {
              onClick: () => console.log('Copy clicked')
            })}
          />
          <Button
            label="Paste"
            disabledFocusable
            {...getTabStopProps('paste', {
              onClick: () => console.log('Paste clicked')
            })}
          />
          <Button
            label="Cut"
            disabledFocusable
            {...getTabStopProps('cut', {
              onClick: () => console.log('Cut clicked')
            })}
          />
        </Toolbar.Group>
        <Toolbar.Group>
          <Menu
            valueFormatter={(value) => `Font: ${value}`}
            menuLabel="Font family"
            options={state.fontFamilies}
            value={state.fontFamily}
            onChange={(_, value) => setState((state) => ({ ...state, fontFamily: value }))}
            {...getTabStopProps('font-family')}
          />
        </Toolbar.Group>
        <Toolbar.Group>
          <SpinButton
            label="Font size in points"
            {...getTabStopProps('font-size')}
            onChange={(_, value) => setState((state) => ({ ...state, fontSize: value }))}
            value={state.fontSize}
            min={5}
            max={24}
          />
        </Toolbar.Group>
        <Toolbar.Group>
          <Checkbox
            label="Night Mode"
            checked={state.nightMode}
            {...getTabStopProps('night-mode')}
            onChange={(_, nightMode) => setState((state) => ({ ...state, nightMode }))}
          />
        </Toolbar.Group>
        <Toolbar.Group>
          <Link label="Help" href="https://www.google.com" {...getTabStopProps('link')} />
        </Toolbar.Group>
      </Toolbar>
      <TextArea id="textarea1" state={state} />
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

// Default.args = {};
