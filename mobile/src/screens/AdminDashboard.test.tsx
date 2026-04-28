import React from 'react';
import { TouchableOpacity } from 'react-native';
import { act, create } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminDashboard from './AdminDashboard';
import { getProducts } from '../services/api';

vi.mock('react-native', async () => {
  const ReactModule = await import('react');
  const createMockComponent =
    (name: string) =>
    ({ children, ...props }: { children?: React.ReactNode }) =>
      ReactModule.createElement(name, props, children);

  return {
    View: createMockComponent('View'),
    Text: createMockComponent('Text'),
    FlatList: createMockComponent('FlatList'),
    TouchableOpacity: createMockComponent('TouchableOpacity'),
    StyleSheet: {
      create: <T extends Record<string, unknown>>(styles: T) => styles,
    },
    ActivityIndicator: createMockComponent('ActivityIndicator'),
    Image: createMockComponent('Image'),
    RefreshControl: createMockComponent('RefreshControl'),
    AccessibilityInfo: {
      announceForAccessibility: vi.fn(),
    },
  };
});

vi.mock('@expo/vector-icons', async () => {
  const ReactModule = await import('react');

  return {
    Ionicons: (props: Record<string, unknown>) => ReactModule.createElement('Ionicons', props),
  };
});

vi.mock('../store/authStore', () => ({
  useAuthStore: (selector: (state: unknown) => unknown) =>
    selector({ isHighContrast: false, isLargeFont: false }),
}));

vi.mock('../services/api', () => ({
  getProducts: vi.fn(),
  deleteProduct: vi.fn(),
}));

vi.mock('../utils/dialog', () => ({
  showConfirm: vi.fn(),
  showMessage: vi.fn(),
}));

describe('AdminDashboard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('mostra uma acao de configuracoes no painel admin', async () => {
    vi.mocked(getProducts).mockResolvedValue([]);
    const onNavigateToAccessibility = vi.fn();
    let renderer: ReturnType<typeof create>;

    await act(async () => {
      renderer = create(
        <AdminDashboard
          onNavigateToForm={vi.fn()}
          onNavigateToAccessibility={onNavigateToAccessibility}
          onLogout={vi.fn()}
        />
      );
    });

    const settingsButtons = renderer!.root
      .findAllByType(TouchableOpacity)
      .filter((button) => button.props.accessibilityLabel === 'Configurações de acessibilidade');

    expect(settingsButtons).toHaveLength(1);

    act(() => {
      settingsButtons[0].props.onPress();
    });

    expect(onNavigateToAccessibility).toHaveBeenCalledTimes(1);
  });
});
