import React from 'react';
import { act, create } from 'react-test-renderer';
import { afterEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cartStore';
import { selectCartItemCount } from './cartSelectors';
import type { Product } from '../types';

function CartBadgeCount() {
  const itemCount = useCartStore(selectCartItemCount);
  return <>{itemCount}</>;
}

const sampleProduct: Product = {
  id: 'prod-1',
  name: 'Build Andromeda',
  description: 'PC gamer',
  price: 8999.9,
  imageUrl: '',
  category: 'high-end',
  specs: 'RTX 4070',
  inStock: true,
  createdAt: '2026-04-09T00:00:00Z',
};

describe('selectCartItemCount', () => {
  afterEach(() => {
    act(() => {
      useCartStore.getState().clearCart();
    });
  });

  it('re-renderiza a contagem quando um item e adicionado ao carrinho', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<CartBadgeCount />);
    });

    expect(renderer!.toJSON()).toBe('0');

    act(() => {
      useCartStore.getState().addItem(sampleProduct);
    });

    expect(renderer!.toJSON()).toBe('1');

    act(() => {
      useCartStore.getState().addItem(sampleProduct);
    });

    expect(renderer!.toJSON()).toBe('2');
  });
});
