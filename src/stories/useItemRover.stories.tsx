/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import { extremesNavigation } from '@/index';
import { gridExtremesNavigation, gridRowExtremesNavigation, verticalNavigation } from '@/keyDownTranslators';
import { useItemRover } from '@/useItemRover';

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
    controls: { expanded: false, hideNoControlsWarning: true }
  }
};

export default meta;

function createItems(count: number): GridItem[] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return [...Array(count)].map((_, i) => ({
    id: `${i}`,
    label: `${i}`
  }));
}

type GridItem = { id: string; label: string };

// [
//   { id: 'one', label: 'One' },
//   { id: 'two', label: 'Two' },
//   { id: 'three', label: 'Three' },
//   { id: 'four', label: 'Four' },
//   { id: 'five', label: 'Five' },
//   { id: 'six', label: 'Six' },
//   { id: 'seven', label: 'Seven' },
//   { id: 'eight', label: 'Eight' }
// ];

type GridTemplateProps = { columns: number; itemCount: number };

const gridKeyDownTranslators = [gridExtremesNavigation(), gridRowExtremesNavigation];

const GridTemplate: Story<GridTemplateProps> = ({ columns, itemCount }) => {
  const [items] = useState<GridItem[]>(() => createItems(itemCount));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onCurrentItemChange = useCallback(action('current-item-changed'), []);
  const { getTabContainerProps, getTabStopProps } = useItemRover(items, gridKeyDownTranslators, {
    initialItem: items[1],
    onCurrentItemChange
  });
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Grid columns={columns} aria-label="Cells" {...getTabContainerProps()}>
        {items.map((item, index) => {
          const rowIndex = Math.floor(index / columns);
          return <Button key={item.id} label={item.label} {...getTabStopProps(item, rowIndex)} />;
        })}
      </Grid>
      <Button label="Focus after" />
    </StackedLayout>
  );
};

type OneDimensionalTemplateProps = { itemCount: number };

const oneDimensionalKeyDownTranslators = [verticalNavigation(), extremesNavigation()];

const OneDimensionalTemplate: Story<OneDimensionalTemplateProps> = ({ itemCount }) => {
  const [items] = useState<GridItem[]>(() => createItems(itemCount));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onCurrentItemChange = useCallback(action('current-item-changed'), []);
  const { getTabContainerProps, getTabStopProps } = useItemRover(items, oneDimensionalKeyDownTranslators, {
    initialItem: items[1],
    onCurrentItemChange
  });
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Grid columns={1} aria-label="Cells" {...getTabContainerProps()}>
        {items.map((item) => (
          <Button key={item.id} label={item.label} {...getTabStopProps(item)} />
        ))}
      </Grid>
      <Button label="Focus after" />
    </StackedLayout>
  );
};

export const MassiveGrid = GridTemplate.bind({});
MassiveGrid.args = {
  columns: 12,
  itemCount: 1000
};

export const SmallGrid = GridTemplate.bind({});
SmallGrid.args = {
  columns: 3,
  itemCount: 8
};

export const Column = OneDimensionalTemplate.bind({});
Column.args = {
  itemCount: 8
};
