// ==========================================
// AstroMachine Mobile - Tela de Login
// ==========================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  AccessibilityInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type AppColors, useThemeColors, spacing, borderRadius, fontSize } from '../theme';
import { loginSchema, LoginForm } from '../utils/validation';
import { loginAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { showMessage } from '../utils/dialog';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export default function LoginScreen({ onNavigateToRegister }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const isLargeFont = useAuthStore((s) => s.isLargeFont);
  const themeColors = useThemeColors();
  const styles = createStyles(themeColors);

  const fs = isLargeFont
    ? { sm: 17, md: 19, lg: 22, xl: 26, title: 36 }
    : { sm: fontSize.sm, md: fontSize.md, lg: fontSize.lg, xl: fontSize.xl, title: fontSize.title };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await loginAPI(data.email, data.password);
      await setAuth(response.user, response.token);
      AccessibilityInfo.announceForAccessibility('Login realizado com sucesso');
    } catch (error: any) {
      await showMessage('Erro no Login', error.message || 'Não foi possível fazer login.');
      AccessibilityInfo.announceForAccessibility('Erro no login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / Ícone */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="planet" size={48} color={themeColors.primary} />
          </View>
          <Text style={[styles.appName, { fontSize: fs.title }]} accessibilityRole="header">
            AstroMachine
          </Text>
          <Text style={[styles.subtitle, { fontSize: fs.sm }]}>
            Seu PC dos sonhos, feito sob medida
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: fs.sm }]} accessibilityLabel="Campo de email">
              Email
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color={themeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { fontSize: fs.md }]}
                    placeholder="seu@email.com"
                    placeholderTextColor={themeColors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    accessibilityLabel="Digite seu email"
                    accessibilityHint="Campo para digitar o endereço de email"
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text style={[styles.errorText, { fontSize: fs.sm }]} accessibilityRole="alert">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: fs.sm }]} accessibilityLabel="Campo de senha">
              Senha
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color={themeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { fontSize: fs.md }]}
                    placeholder="••••••"
                    placeholderTextColor={themeColors.textMuted}
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    accessibilityLabel="Digite sua senha"
                    accessibilityHint="Campo para digitar a senha"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={themeColors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text style={[styles.errorText, { fontSize: fs.sm }]} accessibilityRole="alert">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Esqueci a senha */}
          <TouchableOpacity
            style={styles.forgotPassword}
            accessibilityLabel="Esqueci minha senha"
            accessibilityRole="link"
          >
            <Text style={[styles.forgotPasswordText, { fontSize: fs.sm }]}>
              Esqueci minha senha
            </Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            accessibilityLabel="Entrar na conta"
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading }}
          >
            {isLoading ? (
              <ActivityIndicator color={themeColors.textOnPrimary} />
            ) : (
              <Text style={[styles.buttonText, { fontSize: fs.lg }]}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Link para Cadastro */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={onNavigateToRegister}
            accessibilityLabel="Criar uma conta nova"
            accessibilityRole="link"
          >
            <Text style={[styles.registerText, { fontSize: fs.sm }]}>
              Não tem conta?{' '}
              <Text style={styles.registerTextBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Credenciais de demo */}
        <View style={styles.demoBox} accessibilityLabel="Credenciais de demonstração">
          <Text style={[styles.demoTitle, { fontSize: fs.sm }]}>Demo</Text>
          <Text style={[styles.demoText, { fontSize: fs.sm }]}>
            Admin: admin@astromachine.com / admin123
          </Text>
          <Text style={[styles.demoText, { fontSize: fs.sm }]}>
            Cliente: guilherme@email.com / cliente123
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (themeColors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: themeColors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: themeColors.primary,
  },
  appName: {
    color: themeColors.textPrimary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    color: themeColors.textSecondary,
    marginTop: spacing.xs,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    color: themeColors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: themeColors.border,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  inputError: {
    borderColor: themeColors.error,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: themeColors.textPrimary,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: themeColors.error,
    marginTop: spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    padding: spacing.xs,
  },
  forgotPasswordText: {
    color: themeColors.accent,
  },
  button: {
    backgroundColor: themeColors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: themeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: themeColors.textOnPrimary,
    fontWeight: '700',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  registerText: {
    color: themeColors.textSecondary,
  },
  registerTextBold: {
    color: themeColors.accent,
    fontWeight: '700',
  },
  demoBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: themeColors.surfaceLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: themeColors.border,
    opacity: 0.7,
  },
  demoTitle: {
    color: themeColors.accent,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  demoText: {
    color: themeColors.textMuted,
    marginBottom: 2,
  },
});
