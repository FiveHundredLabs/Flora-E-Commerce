import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector, useStore } from 'react-redux';
import { useState, type PropsWithChildren } from 'react';
import { cartRefSchema, lineSchema, type CartLine } from './model';

const slice = createSlice({
  name: 'sampleCart',
  initialState: { lines: [] as CartLine[], nextRevision: 1 },
  reducers: {
    add(state, action: PayloadAction<{ productSlug: string; storeSlug: string }>) {
      const parsed = cartRefSchema.safeParse(action.payload);
      if (!parsed.success) return;
      const line = state.lines.find((item) => item.productSlug === parsed.data.productSlug && item.storeSlug === parsed.data.storeSlug);
      if (line) {
        if (line.quantity >= 99) return;
        line.quantity += 1;
        line.revision = state.nextRevision++;
      } else state.lines.push({ ...parsed.data, quantity: 1, revision: state.nextRevision++ });
    },
    update(state, action: PayloadAction<CartLine>) {
      const parsed = lineSchema.safeParse(action.payload);
      if (!parsed.success) return;
      const line = state.lines.find((item) => item.productSlug === parsed.data.productSlug && item.storeSlug === parsed.data.storeSlug);
      if (line) { line.quantity = parsed.data.quantity; line.revision = state.nextRevision++; }
    },
    remove(state, action: PayloadAction<{ productSlug: string; storeSlug: string }>) {
      state.lines = state.lines.filter((line) => line.productSlug !== action.payload.productSlug || line.storeSlug !== action.payload.storeSlug);
    },
    consume(state, action: PayloadAction<CartLine[]>) {
      // Only remove unchanged submitted lines; preserve edits made while a mock write was pending.
      state.lines = state.lines.filter((line) => !action.payload.some((submitted) => submitted.storeSlug === line.storeSlug
        && submitted.productSlug === line.productSlug && submitted.revision === line.revision && submitted.quantity === line.quantity));
    },
  },
});
export const cartActions = slice.actions;
export const createCartStore = () => configureStore({ reducer: { cart: slice.reducer } });
export type CartStore = ReturnType<typeof createCartStore>;
type RootState = ReturnType<CartStore['getState']>;
export const useCartDispatch = useDispatch.withTypes<CartStore['dispatch']>();
export const useCartSelector = useSelector.withTypes<RootState>();
export const useCartStore = useStore.withTypes<CartStore>();

export function CartProvider({ children }: PropsWithChildren) {
  const [store] = useState(createCartStore);
  return <Provider store={store}>{children}</Provider>;
}
