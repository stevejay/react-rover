/** @jsxImportSource @emotion/react */
import { FC, forwardRef, KeyboardEvent, memo, MouseEventHandler, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import {
  extremesNavigation,
  gridExtremesNavigation,
  gridRowExtremesNavigation,
  gridSingleStepNavigation,
  ReactRoverProvider,
  useReactRoverContainer,
  useReactRoverTabStop,
  verticalNavigation
} from '@/index';

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
  const { ref, onClick, tabIndex } = useReactRoverTabStop(item, () => console.log(`item ${item.id} clicked`));
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
  const { onKeyDown } = useReactRoverContainer((event) => console.log(`keydown ${event.key}`));
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
      <ReactRoverProvider
        keyDownTranslators={gridKeyDownTranslators}
        columnsCount={columnsCount}
        onTabStopChange={tabStopChangeAction}
        initialItem={items[1]}
      >
        <GridOfButtons columnsCount={columnsCount} items={items} />
      </ReactRoverProvider>
      <Button label="Focus after" />
    </StackedLayout>
  );
};

const DynamicGridTemplate: Story<void> = () => {
  const [columnsCount, setColumnsCount] = useState(3);
  const [enableButtonThree, setEnableButtonThree] = useState(false);
  const [items] = useState<GridItem[]>(() => createItems(7));
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <ReactRoverProvider
        keyDownTranslators={gridKeyDownTranslators}
        onTabStopChange={tabStopChangeAction}
        columnsCount={columnsCount}
        initialItem={items[2]}
      >
        <GridOfButtons columnsCount={columnsCount} items={items} />
      </ReactRoverProvider>
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
  return (
    <StackedLayout>
      <Button label="Focus before" />
      <ReactRoverProvider
        keyDownTranslators={oneDimensionalKeyDownTranslators}
        onTabStopChange={tabStopChangeAction}
      >
        <GridOfButtons columnsCount={1} items={items} />
      </ReactRoverProvider>
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
