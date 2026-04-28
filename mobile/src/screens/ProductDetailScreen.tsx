// ==========================================
// AstroMachine Mobile - Tela de Detalhes do Produto
// ==========================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  AccessibilityInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AppColors, useThemeColors, spacing, borderRadius, fontSize, shadows } from '../theme';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/format';

interface ProductDetailScreenProps {
  product: Product;
  onGoBack: () => void;
}

export default function ProductDetailScreen({ product, onGoBack }: ProductDetailScreenProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isLargeFont = useAuthStore((s) => s.isLargeFont);
  const themeColors = useThemeColors();
  const styles = createStyles(themeColors);

  const fs = isLargeFont
    ? { xs: 15, sm: 17, md: 19, lg: 22, xl: 26, xxl: 33 }
    : { xs: fontSize.xs, sm: fontSize.sm, md: fontSize.md, lg: fontSize.lg, xl: fontSize.xl, xxl: fontSize.xxl };

  const handleAdd = () => {
    addItem(product);
    AccessibilityInfo.announceForAccessibility(`${product.name} adicionado ao carrinho`);
  };

  return (
    <View style={styles.container}>
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: fs.lg }]}>Detalhes</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Imagem */}
        <View style={styles.imageContainer}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="desktop-outline" size={64} color={themeColors.primary} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={[styles.category, { fontSize: fs.xs }]}>{product.category.toUpperCase()}</Text>
          <Text style={[styles.name, { fontSize: fs.xxl }]}>{product.name}</Text>
          <Text style={[styles.price, { fontSize: fs.xl }]}>{formatCurrency(product.price)}</Text>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { fontSize: fs.md }]}>Descrição</Text>
          <Text style={[styles.description, { fontSize: fs.sm }]}>{product.description}</Text>

          {product.specs && (
            <>
              <Text style={[styles.sectionTitle, { fontSize: fs.md }]}>Especificações</Text>
              <View style={styles.specsContainer}>
                {product.specs.split('|').map((spec, idx) => (
                  <View key={idx} style={styles.specBadge}>
                    <Text style={[styles.specText, { fontSize: fs.xs }]}>{spec.trim()}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.statusRow}>
            <Ionicons
              name={product.inStock ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={product.inStock ? themeColors.success : themeColors.error}
            />
            <Text
              style={[
                styles.statusText,
                { color: product.inStock ? themeColors.success : themeColors.error, fontSize: fs.sm },
              ]}
            >
              {product.inStock ? 'Em estoque' : 'Indisponível'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão fixo */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAdd}
          accessibilityLabel={`Adicionar ${product.name} ao carrinho`}
          accessibilityRole="button"
        >
          <Ionicons name="cart-outline" size={22} color={themeColors.textOnPrimary} />
          <Text style={[styles.addToCartText, { fontSize: fs.lg }]}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (themeColors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
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
    backgroundColor: themeColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  headerTitle: {
    color: themeColors.textPrimary,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 260,
    backgroundColor: themeColors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColors.surfaceLight,
  },
  infoContainer: {
    padding: spacing.lg,
  },
  category: {
    color: themeColors.primary,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  name: {
    color: themeColors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  price: {
    color: themeColors.accent,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: themeColors.border,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    color: themeColors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  description: {
    color: themeColors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  specsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  specBadge: {
    backgroundColor: themeColors.surfaceLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  specText: {
    color: themeColors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusText: {
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: themeColors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: themeColors.border,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: themeColors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 56,
    ...shadows.button,
  },
  addToCartText: {
    color: themeColors.textOnPrimary,
    fontWeight: '700',
  },
});
