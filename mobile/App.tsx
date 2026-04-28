// ==========================================
// AstroMachine Mobile - Entry Point (App.tsx)
// ==========================================

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from './src/store/authStore';
import { type AppColors, useThemeColors } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { getDatabase } from './src/db/database';

type AuthScreen = 'login' | 'register';

export default function App() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const loadSession = useAuthStore((s) => s.loadSession);
  const themeColors = useThemeColors();
  const styles = createStyles(themeColors);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    loadSession();
    // Inicializar SQLite
    getDatabase()
      .then(() => setDbReady(true))
      .catch((err) => {
        console.warn('SQLite não disponível, usando dados em memória:', err);
        setDbReady(true);
      });
  }, []);

  if (isLoading || !dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        {authScreen === 'login' ? (
          <LoginScreen onNavigateToRegister={() => setAuthScreen('register')} />
        ) : (
          <RegisterScreen onNavigateToLogin={() => setAuthScreen('login')} />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <AppNavigator />
    </View>
  );
}

const createStyles = (themeColors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: themeColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
