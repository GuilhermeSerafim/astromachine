// ==========================================
// AstroMachine Mobile - Tela de Catálogo / Vitrine
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
import { getProducts, isAPIAvailable } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/format';

interface CatalogScreenProps {
  onNavigateToDetail: (product: Product) => void;
  onNavigateToAccessibility: () => void;
}

export default function CatalogScreen({ onNavigateToDetail, onNavigateToAccessibility }: CatalogScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isLargeFont = useAuthStore((s) => s.isLargeFont);
  const user = useAuthStore((s) => s.user);
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

  const handleAddToCart = (product: Product) => {
    addItem(product);
    AccessibilityInfo.announceForAccessibility(`${product.name} adicionado ao carrinho`);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onNavigateToDetail(item)}
      accessibilityLabel={`${item.name}, ${formatCurrency(item.price)}`}
      accessibilityHint="Toque para ver detalhes"
      accessibilityRole="button"
    >
      <View style={styles.cardImageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Ionicons name="desktop-outline" size={32} color={themeColors.primary} />
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardName, { fontSize: fs.md }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.cardDescription, { fontSize: fs.xs }]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.cardPrice, { fontSize: fs.lg }]}>{formatCurrency(item.price)}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToCart(item)}
        accessibilityLabel={`Adicionar ${item.name} ao carrinho`}
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="add" size={24} color={themeColors.textOnPrimary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { fontSize: fs.md }]}>Carregando catálogo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { fontSize: fs.sm }]}>
            Olá, {user?.name?.split(' ')[0] || 'Astronauta'} 🚀
          </Text>
          <Text style={[styles.headerTitle, { fontSize: fs.xl }]}>Catálogo</Text>
        </View>
        <TouchableOpacity
          style={styles.accessibilityButton}
          onPress={onNavigateToAccessibility}
          accessibilityLabel="Configurações de acessibilidade"
          accessibilityRole="button"
        >
          <Ionicons name="settings-outline" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* API Status */}
      {!isAPIAvailable() && (
        <View style={styles.offlineBanner} accessibilityRole="alert">
          <Ionicons name="cloud-offline-outline" size={16} color={themeColors.warning} />
          <Text style={[styles.offlineText, { fontSize: fs.xs }]}>
            Modo offline — dados locais
          </Text>
        </View>
      )}

      {/* Lista */}
      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="planet-outline" size={64} color={themeColors.textMuted} />
          <Text style={[styles.emptyText, { fontSize: fs.md }]}>Nenhum produto encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={themeColors.primary}
              colors={[themeColors.primary]}
            />
          }
        />
      )}
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
  },
  greeting: {
    color: themeColors.textSecondary,
  },
  headerTitle: {
    color: themeColors.textPrimary,
    fontWeight: '700',
  },
  accessibilityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: themeColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  offlineText: {
    color: themeColors.warning,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: themeColors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: themeColors.border,
    alignItems: 'center',
    ...shadows.card,
  },
  cardImageContainer: {
    width: 80,
    height: 80,
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
    marginRight: spacing.sm,
  },
  cardName: {
    color: themeColors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardDescription: {
    color: themeColors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  cardPrice: {
    color: themeColors.accent,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themeColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.button,
  },
  loadingText: {
    color: themeColors.textSecondary,
    marginTop: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: {
    color: themeColors.textMuted,
  },
});
