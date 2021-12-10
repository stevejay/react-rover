/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import { extremesNavigation } from '@/index';
import {
  gridExtremesNavigation,
  gridRowExtremesNavigation,
  gridSingleStepNavigation,
  verticalNavigation
} from '@/keyDownTranslators';
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
type GridTemplateProps = { columnsCount: number; itemCount: number };

const gridKeyDownTranslators = [
  gridExtremesNavigation(),
  gridRowExtremesNavigation(),
  gridSingleStepNavigation()
];

const GridTemplate: Story<GridTemplateProps> = ({ columnsCount, itemCount }) => {
  const [items] = useState<GridItem[]>(() => createItems(itemCount));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onTabStopChange = useCallback(() => action('current-item-changed'), []);
  const { getTabContainerProps, getTabStopProps } = useItemRover(items, gridKeyDownTranslators, {
    initialItem: items[1],
    onTabStopChange,
    columnsCount
  });
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Grid columnsCount={columnsCount} aria-label="Cells" {...getTabContainerProps()}>
        {items.map((item) => (
          <Button key={item.id} disabled={item.id === '3'} label={item.label} {...getTabStopProps(item)} />
        ))}
      </Grid>
      <Button label="Focus after" />
    </StackedLayout>
  );
};

const DynamicGridTemplate: Story<void> = () => {
  const [columnsCount, setColumnsCount] = useState(3);
  const [enableButtonTwo, setEnableButtonTwo] = useState(false);
  const [items] = useState<GridItem[]>(() => createItems(7));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onTabStopChange = useCallback(() => action('current-item-changed'), []);
  const { getTabContainerProps, getTabStopProps } = useItemRover(items, gridKeyDownTranslators, {
    initialItem: items[2],
    onTabStopChange,
    columnsCount
  });
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Grid columnsCount={columnsCount} aria-label="Cells" {...getTabContainerProps()}>
        {items.map((item) => (
          <Button
            key={item.id}
            label={item.label}
            disabled={item.id === '2' ? !enableButtonTwo : false}
            {...getTabStopProps(item)}
          />
        ))}
      </Grid>
      <div css={{ display: 'flex', gap: 16 }}>
        <Button
          label={`Change to ${columnsCount === 2 ? '3' : '2'} columns`}
          onClick={() => setColumnsCount((state) => (state === 2 ? 3 : 2))}
        />
        <Button
          label={enableButtonTwo ? 'Disable Button Two' : 'Enable Button Two'}
          onClick={() => setEnableButtonTwo((state) => !state)}
        />
      </div>
    </StackedLayout>
  );
};

type OneDimensionalTemplateProps = { itemCount: number };

const oneDimensionalKeyDownTranslators = [verticalNavigation(), extremesNavigation()];

const OneDimensionalTemplate: Story<OneDimensionalTemplateProps> = ({ itemCount }) => {
  const [items] = useState<GridItem[]>(() => createItems(itemCount));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onTabStopChange = useCallback(() => action('current-item-changed'), []);
  const { getTabContainerProps, getTabStopProps } = useItemRover(items, oneDimensionalKeyDownTranslators, {
    initialItem: items[1],
    onTabStopChange
  });
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Grid columnsCount={1} aria-label="Cells" {...getTabContainerProps()}>
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
  columnsCount: 12,
  itemCount: 2000
};

export const SmallGrid = GridTemplate.bind({});
SmallGrid.args = {
  columnsCount: 3,
  itemCount: 8
};

export const DynamicGrid = DynamicGridTemplate.bind({});

export const Column = OneDimensionalTemplate.bind({});
Column.args = {
  itemCount: 8
};
