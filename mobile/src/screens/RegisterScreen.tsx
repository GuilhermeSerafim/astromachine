// ==========================================
// AstroMachine Mobile - Tela de Cadastro
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
import { registerSchema, RegisterForm } from '../utils/validation';
import { registerAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { showMessage } from '../utils/dialog';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
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
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await registerAPI(data.name, data.email, data.password);
      await setAuth(response.user, response.token);
      AccessibilityInfo.announceForAccessibility('Cadastro realizado com sucesso');
    } catch (error: any) {
      await showMessage('Erro no Cadastro', error.message || 'Não foi possível criar a conta.');
      AccessibilityInfo.announceForAccessibility('Erro no cadastro');
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="person-add" size={36} color={themeColors.primary} />
          </View>
          <Text style={[styles.title, { fontSize: fs.xl }]} accessibilityRole="header">
            Criar Conta
          </Text>
          <Text style={[styles.subtitle, { fontSize: fs.sm }]}>
            Junte-se ao universo AstroMachine
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: fs.sm }]}>Nome completo</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color={themeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { fontSize: fs.md }]}
                    placeholder="Seu nome"
                    placeholderTextColor={themeColors.textMuted}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    accessibilityLabel="Digite seu nome completo"
                  />
                </View>
              )}
            />
            {errors.name && (
              <Text style={[styles.errorText, { fontSize: fs.sm }]} accessibilityRole="alert">
                {errors.name.message}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: fs.sm }]}>Email</Text>
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
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    accessibilityLabel="Digite seu email"
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
            <Text style={[styles.label, { fontSize: fs.sm }]}>Senha</Text>
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
                    accessibilityLabel="Digite uma senha"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
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

          {/* Confirmação de Senha */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: fs.sm }]}>Confirmar senha</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={themeColors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { fontSize: fs.md }]}
                    placeholder="••••••"
                    placeholderTextColor={themeColors.textMuted}
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    accessibilityLabel="Confirme sua senha"
                  />
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text style={[styles.errorText, { fontSize: fs.sm }]} accessibilityRole="alert">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            accessibilityLabel="Criar conta"
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color={themeColors.textOnPrimary} />
            ) : (
              <Text style={[styles.buttonText, { fontSize: fs.lg }]}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          {/* Link para Login */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={onNavigateToLogin}
            accessibilityLabel="Voltar para a tela de login"
            accessibilityRole="link"
          >
            <Text style={[styles.loginText, { fontSize: fs.sm }]}>
              Já tem conta?{' '}
              <Text style={styles.loginTextBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: themeColors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: themeColors.primary,
  },
  title: {
    color: themeColors.textPrimary,
    fontWeight: '700',
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
  button: {
    backgroundColor: themeColors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginTop: spacing.md,
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
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  loginText: {
    color: themeColors.textSecondary,
  },
  loginTextBold: {
    color: themeColors.accent,
    fontWeight: '700',
  },
});
