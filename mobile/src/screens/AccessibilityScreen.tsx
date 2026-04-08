// ==========================================
// AstroMachine Mobile - Tela de Acessibilidade
// ==========================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../theme';
import { useAuthStore } from '../store/authStore';

interface AccessibilityScreenProps {
  onGoBack: () => void;
}

export default function AccessibilityScreen({ onGoBack }: AccessibilityScreenProps) {
  const isLargeFont = useAuthStore((s) => s.isLargeFont);
  const isHighContrast = useAuthStore((s) => s.isHighContrast);
  const toggleLargeFont = useAuthStore((s) => s.toggleLargeFont);
  const toggleHighContrast = useAuthStore((s) => s.toggleHighContrast);

  const fs = isLargeFont
    ? { xs: 15, sm: 17, md: 19, lg: 22, xl: 26, xxl: 33 }
    : { xs: fontSize.xs, sm: fontSize.sm, md: fontSize.md, lg: fontSize.lg, xl: fontSize.xl, xxl: fontSize.xxl };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: fs.xl }]}>Acessibilidade</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.description, { fontSize: fs.sm }]}>
          Configure as opções de acessibilidade para melhorar sua experiência no AstroMachine.
        </Text>

        {/* Opção: Fonte Grande */}
        <View style={styles.optionCard}>
          <View style={styles.optionInfo}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="text" size={24} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { fontSize: fs.md }]}>Fonte Grande</Text>
              <Text style={[styles.optionDescription, { fontSize: fs.xs }]}>
                Aumenta o tamanho de todos os textos do app para melhor legibilidade.
              </Text>
            </View>
          </View>
          <Switch
            value={isLargeFont}
            onValueChange={toggleLargeFont}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isLargeFont ? colors.primary : colors.textMuted}
            accessibilityLabel="Ativar fonte grande"
            accessibilityRole="switch"
            accessibilityState={{ checked: isLargeFont }}
          />
        </View>

        {/* Opção: Alto Contraste */}
        <View style={styles.optionCard}>
          <View style={styles.optionInfo}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="contrast" size={24} color={colors.accent} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { fontSize: fs.md }]}>Alto Contraste</Text>
              <Text style={[styles.optionDescription, { fontSize: fs.xs }]}>
                Aumenta o contraste das cores para facilitar a visualização dos elementos.
              </Text>
            </View>
          </View>
          <Switch
            value={isHighContrast}
            onValueChange={toggleHighContrast}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isHighContrast ? colors.accent : colors.textMuted}
            accessibilityLabel="Ativar alto contraste"
            accessibilityRole="switch"
            accessibilityState={{ checked: isHighContrast }}
          />
        </View>

        {/* Informações */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
          <Text style={[styles.infoText, { fontSize: fs.xs }]}>
            O AstroMachine foi desenvolvido seguindo diretrizes de acessibilidade, incluindo
            suporte a leitores de tela, contraste adequado e áreas de toque confortáveis (mínimo 44px).
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  content: {
    padding: spacing.lg,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDescription: {
    color: colors.textMuted,
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});
