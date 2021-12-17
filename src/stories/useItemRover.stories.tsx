/** @jsxImportSource @emotion/react */
import { memo, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import { extremesNavigation } from '@/index';
import {
  gridExtremesNavigation,
  gridRowExtremesNavigation,
  gridSingleStepNavigation,
  verticalNavigation
} from '@/keyDownTranslators';
import { GetTabStopProps, useItemRover } from '@/useItemRover';

import { Button } from './Button';
import { Grid } from './Grid';
import { StackedLayout } from './StackedLayout';

const meta: Meta = {
  title: 'Grid',
  argTypes: {
    children: {
      table: { disable: true }
    },
    columnsCount: {
      table: { disable: true }
    },
    itemCount: {
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

function createItems(count: number): GridItem[] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return [...Array(count)].map((_, i) => ({
    id: `${i + 1}`,
    label: `${i + 1}`
  }));
}

type GridItem = { id: string; label: string };
type GridTemplateProps = { columnsCount: number; itemCount: number };

const gridKeyDownTranslators = [
  gridExtremesNavigation(),
  gridRowExtremesNavigation(),
  gridSingleStepNavigation()
];

type MemoizedButtonProps = { item: GridItem; tabIndex: number; getTabStopProps: GetTabStopProps };

const MemoizedButton = memo<MemoizedButtonProps>(
  ({ item, tabIndex, getTabStopProps }) => (
    // <button type="button" disabled={item.id === '5'} {...getTabStopProps(item)} tabIndex={tabIndex}>
    //   {item.label}
    // </button>
    <Button disabled={item.id === '5'} label={item.label} {...getTabStopProps(item)} tabIndex={tabIndex} />
  ),
  (prevProps, nextProps) =>
    prevProps.item === nextProps.item &&
    prevProps.tabIndex === nextProps.tabIndex &&
    prevProps.getTabStopProps === nextProps.getTabStopProps
);

const GridTemplate: Story<GridTemplateProps> = ({ columnsCount, itemCount }) => {
  const [items] = useState<GridItem[]>(() => createItems(itemCount));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { getTabContainerProps, getTabStopProps, getTabStopTabIndex } = useItemRover(
    items,
    gridKeyDownTranslators,
    {
      initialItem: items[1],
      onTabStopChange: tabStopChangeAction,
      columnsCount
    }
  );
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Grid columnsCount={columnsCount} aria-label="Cells" {...getTabContainerProps()}>
        {items.map((item) => (
          <MemoizedButton
            key={item.id}
            item={item}
            getTabStopProps={getTabStopProps}
            tabIndex={getTabStopTabIndex(item)}
          />
          //   <Button
          //     key={item.id}
          //     disabled={item.id === '5'}
          //     label={item.label}
          //     {...getTabStopProps(item)}
          //     tabIndex={getTabStopTabIndex(item)}
          //   />
        ))}
      </Grid>
      <Button label="Focus after" />
    </StackedLayout>
  );
};

const DynamicGridTemplate: Story<void> = () => {
  const [columnsCount, setColumnsCount] = useState(3);
  const [enableButtonThree, setEnableButtonThree] = useState(false);
  const [items] = useState<GridItem[]>(() => createItems(7));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { getTabContainerProps, getTabStopProps, getTabStopTabIndex } = useItemRover(
    items,
    gridKeyDownTranslators,
    {
      initialItem: items[2],
      onTabStopChange: tabStopChangeAction,
      columnsCount
    }
  );
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Grid columnsCount={columnsCount} aria-label="Cells" {...getTabContainerProps()}>
        {items.map((item) => (
          <Button
            key={item.id}
            label={item.label}
            disabled={item.id === '3' ? !enableButtonThree : false}
            {...getTabStopProps(item)}
            tabIndex={getTabStopTabIndex(item)}
          />
        ))}
      </Grid>
      <div css={{ display: 'flex', gap: 16 }}>
        <Button
          label={`Change to ${columnsCount === 2 ? '3' : '2'} columns`}
          onClick={() => setColumnsCount((state) => (state === 2 ? 3 : 2))}
        />
        <Button
          label={enableButtonThree ? 'Disable Button Three' : 'Enable Button Three'}
          onClick={() => setEnableButtonThree((state) => !state)}
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
  const { getTabContainerProps, getTabStopProps, getTabStopTabIndex } = useItemRover(
    items,
    oneDimensionalKeyDownTranslators,
    {
      onTabStopChange: tabStopChangeAction
    }
  );
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <Grid columnsCount={1} aria-label="Cells" {...getTabContainerProps()}>
        {items.map((item) => (
          <Button
            key={item.id}
            label={item.label}
            {...getTabStopProps(item)}
            tabIndex={getTabStopTabIndex(item)}
          />
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
  itemCount: 10
};

export const DynamicGrid = DynamicGridTemplate.bind({});

export const Column = OneDimensionalTemplate.bind({});
Column.args = {
  itemCount: 5
};
