// ==========================================
// AstroMachine Mobile - Tela de Checkout
// ==========================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  AccessibilityInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type AppColors, useThemeColors, spacing, borderRadius, fontSize, shadows } from '../theme';
import { checkoutSchema, CheckoutForm } from '../utils/validation';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { simulateCheckout } from '../services/api';
import { formatCurrency } from '../utils/format';
import { showMessage } from '../utils/dialog';

interface CheckoutScreenProps {
  onGoBack: () => void;
  onOrderComplete: () => void;
}

export default function CheckoutScreen({ onGoBack, onOrderComplete }: CheckoutScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'pix'>('credit');
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const isLargeFont = useAuthStore((s) => s.isLargeFont);
  const themeColors = useThemeColors();
  const styles = createStyles(themeColors);

  const fs = isLargeFont
    ? { xs: 15, sm: 17, md: 19, lg: 22, xl: 26 }
    : { xs: fontSize.xs, sm: fontSize.sm, md: fontSize.md, lg: fontSize.lg, xl: fontSize.xl };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { cardName: '', cardNumber: '', expiry: '', cvv: '' },
  });

  const onSubmit = async (data: CheckoutForm) => {
    setIsLoading(true);
    try {
      await simulateCheckout(
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        paymentMethod,
        data.cardNumber.slice(-4)
      );
      clearCart();
      AccessibilityInfo.announceForAccessibility('Pedido confirmado com sucesso');
      await showMessage(
        '🚀 Pedido Confirmado!',
        'Seu pedido foi recebido com sucesso. A AstroMachine começará a preparar seu PC estelar!',
        onOrderComplete
      );
    } catch (error: any) {
      await showMessage('Erro', error.message || 'Não foi possível processar o pedido.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={[styles.headerTitle, { fontSize: fs.xl }]}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumo do pedido */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fs.md }]}>Resumo do Pedido</Text>
          {items.map((item) => (
            <View key={item.product.id} style={styles.summaryRow}>
              <View style={styles.summaryItemInfo}>
                <Ionicons name="checkmark-circle" size={18} color={themeColors.success} />
                <Text style={[styles.summaryItemName, { fontSize: fs.sm }]} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={[styles.summaryItemQty, { fontSize: fs.xs }]}>x{item.quantity}</Text>
              </View>
              <Text style={[styles.summaryItemPrice, { fontSize: fs.sm }]}>
                {formatCurrency(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { fontSize: fs.lg }]}>Total</Text>
            <Text style={[styles.totalValue, { fontSize: fs.xl }]}>
              {formatCurrency(getTotal())}
            </Text>
          </View>
        </View>

        {/* Método de pagamento */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fs.md }]}>Método de Pagamento</Text>
          <View style={styles.paymentMethods}>
            {[
              { key: 'credit', label: 'Crédito', icon: 'card' as const },
              { key: 'debit', label: 'Débito', icon: 'card-outline' as const },
              { key: 'pix', label: 'PIX', icon: 'qr-code' as const },
            ].map((method) => (
              <TouchableOpacity
                key={method.key}
                style={[
                  styles.paymentOption,
                  paymentMethod === method.key && styles.paymentOptionActive,
                ]}
                onPress={() => setPaymentMethod(method.key as any)}
                accessibilityLabel={`Pagar com ${method.label}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: paymentMethod === method.key }}
              >
                <Ionicons
                  name={method.icon}
                  size={22}
                  color={paymentMethod === method.key ? themeColors.primary : themeColors.textMuted}
                />
                <Text
                  style={[
                    styles.paymentLabel,
                    { fontSize: fs.sm },
                    paymentMethod === method.key && styles.paymentLabelActive,
                  ]}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Formulário de cartão */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fs.md }]}>Dados do Cartão (Simulação)</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: fs.sm }]}>Nome no cartão</Text>
            <Controller
              control={control}
              name="cardName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { fontSize: fs.md }, errors.cardName && styles.inputError]}
                  placeholder="Nome completo"
                  placeholderTextColor={themeColors.textMuted}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  accessibilityLabel="Nome no cartão"
                />
              )}
            />
            {errors.cardName && (
              <Text style={[styles.errorText, { fontSize: fs.xs }]} accessibilityRole="alert">
                {errors.cardName.message}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: fs.sm }]}>Número do cartão</Text>
            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { fontSize: fs.md }, errors.cardNumber && styles.inputError]}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor={themeColors.textMuted}
                  keyboardType="numeric"
                  maxLength={19}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  accessibilityLabel="Número do cartão"
                />
              )}
            />
            {errors.cardNumber && (
              <Text style={[styles.errorText, { fontSize: fs.xs }]} accessibilityRole="alert">
                {errors.cardNumber.message}
              </Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
              <Text style={[styles.label, { fontSize: fs.sm }]}>Validade</Text>
              <Controller
                control={control}
                name="expiry"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, { fontSize: fs.md }, errors.expiry && styles.inputError]}
                    placeholder="MM/AA"
                    placeholderTextColor={themeColors.textMuted}
                    maxLength={5}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    accessibilityLabel="Validade do cartão"
                  />
                )}
              />
              {errors.expiry && (
                <Text style={[styles.errorText, { fontSize: fs.xs }]} accessibilityRole="alert">
                  {errors.expiry.message}
                </Text>
              )}
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { fontSize: fs.sm }]}>CVV</Text>
              <Controller
                control={control}
                name="cvv"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, { fontSize: fs.md }, errors.cvv && styles.inputError]}
                    placeholder="123"
                    placeholderTextColor={themeColors.textMuted}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    accessibilityLabel="CVV do cartão"
                  />
                )}
              />
              {errors.cvv && (
                <Text style={[styles.errorText, { fontSize: fs.xs }]} accessibilityRole="alert">
                  {errors.cvv.message}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Botão confirmar */}
        <TouchableOpacity
          style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          accessibilityLabel="Confirmar pedido"
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={themeColors.textOnPrimary} />
          ) : (
            <>
              <Ionicons name="rocket" size={20} color={themeColors.textOnPrimary} />
              <Text style={[styles.confirmText, { fontSize: fs.lg }]}>Confirmar Pedido</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { fontSize: fs.xs }]}>
          ⚠️ Esta é uma simulação acadêmica. Nenhum pagamento real será processado.
        </Text>
      </ScrollView>
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
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    backgroundColor: themeColors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  sectionTitle: {
    color: themeColors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  summaryItemName: {
    color: themeColors.textSecondary,
    flex: 1,
  },
  summaryItemQty: {
    color: themeColors.textMuted,
    marginRight: spacing.sm,
  },
  summaryItemPrice: {
    color: themeColors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: themeColors.border,
    marginVertical: spacing.md,
  },
  totalLabel: {
    color: themeColors.textPrimary,
    fontWeight: '600',
  },
  totalValue: {
    color: themeColors.accent,
    fontWeight: '700',
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paymentOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: themeColors.surfaceLight,
    borderWidth: 1,
    borderColor: themeColors.border,
    gap: spacing.xs,
  },
  paymentOptionActive: {
    borderColor: themeColors.primary,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
  paymentLabel: {
    color: themeColors.textMuted,
    fontWeight: '500',
  },
  paymentLabelActive: {
    color: themeColors.primary,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    color: themeColors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  input: {
    backgroundColor: themeColors.surfaceLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: themeColors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: themeColors.textPrimary,
    minHeight: 48,
  },
  inputError: {
    borderColor: themeColors.error,
  },
  errorText: {
    color: themeColors.error,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: themeColors.success,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 56,
    ...shadows.button,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  confirmText: {
    color: themeColors.textOnPrimary,
    fontWeight: '700',
  },
  disclaimer: {
    color: themeColors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
