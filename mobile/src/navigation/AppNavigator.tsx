// ==========================================
// AstroMachine Mobile - Navegação Principal
// ==========================================

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, shadows, fontSize } from '../theme';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { selectCartItemCount } from '../store/cartSelectors';
import { Product } from '../types';

// Screens
import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AdminDashboard from '../screens/AdminDashboard';
import AdminFormScreen from '../screens/AdminFormScreen';
import AccessibilityScreen from '../screens/AccessibilityScreen';

type Screen =
  | { name: 'catalog' }
  | { name: 'productDetail'; product: Product }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'adminDashboard' }
  | { name: 'adminForm'; product?: Product }
  | { name: 'accessibility' };

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <AppNavigatorContent />
    </SafeAreaProvider>
  );
}

function AppNavigatorContent() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const itemCount = useCartStore(selectCartItemCount);

  const isAdmin = user?.role === 'admin';

  const [currentScreen, setCurrentScreen] = useState<Screen>(
    isAdmin ? { name: 'adminDashboard' } : { name: 'catalog' }
  );
  const [activeTab, setActiveTab] = useState<'home' | 'cart'>(
    isAdmin ? 'home' : 'home'
  );

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleTabPress = (tab: 'home' | 'cart') => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigateTo(isAdmin ? { name: 'adminDashboard' } : { name: 'catalog' });
    } else {
      navigateTo({ name: 'cart' });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'catalog':
        return (
          <CatalogScreen
            onNavigateToDetail={(product) => navigateTo({ name: 'productDetail', product })}
            onNavigateToAccessibility={() => navigateTo({ name: 'accessibility' })}
          />
        );
      case 'productDetail':
        return (
          <ProductDetailScreen
            product={currentScreen.product}
            onGoBack={() => navigateTo({ name: 'catalog' })}
          />
        );
      case 'cart':
        return (
          <CartScreen
            onNavigateToCheckout={() => navigateTo({ name: 'checkout' })}
            onGoBack={() => navigateTo({ name: 'catalog' })}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            onGoBack={() => navigateTo({ name: 'cart' })}
            onOrderComplete={() => {
              setActiveTab('home');
              navigateTo({ name: 'catalog' });
            }}
          />
        );
      case 'adminDashboard':
        return (
          <AdminDashboard
            onNavigateToForm={(product) => navigateTo({ name: 'adminForm', product })}
            onLogout={handleLogout}
          />
        );
      case 'adminForm':
        return (
          <AdminFormScreen
            product={currentScreen.product}
            onGoBack={() => navigateTo({ name: 'adminDashboard' })}
            onSaved={() => navigateTo({ name: 'adminDashboard' })}
          />
        );
      case 'accessibility':
        return (
          <AccessibilityScreen onGoBack={() => navigateTo({ name: 'catalog' })} />
        );
      default:
        return null;
    }
  };

  // Telas que mostram o tab bar
  const showTabBar =
    !isAdmin &&
    ['catalog', 'cart'].includes(currentScreen.name);

  const showAdminNav =
    isAdmin && currentScreen.name === 'adminDashboard';

  return (
    <View style={styles.container}>
      {renderScreen()}

      {/* Tab bar para cliente */}
      {showTabBar && (
        <View
          style={[
            styles.tabBar,
            { paddingBottom: Math.max(insets.bottom + spacing.sm, spacing.md) },
          ]}
          accessibilityRole="tablist"
        >
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => handleTabPress('home')}
            accessibilityLabel="Catálogo"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'home' }}
          >
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={26}
              color={activeTab === 'home' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === 'home' ? colors.primary : colors.textMuted },
              ]}
            >
              Início
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => handleTabPress('cart')}
            accessibilityLabel={`Carrinho, ${itemCount} itens`}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'cart' }}
          >
            <View>
              <Ionicons
                name={activeTab === 'cart' ? 'cart' : 'cart-outline'}
                size={26}
                color={activeTab === 'cart' ? colors.primary : colors.textMuted}
              />
              {itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === 'cart' ? colors.primary : colors.textMuted },
              ]}
            >
              Carrinho
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    minWidth: 64,
    minHeight: 48,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: colors.accentSecondary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
});
