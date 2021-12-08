/** @jsxImportSource @emotion/react */
import React, { useCallback, useRef, useState } from 'react';
import { FaAlignCenter, FaAlignLeft, FaAlignRight, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import {
  extremesNavigation,
  horizontalNavigation,
  KeyDownTranslator,
  useToolbarRover,
  verticalNavigation
} from '@/index';

import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { horizontalRadioGroupNavigation } from './horizontalRadioGroupNavigation';
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
  title: 'Toolbar',
  argTypes: {
    children: {
      table: {
        disable: true
      }
    },
    keyDownTranslators: {
      table: {
        disable: true
      }
    },
    tabStops: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    controls: { expanded: false, hideNoControlsWarning: true }
  }
};

export default meta;

const horizontalToolbarKeyDownTranslators = [
  horizontalRadioGroupNavigation(true),
  horizontalNavigation(true),
  extremesNavigation()
];

const TextEditorToolbarTemplate: Story<void> = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState(initialEditorState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onTabStopChange = useCallback(action('tab-stop-changed'), []);
  const { getTabContainerProps, getTabStopProps } = useToolbarRover(horizontalToolbarKeyDownTranslators, {
    initialId: 'italic',
    onTabStopChange
  });
  // Prevents focus leaving the text area if it currently has focus,
  // so you can interact with the toolbar without losing the caret:
  const mouseDownHandler = useCallback((event: React.MouseEvent) => {
    if (
      document.activeElement &&
      textAreaRef.current &&
      textAreaRef.current.contains(document.activeElement)
    ) {
      event.preventDefault();
    }
  }, []);
  return (
    <StackedLayout>
      <Toolbar aria-label="Text Formatting" aria-controls="text-area" {...getTabContainerProps()}>
        <Toolbar.Group>
          <ToggleButton
            label="Bold"
            icon={FaBold}
            pressed={state.bold}
            onMouseDown={mouseDownHandler}
            {...getTabStopProps('bold', {
              onClick: () => setState((state) => ({ ...state, bold: !state.bold }))
            })}
          />
          <ToggleButton
            label="Italic"
            icon={FaItalic}
            pressed={state.italic}
            onMouseDown={mouseDownHandler}
            {...getTabStopProps('italic', {
              onClick: () => setState((state) => ({ ...state, italic: !state.italic }))
            })}
          />
          <ToggleButton
            label="Underline"
            icon={FaUnderline}
            pressed={state.underline}
            onMouseDown={mouseDownHandler}
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
            onMouseDown={mouseDownHandler}
            {...getTabStopProps('align-left', {
              onClick: () => setState((state) => ({ ...state, justify: 'left' }))
            })}
          />
          <RadioButton
            label="Align center"
            icon={FaAlignCenter}
            checked={state.justify === 'center'}
            onMouseDown={mouseDownHandler}
            {...getTabStopProps('align-center', {
              onClick: () => setState((state) => ({ ...state, justify: 'center' }))
            })}
          />
          <RadioButton
            label="Align right"
            icon={FaAlignRight}
            checked={state.justify === 'right'}
            onMouseDown={mouseDownHandler}
            {...getTabStopProps('align-right', {
              onClick: () => setState((state) => ({ ...state, justify: 'right' }))
            })}
          />
        </Toolbar.RadioButtonGroup>
        <Toolbar.Group>
          <Button
            label="Copy"
            onMouseDown={mouseDownHandler}
            {...getTabStopProps('copy', {
              onClick: action('copy-button-click')
            })}
          />
          <Button
            label="Paste"
            disabledFocusable
            onMouseDown={mouseDownHandler}
            {...getTabStopProps('paste', {
              onClick: action('paste-button-click')
            })}
          />
          <Button
            label="Cut"
            onMouseDown={mouseDownHandler}
            {...getTabStopProps('cut', {
              onClick: action('cut-button-click')
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
            value={state.fontSize}
            min={5}
            max={24}
            onMouseDown={mouseDownHandler}
            onChange={(_, value) => setState((state) => ({ ...state, fontSize: value }))}
            {...getTabStopProps('font-size')}
          />
        </Toolbar.Group>
        <Toolbar.Group>
          <Checkbox
            label="Night Mode"
            checked={state.nightMode}
            onMouseDown={mouseDownHandler}
            onChange={(_, nightMode) => setState((state) => ({ ...state, nightMode }))}
            {...getTabStopProps('night-mode')}
          />
        </Toolbar.Group>
        <Toolbar.Group>
          <Link label="Help" href="https://www.google.com" {...getTabStopProps('link')} />
        </Toolbar.Group>
      </Toolbar>
      <TextArea id="text-area" ref={textAreaRef} state={state} />
    </StackedLayout>
  );
};

const DynamicToolbarTemplate: Story<void> = () => {
  const [showButtonTwo, setShowButtonTwo] = useState(true);
  const [enableButtonThree, setEnableButtonThree] = useState(true);
  const { getTabContainerProps, getTabStopProps } = useToolbarRover(horizontalToolbarKeyDownTranslators);
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Toolbar aria-label="Toolbar" {...getTabContainerProps()}>
        <Button
          label="One"
          {...getTabStopProps('one', {
            onClick: action('button-one-click')
          })}
        />
        {showButtonTwo && (
          <Button
            label="Two"
            {...getTabStopProps('two', {
              onClick: action('button-two-click')
            })}
          />
        )}
        <Button
          label="Three"
          disabled={!enableButtonThree}
          {...getTabStopProps('three', {
            onClick: action('button-three-click')
          })}
        />
      </Toolbar>
      <div css={{ display: 'flex', gap: 16 }}>
        <Button
          label={showButtonTwo ? 'Hide Button Two' : 'Show Button Two'}
          onClick={() => setShowButtonTwo((state) => !state)}
        />
        <Button
          label={enableButtonThree ? 'Disable Button Three' : 'Enable Button Three'}
          onClick={() => setEnableButtonThree((state) => !state)}
        />
      </div>
    </StackedLayout>
  );
};

type TabStopSetup = {
  id: string;
  label: string;
  disabled?: boolean;
  disabledFocusable?: boolean;
};

type SimpleToolbarTemplateProps = {
  keyDownTranslators: KeyDownTranslator[];
  tabStops: TabStopSetup[];
  initialId?: string | null;
  shouldFocusOnClick?: boolean;
};

const SimpleToolbarTemplate: Story<SimpleToolbarTemplateProps> = ({
  tabStops,
  keyDownTranslators,
  initialId,
  shouldFocusOnClick
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onTabStopChange = useCallback(action('tab-stop-change'), []);
  const { getTabContainerProps, getTabStopProps } = useToolbarRover(keyDownTranslators, {
    initialId,
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
            {...getTabStopProps(tabStop.id, {
              onClick: (event) => {
                !tabStop.disabledFocusable && action('tab-stop-click')(event);
              }
            })}
          />
        ))}
      </Toolbar>
      <Button label="Focus after" />
    </StackedLayout>
  );
};

export const TextEditorToolbar = TextEditorToolbarTemplate.bind({});
TextEditorToolbar.parameters = {
  controls: { hideNoControlsWarning: true },
  options: { selectedPanel: 'storybook/actions/panel' }
};

export const DynamicToolbar = DynamicToolbarTemplate.bind({});
DynamicToolbar.parameters = {
  controls: { hideNoControlsWarning: true },
  options: { selectedPanel: 'storybook/actions/panel' }
};

export const Basic = SimpleToolbarTemplate.bind({});
Basic.args = {
  keyDownTranslators: [horizontalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};
<<<<<<< HEAD
Basic.parameters = {
  controls: { hideNoControlsWarning: true },
  options: { selectedPanel: 'storybook/actions/panel' }
};
=======
>>>>>>> partial grid support

export const WithButtonTwoAsInitialTabStop = SimpleToolbarTemplate.bind({});
WithButtonTwoAsInitialTabStop.args = {
  keyDownTranslators: [horizontalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ],
<<<<<<< HEAD
  initialTabStopId: 'two'
};
WithButtonTwoAsInitialTabStop.parameters = {
  controls: { hideNoControlsWarning: true },
  options: { selectedPanel: 'storybook/actions/panel' }
=======
  initialId: 'two'
>>>>>>> partial grid support
};

export const WithDisabledEndStops = SimpleToolbarTemplate.bind({});
WithDisabledEndStops.args = {
  keyDownTranslators: [horizontalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One', disabled: true },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' },
    { id: 'four', label: 'Four' },
    { id: 'five', label: 'Five', disabled: true }
  ]
};
<<<<<<< HEAD
WithDisabledEndStops.parameters = {
  controls: { hideNoControlsWarning: true },
  options: { selectedPanel: 'storybook/actions/panel' }
};
=======
>>>>>>> partial grid support

export const WithDisabledFocusableEndStops = SimpleToolbarTemplate.bind({});
WithDisabledFocusableEndStops.args = {
  keyDownTranslators: [horizontalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One', disabledFocusable: true },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three', disabledFocusable: true }
  ]
};
<<<<<<< HEAD
WithDisabledFocusableEndStops.parameters = {
  controls: { hideNoControlsWarning: true },
  options: { selectedPanel: 'storybook/actions/panel' }
};
=======
>>>>>>> partial grid support

export const WithNoWraparound = SimpleToolbarTemplate.bind({});
WithNoWraparound.args = {
  keyDownTranslators: [horizontalNavigation(false), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};
<<<<<<< HEAD
WithNoWraparound.parameters = {
  controls: { hideNoControlsWarning: true },
  options: { selectedPanel: 'storybook/actions/panel' }
};
=======
>>>>>>> partial grid support

export const WithVerticalNavigation = SimpleToolbarTemplate.bind({});
WithVerticalNavigation.args = {
  keyDownTranslators: [verticalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};
<<<<<<< HEAD
WithVerticalNavigation.parameters = {
  controls: { hideNoControlsWarning: true },
  options: { selectedPanel: 'storybook/actions/panel' }
};
=======
>>>>>>> partial grid support

export const WithHorizontalAndVerticalNavigation = SimpleToolbarTemplate.bind({});
WithHorizontalAndVerticalNavigation.args = {
  keyDownTranslators: [horizontalNavigation(), verticalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};
<<<<<<< HEAD
WithHorizontalAndVerticalNavigation.parameters = {
  controls: { hideNoControlsWarning: true },
  options: { selectedPanel: 'storybook/actions/panel' }
};
=======
>>>>>>> partial grid support
