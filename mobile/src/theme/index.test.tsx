import React from 'react';
import { Text } from 'react-native';
import { act, create } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { colors, highContrastColors, useThemeColors } from './index';
import { useAuthStore } from '../store/authStore';

vi.mock('react-native', async () => {
  const ReactModule = await import('react');

  return {
    Text: ({ children, ...props }: { children?: React.ReactNode }) =>
      ReactModule.createElement('Text', props, children),
  };
});

function ThemeProbe() {
  const themeColors = useThemeColors();

  return (
    <Text
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.textPrimary,
      }}
    >
      {themeColors.primary}
    </Text>
  );
}

describe('useThemeColors', () => {
  afterEach(() => {
    act(() => {
      useAuthStore.setState({ isHighContrast: false });
    });
  });

  it('re-renderiza componentes com a paleta de alto contraste quando ativada', () => {
    useAuthStore.setState({ isHighContrast: false });
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<ThemeProbe />);
    });

    expect(renderer!.toJSON()).toMatchObject({
      props: {
        style: {
          backgroundColor: colors.background,
          color: colors.textPrimary,
        },
      },
      children: [colors.primary],
    });

    act(() => {
      useAuthStore.setState({ isHighContrast: true });
    });

    expect(renderer!.toJSON()).toMatchObject({
      props: {
        style: {
          backgroundColor: highContrastColors.background,
          color: highContrastColors.textPrimary,
        },
      },
      children: [highContrastColors.primary],
    });
    expect(highContrastColors.textPrimary).not.toBe(colors.textPrimary);
  });
});
