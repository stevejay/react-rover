/** @jsxImportSource @emotion/react */
import { useCallback } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import { useItemRover } from '@/useItemRover';

import { extremesNavigation } from '..';

import { Button } from './Button';
import { Grid } from './Grid';
import { StackedLayout } from './StackedLayout';

const meta: Meta = {
  title: 'Grid',
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

const gridKeyDownTranslators = [extremesNavigation];

const items: { id: string; label: string }[] = [
  { id: 'one', label: 'One' },
  { id: 'two', label: 'Two' },
  { id: 'three', label: 'Three' },
  { id: 'four', label: 'Four' },
  { id: 'five', label: 'Five' },
  { id: 'six', label: 'Six' },
  { id: 'seven', label: 'Seven' },
  { id: 'eight', label: 'Eight' }
];

const GridTemplate: Story<void> = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onCurrentItemChange = useCallback(action('current-item-changed'), []);
  const { getTabContainerProps, getTabStopProps } = useItemRover(items, gridKeyDownTranslators, {
    initialItem: items[1],
    onCurrentItemChange
  });
  //    Prevents focus leaving the text area if it currently has focus,
  //   so you can interact with the toolbar without losing the caret:
  //   const mouseDownHandler = useCallback((event: React.MouseEvent) => {
  //     if (
  //       document.activeElement &&
  //       textAreaRef.current &&
  //       textAreaRef.current.contains(document.activeElement)
  //     ) {
  //       event.preventDefault();
  //     }
  //   }, []);
  return (
    <StackedLayout>
      <Grid columns={3} aria-label="Cells" {...getTabContainerProps()}>
        {items.map((item, index) => {
          const rowIndex = Math.floor(index / 3);
          return <Button key={item.id} label={item.label} {...getTabStopProps(item, rowIndex)} />;
        })}
      </Grid>
    </StackedLayout>
  );
};

export const ThreeColumnGrid = GridTemplate.bind({});
ThreeColumnGrid.parameters = {
  controls: { hideNoControlsWarning: true }
};
