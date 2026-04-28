import React from 'react';
import { StyleSheet } from 'react-native';
import { act, create } from 'react-test-renderer';
import { describe, expect, it, vi } from 'vitest';
import AppNavigator from './AppNavigator';
import { spacing } from '../theme';

vi.mock('react-native', async () => {
  const ReactModule = await import('react');
  const createMockComponent =
    (name: string) =>
    ({ children, ...props }: { children?: React.ReactNode }) =>
      ReactModule.createElement(name, props, children);

  return {
    View: createMockComponent('View'),
    Text: createMockComponent('Text'),
    TouchableOpacity: createMockComponent('TouchableOpacity'),
    StyleSheet: {
      create: <T extends Record<string, unknown>>(styles: T) => styles,
      flatten: (style: unknown) =>
        Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style,
    },
  };
});

vi.mock('@expo/vector-icons', async () => {
  const ReactModule = await import('react');

  return {
    Ionicons: (props: Record<string, unknown>) => ReactModule.createElement('Ionicons', props),
  };
});

vi.mock('react-native-safe-area-context', async () => {
  const ReactModule = await import('react');

  return {
    SafeAreaProvider: ({ children }: { children?: React.ReactNode }) =>
      ReactModule.createElement(ReactModule.Fragment, null, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 34, left: 0 }),
  };
});

vi.mock('../store/authStore', () => ({
  useAuthStore: (selector: (state: unknown) => unknown) =>
    selector({ user: { role: 'customer' }, logout: vi.fn() }),
}));

vi.mock('../store/cartStore', () => ({
  useCartStore: (selector: (state: unknown) => unknown) => selector({ items: [] }),
}));

vi.mock('../screens/CatalogScreen', async () => {
  const ReactModule = await import('react');
  const { View } = await import('react-native');

  return {
    default: () => ReactModule.createElement(View, { accessibilityLabel: 'Catalogo' }),
  };
});

vi.mock('../screens/ProductDetailScreen', () => ({ default: () => null }));
vi.mock('../screens/CartScreen', () => ({ default: () => null }));
vi.mock('../screens/CheckoutScreen', () => ({ default: () => null }));
vi.mock('../screens/AdminDashboard', () => ({ default: () => null }));
vi.mock('../screens/AdminFormScreen', () => ({ default: () => null }));
vi.mock('../screens/AccessibilityScreen', () => ({ default: () => null }));

describe('AppNavigator', () => {
  it('reserva a safe area inferior na tab bar', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<AppNavigator />);
    });

    const tabBar = renderer!.root.findByProps({ accessibilityRole: 'tablist' });
    const tabBarStyle = StyleSheet.flatten(tabBar.props.style) as { paddingBottom?: number };

    expect(tabBarStyle.paddingBottom).toBe(34 + spacing.sm);
  });
});
