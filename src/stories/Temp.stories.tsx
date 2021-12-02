/** @jsxImportSource @emotion/react */
import { FaBold } from 'react-icons/fa';
import { Meta, Story } from '@storybook/react';

import { Button } from './Button';
import { ToggleButton } from './ToggleButton';
import { Toolbar } from './Toolbar';

const meta: Meta = {
  title: 'Toolbar Components',
  argTypes: {
    children: {
      control: {
        type: 'text'
      }
    }
  },
  parameters: {
    controls: { expanded: false },
    argTypesRegex: '^on[A-Z].*'
  }
};

export default meta;

const Template: Story<void> = () => {
  return (
    <Toolbar aria-label="Text Formatting" aria-controls="textarea1">
      <Toolbar.Group>
        <Button label="Plain" />
        <Button label="Disabled Focusable" disabledFocusable />
        <Button label="Disabled" disabled />
      </Toolbar.Group>
      <Toolbar.Group>
        <ToggleButton label="Not Pressed" icon={FaBold} pressed={false} />
        <ToggleButton label="Pressed" icon={FaBold} pressed />
        <ToggleButton label="Disabled Focusable" disabledFocusable icon={FaBold} pressed={false} />
        <ToggleButton label="Disabled" disabled icon={FaBold} pressed={false} />
      </Toolbar.Group>
    </Toolbar>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
