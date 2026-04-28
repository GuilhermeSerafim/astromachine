import React from 'react';
import { Switch, TouchableOpacity } from 'react-native';
import { act, create } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AccessibilityScreen from './AccessibilityScreen';
import { highContrastColors } from '../theme';
import { useAuthStore } from '../store/authStore';

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
    ScrollView: createMockComponent('ScrollView'),
    Switch: createMockComponent('Switch'),
    StyleSheet: {
      create: <T extends Record<string, unknown>>(styles: T) => styles,
    },
  };
});

vi.mock('@expo/vector-icons', async () => {
  const ReactModule = await import('react');

  return {
    Ionicons: (props: Record<string, unknown>) => ReactModule.createElement('Ionicons', props),
  };
});

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('AccessibilityScreen', () => {
  afterEach(() => {
    act(() => {
      useAuthStore.setState({ isHighContrast: false, isLargeFont: false });
    });
  });

  it('mostra uma acao para sair da conta do cliente', () => {
    const onLogout = vi.fn();
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<AccessibilityScreen onGoBack={vi.fn()} onLogout={onLogout} />);
    });

    const logoutButtons = renderer!.root
      .findAllByType(TouchableOpacity)
      .filter((button) => button.props.accessibilityLabel === 'Sair da conta');

    expect(logoutButtons).toHaveLength(1);

    act(() => {
      logoutButtons[0].props.onPress();
    });

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('aplica a paleta de alto contraste quando ativada', () => {
    useAuthStore.setState({ isHighContrast: true });
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<AccessibilityScreen onGoBack={vi.fn()} onLogout={vi.fn()} />);
    });

    expect(renderer!.toJSON()).toMatchObject({
      props: {
        style: {
          backgroundColor: highContrastColors.background,
        },
      },
    });
  });

  it('troca a paleta da tela ao tocar no switch de alto contraste', () => {
    useAuthStore.setState({ isHighContrast: false });
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<AccessibilityScreen onGoBack={vi.fn()} onLogout={vi.fn()} />);
    });

    const highContrastSwitch = renderer!.root
      .findAllByType(Switch)
      .find((switchControl) => switchControl.props.accessibilityLabel === 'Ativar alto contraste');

    expect(highContrastSwitch).toBeDefined();

    act(() => {
      highContrastSwitch!.props.onValueChange();
    });

    expect(renderer!.toJSON()).toMatchObject({
      props: {
        style: {
          backgroundColor: highContrastColors.background,
        },
      },
    });
  });
});
