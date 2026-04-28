// ==========================================
// AstroMachine Mobile - Tela de Carrinho
// ==========================================

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  AccessibilityInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AppColors, useThemeColors, spacing, borderRadius, fontSize, shadows } from '../theme';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/format';
import { CartItem } from '../types';

interface CartScreenProps {
  onNavigateToCheckout: () => void;
  onGoBack: () => void;
}

export default function CartScreen({ onNavigateToCheckout, onGoBack }: CartScreenProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotal = useCartStore((s) => s.getTotal);
  const isLargeFont = useAuthStore((s) => s.isLargeFont);
  const themeColors = useThemeColors();
  const styles = createStyles(themeColors);

  const fs = isLargeFont
    ? { xs: 15, sm: 17, md: 19, lg: 22, xl: 26 }
    : { xs: fontSize.xs, sm: fontSize.sm, md: fontSize.md, lg: fontSize.lg, xl: fontSize.xl };

  const handleRemove = (item: CartItem) => {
    removeItem(item.product.id);
    AccessibilityInfo.announceForAccessibility(`${item.product.name} removido do carrinho`);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View
      style={styles.card}
      accessibilityLabel={`${item.product.name}, quantidade ${item.quantity}, ${formatCurrency(item.product.price * item.quantity)}`}
    >
      <View style={styles.cardImageContainer}>
        {item.product.imageUrl ? (
          <Image source={{ uri: item.product.imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Ionicons name="desktop-outline" size={28} color={themeColors.primary} />
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.cardName, { fontSize: fs.md }]} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={[styles.cardPrice, { fontSize: fs.sm }]}>
          {formatCurrency(item.product.price)}
        </Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
            accessibilityLabel="Diminuir quantidade"
            accessibilityRole="button"
          >
            <Ionicons name="remove" size={18} color={themeColors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.quantityText, { fontSize: fs.md }]}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
            accessibilityLabel="Aumentar quantidade"
            accessibilityRole="button"
          >
            <Ionicons name="add" size={18} color={themeColors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item)}
        accessibilityLabel={`Remover ${item.product.name}`}
        accessibilityRole="button"
      >
        <Ionicons name="trash-outline" size={20} color={themeColors.error} />
      </TouchableOpacity>
    </View>
  );

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
          <Ionicons name="arrow-back" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: fs.xl }]}>Carrinho</Text>
        <View style={{ width: 44 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={64} color={themeColors.textMuted} />
          <Text style={[styles.emptyText, { fontSize: fs.md }]}>Seu carrinho está vazio</Text>
          <Text style={[styles.emptySubtext, { fontSize: fs.sm }]}>
            Explore o catálogo e adicione builds incríveis!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Rodapé */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { fontSize: fs.md }]}>Subtotal</Text>
              <Text style={[styles.totalValue, { fontSize: fs.xl }]}>
                {formatCurrency(getTotal())}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={onNavigateToCheckout}
              accessibilityLabel="Ir para checkout"
              accessibilityRole="button"
            >
              <Text style={[styles.checkoutText, { fontSize: fs.lg }]}>Finalizar Compra</Text>
              <Ionicons name="arrow-forward" size={20} color={themeColors.textOnPrimary} />
            </TouchableOpacity>
          </View>
        </>
      )}
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
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 200,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: themeColors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: themeColors.border,
    alignItems: 'center',
    ...shadows.card,
  },
  cardImageContainer: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: themeColors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    color: themeColors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardPrice: {
    color: themeColors.accent,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: themeColors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  quantityText: {
    color: themeColors.textPrimary,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  emptyText: {
    color: themeColors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    color: themeColors.textMuted,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: themeColors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: themeColors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    color: themeColors.textSecondary,
    fontWeight: '500',
  },
  totalValue: {
    color: themeColors.accent,
    fontWeight: '700',
  },
  checkoutButton: {
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
  checkoutText: {
    color: themeColors.textOnPrimary,
    fontWeight: '700',
  },
});
