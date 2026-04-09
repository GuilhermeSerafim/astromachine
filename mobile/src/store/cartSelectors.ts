import type { CartItem } from '../types';

type CartState = {
  items: CartItem[];
};

function countItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartItemCount(state: CartState): number {
  return countItems(state.items);
}
