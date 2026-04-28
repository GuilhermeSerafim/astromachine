// ==========================================
// AstroMachine Mobile - Tema Espacial
// ==========================================

import { useAuthStore } from '../store/authStore';

export const colors = {
  // Fundos
  background: '#0a0a1a',
  surface: '#12122a',
  surfaceLight: '#1a1a3e',
  card: '#16163a',
  cardHover: '#1e1e4a',

  // Primárias
  primary: '#6c63ff',
  primaryLight: '#8b83ff',
  primaryDark: '#4a42d4',

  // Acentos
  accent: '#00d4ff',
  accentSecondary: '#ff6b9d',
  warning: '#ffc107',
  error: '#ff4757',
  success: '#2ed573',

  // Texto
  textPrimary: '#f0f0ff',
  textSecondary: '#a0a0cc',
  textMuted: '#6a6a99',
  textOnPrimary: '#ffffff',

  // Bordas
  border: '#2a2a55',
  borderLight: '#3a3a66',

  // Gradientes (para referência)
  gradientStart: '#6c63ff',
  gradientEnd: '#00d4ff',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(108, 99, 255, 0.1)',
};

export type AppColors = typeof colors;

export const highContrastColors: AppColors = {
  // Fundos
  background: '#000000',
  surface: '#05070c',
  surfaceLight: '#111827',
  card: '#05070c',
  cardHover: '#101820',

  // Primarias
  primary: '#ffd400',
  primaryLight: '#ffe76a',
  primaryDark: '#c99b00',

  // Acentos
  accent: '#00f0ff',
  accentSecondary: '#ff4fa3',
  warning: '#ffdd33',
  error: '#ff5c7a',
  success: '#49ff8a',

  // Texto
  textPrimary: '#ffffff',
  textSecondary: '#f4f4f5',
  textMuted: '#d4d4d8',
  textOnPrimary: '#000000',

  // Bordas
  border: '#ffffff',
  borderLight: '#e5e7eb',

  // Gradientes (para referencia)
  gradientStart: '#ffd400',
  gradientEnd: '#00f0ff',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.85)',
  overlayLight: 'rgba(255, 255, 255, 0.16)',
};

export const getThemeColors = (isHighContrast: boolean): AppColors =>
  isHighContrast ? highContrastColors : colors;

export function useThemeColors() {
  const isHighContrast = useAuthStore((s) => s.isHighContrast);
  return getThemeColors(isHighContrast);
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 34,
};

export const fontSizeLarge = {
  xs: 15,
  sm: 17,
  md: 19,
  lg: 22,
  xl: 26,
  xxl: 33,
  title: 40,
};

export const shadows = {
  card: {
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  button: {
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
};

export default { colors, spacing, borderRadius, fontSize, fontSizeLarge, shadows };
