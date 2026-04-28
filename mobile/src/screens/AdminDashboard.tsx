// ==========================================
// AstroMachine Mobile - Dashboard Admin
// ==========================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
  AccessibilityInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type AppColors, useThemeColors, spacing, borderRadius, fontSize, shadows } from '../theme';
import { Product } from '../types';
import { getProducts, deleteProduct } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/format';
import { showConfirm, showMessage } from '../utils/dialog';

interface AdminDashboardProps {
  onNavigateToForm: (product?: Product) => void;
  onNavigateToAccessibility: () => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  onNavigateToForm,
  onNavigateToAccessibility,
  onLogout,
}: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isLargeFont = useAuthStore((s) => s.isLargeFont);
  const themeColors = useThemeColors();
  const styles = createStyles(themeColors);

  const fs = isLargeFont
    ? { xs: 15, sm: 17, md: 19, lg: 22, xl: 26 }
    : { xs: fontSize.xs, sm: fontSize.sm, md: fontSize.md, lg: fontSize.lg, xl: fontSize.xl };

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (product: Product) => {
    await showConfirm(
      'Excluir Produto',
      `Deseja realmente excluir "${product.name}"?`,
      async () => {
        try {
          await deleteProduct(product.id);
          setProducts((prev) => prev.filter((p) => p.id !== product.id));
          AccessibilityInfo.announceForAccessibility(`${product.name} excluído`);
        } catch {
          await showMessage('Erro', 'Não foi possível excluir o produto.');
        }
      },
      { confirmText: 'Excluir', cancelText: 'Cancelar', destructive: true }
    );
  };

  const handleLogout = async () => {
    await showConfirm(
      'Sair',
      'Deseja sair da conta de administrador?',
      onLogout,
      { confirmText: 'Sair', cancelText: 'Cancelar', destructive: true }
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View
      style={styles.card}
      accessibilityLabel={`${item.name}, ${formatCurrency(item.price)}`}
    >
      <View style={styles.cardImageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Ionicons name="desktop-outline" size={24} color={themeColors.primary} />
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.cardName, { fontSize: fs.md }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.cardPrice, { fontSize: fs.sm }]}>{formatCurrency(item.price)}</Text>
        <Text style={[styles.cardCategory, { fontSize: fs.xs }]}>{item.category}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onNavigateToForm(item)}
          accessibilityLabel={`Editar ${item.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="create-outline" size={20} color={themeColors.accent} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            void handleDelete(item);
          }}
          accessibilityLabel={`Excluir ${item.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={20} color={themeColors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { fontSize: fs.md }]}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            void handleLogout();
          }}
          accessibilityLabel="Sair"
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: fs.xl }]} numberOfLines={1}>Painel Admin</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={onNavigateToAccessibility}
            accessibilityLabel="Configurações de acessibilidade"
            accessibilityRole="button"
          >
            <Ionicons name="settings-outline" size={24} color={themeColors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onNavigateToForm()}
            accessibilityLabel="Adicionar novo produto"
            accessibilityRole="button"
          >
            <Ionicons name="add" size={24} color={themeColors.textOnPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { fontSize: fs.xl }]}>{products.length}</Text>
          <Text style={[styles.statLabel, { fontSize: fs.xs }]}>Produtos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { fontSize: fs.xl }]}>
            {products.filter((p) => p.inStock).length}
          </Text>
          <Text style={[styles.statLabel, { fontSize: fs.xs }]}>Em Estoque</Text>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadProducts();
            }}
            tintColor={themeColors.primary}
            colors={[themeColors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color={themeColors.textMuted} />
            <Text style={[styles.emptyText, { fontSize: fs.md }]}>Nenhum produto cadastrado</Text>
          </View>
        }
      />
    </View>
  );
}

const createStyles = (themeColors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  logoutButton: {
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
    flex: 1,
    textAlign: 'center',
    color: themeColors.textPrimary,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: themeColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: themeColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.button,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: themeColors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  statValue: {
    color: themeColors.accent,
    fontWeight: '700',
  },
  statLabel: {
    color: themeColors.textMuted,
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: themeColors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: themeColors.border,
    alignItems: 'center',
  },
  cardImageContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.sm,
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
  },
  cardPrice: {
    color: themeColors.accent,
    fontWeight: '500',
  },
  cardCategory: {
    color: themeColors.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themeColors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themeColors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  loadingText: {
    color: themeColors.textSecondary,
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    color: themeColors.textMuted,
  },
});
