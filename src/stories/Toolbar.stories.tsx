/** @jsxImportSource @emotion/react */
import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useRef,
  useState
} from 'react';
import { FaAlignCenter, FaAlignLeft, FaAlignRight, FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import {
  extremesNavigation,
  horizontalNavigation,
  KeyDownTranslator,
  ReactRoverProvider,
  useReactRoverContainer,
  useReactRoverTabStop,
  verticalNavigation
} from '@/index';

import { Button } from './Button';
import { ButtonGroup, RadioButtonGroup } from './ButtonGroup';
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
import { Toolbar, ToolbarProps } from './Toolbar';

const meta: Meta = {
  title: 'Toolbar',
  argTypes: {
    children: {
      table: { disable: true }
    },
    keyDownTranslators: {
      table: { disable: true }
    },
    tabStops: {
      table: { disable: true }
    }
  },
  parameters: {
    controls: { expanded: false, hideNoControlsWarning: true }
  }
};

export default meta;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tabStopChangeAction(arg: any) {
  action('tab-stop-change')(arg === null ? '<null>' : arg);
}

type ToolbarToggleButtonProps = {
  id: string;
  label: string;
  icon: IconType;
  pressed: boolean;
  onClick: MouseEventHandler<HTMLElement>;
  onMouseDown: MouseEventHandler<HTMLElement>;
};

const ToolbarToggleButton: FC<ToolbarToggleButtonProps> = ({
  id,
  label,
  icon,
  pressed,
  onClick: userOnClick,
  onMouseDown
}) => {
  const { ref, onClick, tabIndex } = useReactRoverTabStop(id, userOnClick);
  return (
    <ToggleButton
      ref={ref}
      tabIndex={tabIndex}
      onClick={onClick}
      label={label}
      icon={icon}
      pressed={pressed}
      onMouseDown={onMouseDown}
    />
  );
};

type ToolbarRadioButtonProps = {
  id: string;
  label: string;
  icon: IconType;
  checked: boolean;
  onClick: MouseEventHandler<HTMLElement>;
  onMouseDown: MouseEventHandler<HTMLElement>;
};

const ToolbarRadioButton: FC<ToolbarRadioButtonProps> = ({
  id,
  label,
  icon,
  checked,
  onClick: userOnClick,
  onMouseDown
}) => {
  const { ref, onClick, tabIndex } = useReactRoverTabStop(id, userOnClick);
  return (
    <RadioButton
      ref={ref}
      tabIndex={tabIndex}
      onClick={onClick}
      label={label}
      icon={icon}
      checked={checked}
      onMouseDown={onMouseDown}
    />
  );
};

type ToolbarButtonProps = {
  id: string;
  label: string;
  disabledFocusable?: boolean;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLElement>;
  onMouseDown?: MouseEventHandler<HTMLElement>;
};

const ToolbarButton: FC<ToolbarButtonProps> = ({
  id,
  label,
  disabledFocusable,
  disabled,
  onClick: userOnClick,
  onMouseDown
}) => {
  const { ref, onClick, tabIndex } = useReactRoverTabStop(id, userOnClick);
  return (
    <Button
      ref={ref}
      tabIndex={tabIndex}
      onClick={onClick}
      disabledFocusable={disabledFocusable}
      disabled={disabled}
      label={label}
      onMouseDown={onMouseDown}
    />
  );
};

type ToolbarMenuProps = {
  id: string;
  valueFormatter: (value: string) => string;
  menuLabel: string;
  value: string;
  options: string[];
  onChange: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>, newValue: string) => void;
};

const ToolbarMenu: FC<ToolbarMenuProps> = ({ id, menuLabel, valueFormatter, options, value, onChange }) => {
  const { ref, onClick, tabIndex } = useReactRoverTabStop(id);
  return (
    <Menu
      ref={ref}
      tabIndex={tabIndex}
      onClick={onClick}
      valueFormatter={valueFormatter}
      menuLabel={menuLabel}
      options={options}
      value={value}
      onChange={onChange}
    />
  );
};

type ToolbarSpinButtonProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>, newValue: number) => void;
  onMouseDown: MouseEventHandler<HTMLElement>;
};

const ToolbarSpinButton: FC<ToolbarSpinButtonProps> = ({
  id,
  label,
  min,
  max,
  value,
  onChange,
  onMouseDown
}) => {
  const { ref, onClick, tabIndex } = useReactRoverTabStop(id);
  return (
    <SpinButton
      ref={ref}
      tabIndex={tabIndex}
      onClick={onClick}
      label={label}
      value={value}
      min={min}
      max={max}
      onMouseDown={onMouseDown}
      onChange={onChange}
    />
  );
};

type ToolbarCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onMouseDown: MouseEventHandler<HTMLElement>;
};

const ToolbarCheckbox: FC<ToolbarCheckboxProps> = ({ id, label, checked, onChange, onMouseDown }) => {
  const { ref, onClick, tabIndex } = useReactRoverTabStop(id);
  return (
    <Checkbox
      ref={ref}
      tabIndex={tabIndex}
      onClick={onClick}
      label={label}
      checked={checked}
      onMouseDown={onMouseDown}
      onChange={onChange}
    />
  );
};

type ToolbarLinkProps = {
  id: string;
  label: string;
  href: string;
};

const ToolbarLink: FC<ToolbarLinkProps> = ({ id, label, href }) => {
  const { ref, onClick, tabIndex } = useReactRoverTabStop(id);
  return <Link ref={ref} tabIndex={tabIndex} onClick={onClick} label={label} href={href} />;
};

const ToolbarRover: FC<ToolbarProps> = ({ children, ...rest }) => {
  const { onKeyDown } = useReactRoverContainer((event) => console.log(`keydown ${event.key}`));
  return (
    <Toolbar {...rest} onKeyDown={onKeyDown}>
      {children}
    </Toolbar>
  );
};

const horizontalToolbarKeyDownTranslators = [
  horizontalRadioGroupNavigation(true),
  horizontalNavigation(true),
  extremesNavigation()
];

const TextEditorToolbarTemplate: Story<void> = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState(initialEditorState);

  // Prevents focus leaving the text area if it currently has focus.
  // This is so you can click buttons in the toolbar without losing focus
  // (and the caret) in the text area:
  const mouseDownHandler = useCallback((event: MouseEvent) => {
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
      <ReactRoverProvider
        keyDownTranslators={horizontalToolbarKeyDownTranslators}
        onTabStopChange={tabStopChangeAction}
      >
        <ToolbarRover aria-label="Text Formatting" aria-controls="text-area">
          <ButtonGroup>
            <ToolbarToggleButton
              id="bold"
              label="Bold"
              icon={FaBold}
              pressed={state.bold}
              onMouseDown={mouseDownHandler}
              onClick={() => setState((state) => ({ ...state, bold: !state.bold }))}
            />
            <ToolbarToggleButton
              id="italic"
              label="Italic"
              icon={FaItalic}
              pressed={state.italic}
              onMouseDown={mouseDownHandler}
              onClick={() => setState((state) => ({ ...state, italic: !state.italic }))}
            />
            <ToolbarToggleButton
              id="underline"
              label="Underline"
              icon={FaUnderline}
              pressed={state.underline}
              onMouseDown={mouseDownHandler}
              onClick={() => setState((state) => ({ ...state, underline: !state.underline }))}
            />
          </ButtonGroup>
          <RadioButtonGroup>
            <ToolbarRadioButton
              id="align-left"
              label="Align left"
              icon={FaAlignLeft}
              checked={state.justify === 'left'}
              onMouseDown={mouseDownHandler}
              onClick={() => setState((state) => ({ ...state, justify: 'left' }))}
            />
            <ToolbarRadioButton
              id="align-center"
              label="Align center"
              icon={FaAlignCenter}
              checked={state.justify === 'center'}
              onMouseDown={mouseDownHandler}
              onClick={() => setState((state) => ({ ...state, justify: 'center' }))}
            />
            <ToolbarRadioButton
              id="align-right"
              label="Align right"
              icon={FaAlignRight}
              checked={state.justify === 'right'}
              onMouseDown={mouseDownHandler}
              onClick={() => setState((state) => ({ ...state, justify: 'right' }))}
            />
          </RadioButtonGroup>
          <ButtonGroup>
            <ToolbarButton
              id="copy"
              label="Copy"
              onMouseDown={mouseDownHandler}
              onClick={action('copy-button-click')}
            />
            <ToolbarButton
              id="paste"
              label="Paste"
              disabledFocusable
              onMouseDown={mouseDownHandler}
              onClick={action('paste-button-click')}
            />
            <ToolbarButton
              id="cut"
              label="Cut"
              onMouseDown={mouseDownHandler}
              onClick={action('cut-button-click')}
            />
          </ButtonGroup>
          <ToolbarMenu
            id="font-family"
            valueFormatter={(value) => `Font: ${value}`}
            menuLabel="Font family"
            options={state.fontFamilies}
            value={state.fontFamily}
            onChange={(_, value) => setState((state) => ({ ...state, fontFamily: value }))}
          />
          <ToolbarSpinButton
            id="font-size"
            label="Font size in points"
            value={state.fontSize}
            min={5}
            max={24}
            onMouseDown={mouseDownHandler}
            onChange={(_, value) => setState((state) => ({ ...state, fontSize: value }))}
          />
          <ToolbarCheckbox
            id="night-mode"
            label="Night Mode"
            checked={state.nightMode}
            onMouseDown={mouseDownHandler}
            onChange={(_, nightMode) => setState((state) => ({ ...state, nightMode }))}
          />
          <ToolbarLink id="link" label="Help" href="https://www.google.com" />
        </ToolbarRover>
      </ReactRoverProvider>
      <TextArea id="text-area" ref={textAreaRef} state={state} />
    </StackedLayout>
  );
};

const DynamicToolbarTemplate: Story<void> = () => {
  const [showButtonOne, setShowButtonOne] = useState(true);
  const [showButtonTwo, setShowButtonTwo] = useState(true);
  const [showButtonThree, setShowButtonThree] = useState(true);
  const [enableButtonThree, setEnableButtonThree] = useState(true);
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <ReactRoverProvider
        keyDownTranslators={horizontalToolbarKeyDownTranslators}
        onTabStopChange={tabStopChangeAction}
      >
        <ToolbarRover aria-label="Toolbar">
          {showButtonOne && <ToolbarButton id="one" label="One" onClick={action('button-one-click')} />}
          {showButtonTwo && <ToolbarButton id="two" label="Two" onClick={action('button-two-click')} />}
          {showButtonThree && (
            <ToolbarButton
              id="three"
              label="Three"
              disabled={!enableButtonThree}
              onClick={action('button-three-click')}
            />
          )}
        </ToolbarRover>
      </ReactRoverProvider>
      <div css={{ display: 'flex', gap: 16 }}>
        <Button
          label={showButtonOne ? 'Delete Button One' : 'Render Button One'}
          onClick={() => setShowButtonOne((state) => !state)}
        />
        <Button
          label={showButtonTwo ? 'Delete Button Two' : 'Render Button Two'}
          onClick={() => setShowButtonTwo((state) => !state)}
        />
        <Button
          label={showButtonThree ? 'Delete Button Three' : 'Render Button Three'}
          onClick={() => setShowButtonThree((state) => !state)}
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
}) => (
  <StackedLayout>
    <Button label="Focus before" />
    <ReactRoverProvider
      keyDownTranslators={keyDownTranslators}
      onTabStopChange={tabStopChangeAction}
      initialItem={initialId}
      shouldFocusOnClick={shouldFocusOnClick}
    >
      <ToolbarRover aria-label="Toolbar">
        {tabStops.map((tabStop) => (
          <ToolbarButton
            key={tabStop.id}
            id={tabStop.id}
            label={tabStop.label}
            disabled={tabStop.disabled}
            disabledFocusable={tabStop.disabledFocusable}
            onClick={(event) => {
              !tabStop.disabledFocusable && action('tab-stop-click')(event);
            }}
          />
        ))}
      </ToolbarRover>
    </ReactRoverProvider>
    <Button label="Focus after" />
  </StackedLayout>
);

export const TextEditorToolbar = TextEditorToolbarTemplate.bind({});
TextEditorToolbar.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' }
};

export const DynamicToolbar = DynamicToolbarTemplate.bind({});
DynamicToolbar.parameters = {
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
Basic.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' }
};

export const WithButtonTwoAsInitialTabStop = SimpleToolbarTemplate.bind({});
WithButtonTwoAsInitialTabStop.args = {
  keyDownTranslators: [horizontalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ],
  initialId: 'two'
};
WithButtonTwoAsInitialTabStop.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' }
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
WithDisabledEndStops.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' }
};

export const WithDisabledFocusableEndStops = SimpleToolbarTemplate.bind({});
WithDisabledFocusableEndStops.args = {
  keyDownTranslators: [horizontalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One', disabledFocusable: true },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three', disabledFocusable: true }
  ]
};
WithDisabledFocusableEndStops.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' }
};

export const WithNoWraparound = SimpleToolbarTemplate.bind({});
WithNoWraparound.args = {
  keyDownTranslators: [horizontalNavigation(false), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};
WithNoWraparound.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' }
};

export const WithVerticalNavigation = SimpleToolbarTemplate.bind({});
WithVerticalNavigation.args = {
  keyDownTranslators: [verticalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};
WithVerticalNavigation.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' }
};

export const WithHorizontalAndVerticalNavigation = SimpleToolbarTemplate.bind({});
WithHorizontalAndVerticalNavigation.args = {
  keyDownTranslators: [horizontalNavigation(), verticalNavigation(), extremesNavigation()],
  tabStops: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' }
  ]
};
WithHorizontalAndVerticalNavigation.parameters = {
  options: { selectedPanel: 'storybook/actions/panel' }
};
