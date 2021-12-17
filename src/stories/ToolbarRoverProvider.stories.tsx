/** @jsxImportSource @emotion/react */
import { FC, forwardRef, KeyboardEvent, memo, MouseEventHandler, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import {
  gridExtremesNavigation,
  gridRowExtremesNavigation,
  gridSingleStepNavigation
} from '@/keyDownTranslators';
import {
  ToolbarRoverProvider,
  useToolbarRoverContainer,
  useToolbarRoverTabStop
} from '@/ToolbarRoverProvider';

import { Button } from './Button';
import { Grid } from './Grid';
import { StackedLayout } from './StackedLayout';

const meta: Meta = {
  title: 'AlternativeToolbarGrid',
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

type MemoizedGridButtonProps = {
  tabIndex: number;
  onClick: MouseEventHandler<HTMLElement>;
  disabled: boolean;
  label: string;
};

const MemoizedGridButton = memo(
  forwardRef<HTMLButtonElement, MemoizedGridButtonProps>(({ disabled, label, tabIndex, onClick }, ref) => (
    <Button ref={ref} disabled={disabled} label={label} onClick={onClick} tabIndex={tabIndex} />
  ))
);

type GridButtonProps = {
  item: GridItem;
};

const GridButton: FC<GridButtonProps> = ({ item }) => {
  const { ref, onClick, tabIndex } = useToolbarRoverTabStop(item.id, () =>
    console.log(`item ${item.id} clicked`)
  );
  return (
    <MemoizedGridButton
      ref={ref}
      disabled={item.id === '5'}
      label={item.label}
      onClick={onClick}
      tabIndex={tabIndex}
    />
  );
};

type MemoizedGridOfButtonsProps = {
  items: GridItem[];
  columnsCount: number;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

const MemoizedGridOfButtons: FC<MemoizedGridOfButtonsProps> = memo(({ items, columnsCount, onKeyDown }) => (
  <Grid aria-label="Cells" columnsCount={columnsCount} onKeyDown={onKeyDown}>
    {items.map((item) => (
      <GridButton key={item.id} item={item} />
    ))}
  </Grid>
));

type GridOfButtonsProps = { items: GridItem[]; columnsCount: number };

const GridOfButtons: FC<GridOfButtonsProps> = ({ items, columnsCount }) => {
  const { onKeyDown } = useToolbarRoverContainer((event) => console.log(`keydown ${event.key}`));
  return <MemoizedGridOfButtons items={items} columnsCount={columnsCount} onKeyDown={onKeyDown} />;
};

const gridKeyDownTranslators = [
  gridExtremesNavigation(),
  gridRowExtremesNavigation(),
  gridSingleStepNavigation()
];

const GridTemplate: Story<GridTemplateProps> = ({ columnsCount, itemCount }) => {
  const [items] = useState<GridItem[]>(() => createItems(itemCount));
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <ToolbarRoverProvider
        keyDownTranslators={gridKeyDownTranslators}
        columnsCount={columnsCount}
        onTabStopChange={tabStopChangeAction}
      >
        <GridOfButtons columnsCount={columnsCount} items={items} />
      </ToolbarRoverProvider>
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
