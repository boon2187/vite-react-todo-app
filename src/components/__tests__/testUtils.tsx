import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
);

export const renderWithProvider = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: Providers, ...options });

// useSortable を使うコンポーネントのテスト用。ids は SortableContext の items に渡す
export const renderSortable = (
  ui: ReactElement,
  ids: string[],
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ChakraProvider value={defaultSystem}>
      <DndContext>
        <SortableContext items={ids}>{children}</SortableContext>
      </DndContext>
    </ChakraProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};
