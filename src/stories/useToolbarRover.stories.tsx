/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { FaAlignCenter, FaAlignLeft, FaAlignRight, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { Meta, Story } from '@storybook/react';

import {
  extremesNavigation,
  horizontalNavigation,
  horizontalRadioGroupNavigation,
  KeyDownTranslator,
  TabStopId,
  useToolbarRover,
  verticalNavigation
} from '..';

import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Link } from './Link';
import { Menu } from './Menu';
import { RadioButton } from './RadioButton';
import { SpinButton } from './SpinButton';
import { StackedLayout } from './StackedLayout';
import { TextArea } from './TextArea';
import { initialEditorState } from './textEditorState';
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

const preventDefault = (event: React.MouseEvent) => event.preventDefault();

const ComplexToolbarTemplate: Story<void> = () => {
  const [state, setState] = useState(initialEditorState);
  const onTabStopChange = useCallback((id: string | null) => console.log(`new tab stop: ${id || '---'}`), []);
  const { getTabContainerProps, getTabStopProps } = useToolbarRover(horizontalToolbarKeyDownTranslators, {
    initialTabStopId: 'italic',
    onTabStopChange
  });
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Toolbar aria-label="Text Formatting" aria-controls="textarea1" {...getTabContainerProps()}>
        <Toolbar.Group>
          <ToggleButton
            label="Bold"
            icon={FaBold}
            pressed={state.bold}
            onMouseDown={preventDefault}
            {...getTabStopProps('bold', {
              onClick: () => setState((state) => ({ ...state, bold: !state.bold }))
            })}
          />
          <ToggleButton
            label="Italic"
            icon={FaItalic}
            pressed={state.italic}
            onMouseDown={preventDefault}
            {...getTabStopProps('italic', {
              onClick: () => setState((state) => ({ ...state, italic: !state.italic }))
            })}
          />
          <ToggleButton
            label="Underline"
            icon={FaUnderline}
            pressed={state.underline}
            onMouseDown={preventDefault}
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
            onMouseDown={preventDefault}
            {...getTabStopProps('align-left', {
              onClick: () => setState((state) => ({ ...state, justify: 'left' }))
            })}
          />
          <RadioButton
            label="Align center"
            icon={FaAlignCenter}
            checked={state.justify === 'center'}
            onMouseDown={preventDefault}
            {...getTabStopProps('align-center', {
              onClick: () => setState((state) => ({ ...state, justify: 'center' }))
            })}
          />
          <RadioButton
            label="Align right"
            icon={FaAlignRight}
            checked={state.justify === 'right'}
            onMouseDown={preventDefault}
            {...getTabStopProps('align-right', {
              onClick: () => setState((state) => ({ ...state, justify: 'right' }))
            })}
          />
        </Toolbar.RadioButtonGroup>
        <Toolbar.Group>
          <Button
            label="Copy"
            onMouseDown={preventDefault}
            {...getTabStopProps('copy', {
              onClick: () => console.log('Copy clicked')
            })}
          />
          <Button
            label="Paste"
            disabledFocusable
            onMouseDown={preventDefault}
            {...getTabStopProps('paste', {
              onClick: () => console.log('Paste clicked')
            })}
          />
          <Button
            label="Cut"
            onMouseDown={preventDefault}
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
            onMouseDown={preventDefault}
            {...getTabStopProps('night-mode')}
            onChange={(_, nightMode) => setState((state) => ({ ...state, nightMode }))}
          />
        </Toolbar.Group>
        <Toolbar.Group>
          <Link label="Help" href="https://www.google.com" {...getTabStopProps('link')} />
        </Toolbar.Group>
      </Toolbar>
      <TextArea id="textarea1" state={state} />
    </StackedLayout>
  );
};

type TabStopSetup = {
  id: TabStopId;
  label: string;
  disabled?: boolean;
  disabledFocusable?: boolean;
};

type SimpleToolbarTemplateProps = {
  keyDownTranslators: KeyDownTranslator[];
  tabStops: TabStopSetup[];
  initialTabStopId?: TabStopId | null;
  shouldFocusOnClick?: boolean;
  preventDefaultOnMouseDown?: boolean;
};

const SimpleToolbarTemplate: Story<SimpleToolbarTemplateProps> = ({
  tabStops,
  keyDownTranslators,
  initialTabStopId,
  shouldFocusOnClick,
  preventDefaultOnMouseDown
}) => {
  const onTabStopChange = useCallback((id: string | null) => console.log(`new tab stop: ${id || '---'}`), []);
  const { getTabContainerProps, getTabStopProps } = useToolbarRover(keyDownTranslators, {
    initialTabStopId,
    onTabStopChange,
    shouldFocusOnClick
  });
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Toolbar aria-label="Toolbar" {...getTabContainerProps()}>
        {tabStops.map((tabStop) => (
          <Button
            key={tabStop.id}
            label={tabStop.label}
            disabled={tabStop.disabled}
            disabledFocusable={tabStop.disabledFocusable}
            onMouseDown={preventDefaultOnMouseDown ? preventDefault : undefined}
            {...getTabStopProps(tabStop.id, {
              onClick: () => console.log('One clicked')
            })}
          />
        ))}
      </Toolbar>
      <Button label="Focus after" />
    </StackedLayout>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const ComplexToolbar = ComplexToolbarTemplate.bind({});

export const SimpleToolbar = SimpleToolbarTemplate.bind({});
SimpleToolbar.args = {
  keyDownTranslators: [horizontalNavigation(), extremesNavigation],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};

export const SimpleToolbarWithInitialTabStop = SimpleToolbarTemplate.bind({});
SimpleToolbarWithInitialTabStop.args = {
  keyDownTranslators: [horizontalNavigation(), extremesNavigation],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ],
  initialTabStopId: 'two'
};

export const SimpleToolbarWithDisabledEndStops = SimpleToolbarTemplate.bind({});
SimpleToolbarWithDisabledEndStops.args = {
  keyDownTranslators: [horizontalNavigation(), extremesNavigation],
  tabStops: [
    { id: 'one', label: 'One', disabled: true },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' },
    { id: 'four', label: 'Four' },
    { id: 'five', label: 'Five', disabled: true }
  ]
};

export const SimpleToolbarWithNoWraparound = SimpleToolbarTemplate.bind({});
SimpleToolbarWithNoWraparound.args = {
  keyDownTranslators: [horizontalNavigation(false), extremesNavigation],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};

export const SimpleToolbarWithVerticalNavigation = SimpleToolbarTemplate.bind({});
SimpleToolbarWithVerticalNavigation.args = {
  keyDownTranslators: [verticalNavigation(), extremesNavigation],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};

export const SimpleToolbarWithHorizontalAndVerticalNavigation = SimpleToolbarTemplate.bind({});
SimpleToolbarWithHorizontalAndVerticalNavigation.args = {
  keyDownTranslators: [horizontalNavigation(), verticalNavigation(), extremesNavigation],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};

// Loop around needs to work if first/last tab stop is disabled.
