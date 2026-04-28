// ==========================================
// AstroMachine Mobile - Formulário Admin (Criar/Editar Produto)
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
import { type AppColors, useThemeColors, spacing, borderRadius, fontSize } from '../theme';
import { productSchema, ProductForm } from '../utils/validation';
import { Product } from '../types';
import { createProduct, updateProduct } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { showMessage } from '../utils/dialog';

interface AdminFormScreenProps {
  product?: Product;
  onGoBack: () => void;
  onSaved: () => void;
}

export default function AdminFormScreen({ product, onGoBack, onSaved }: AdminFormScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!product;
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
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price?.toString() || '',
      category: product?.category || '',
      specs: product?.specs || '',
    },
  });

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        specs: data.specs || '',
      };

      if (isEditing && product) {
        await updateProduct(product.id, payload);
        AccessibilityInfo.announceForAccessibility('Produto atualizado com sucesso');
        await showMessage('Sucesso', 'Produto atualizado!', onSaved);
      } else {
        await createProduct(payload);
        AccessibilityInfo.announceForAccessibility('Produto criado com sucesso');
        await showMessage('Sucesso', 'Produto criado!', onSaved);
      }
    } catch (error: any) {
      await showMessage('Erro', error.message || 'Não foi possível salvar o produto.');
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
        <Text style={[styles.headerTitle, { fontSize: fs.xl }]}>
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nome */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize: fs.sm }]}>Nome do Produto</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { fontSize: fs.md }, errors.name && styles.inputError]}
                placeholder="Ex: Build Andromeda"
                placeholderTextColor={themeColors.textMuted}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                accessibilityLabel="Nome do produto"
              />
            )}
          />
          {errors.name && (
            <Text style={[styles.errorText, { fontSize: fs.xs }]} accessibilityRole="alert">
              {errors.name.message}
            </Text>
          )}
        </View>

        {/* Descrição */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize: fs.sm }]}>Descrição</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.multiline, { fontSize: fs.md }, errors.description && styles.inputError]}
                placeholder="Descreva o produto..."
                placeholderTextColor={themeColors.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                accessibilityLabel="Descrição do produto"
              />
            )}
          />
          {errors.description && (
            <Text style={[styles.errorText, { fontSize: fs.xs }]} accessibilityRole="alert">
              {errors.description.message}
            </Text>
          )}
        </View>

        {/* Preço */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize: fs.sm }]}>Preço (R$)</Text>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { fontSize: fs.md }, errors.price && styles.inputError]}
                placeholder="9999.90"
                placeholderTextColor={themeColors.textMuted}
                keyboardType="decimal-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                accessibilityLabel="Preço do produto"
              />
            )}
          />
          {errors.price && (
            <Text style={[styles.errorText, { fontSize: fs.xs }]} accessibilityRole="alert">
              {errors.price.message}
            </Text>
          )}
        </View>

        {/* Categoria */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize: fs.sm }]}>Categoria</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { fontSize: fs.md }, errors.category && styles.inputError]}
                placeholder="Ex: high-end, mid-range, entry"
                placeholderTextColor={themeColors.textMuted}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                accessibilityLabel="Categoria do produto"
              />
            )}
          />
          {errors.category && (
            <Text style={[styles.errorText, { fontSize: fs.xs }]} accessibilityRole="alert">
              {errors.category.message}
            </Text>
          )}
        </View>

        {/* Especificações */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontSize: fs.sm }]}>Especificações</Text>
          <Controller
            control={control}
            name="specs"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.multiline, { fontSize: fs.md }]}
                placeholder="Ex: RTX 4070 | Ryzen 7 | 32GB DDR5"
                placeholderTextColor={themeColors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                accessibilityLabel="Especificações do produto"
              />
            )}
          />
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          accessibilityLabel={isEditing ? 'Salvar alterações' : 'Criar produto'}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={themeColors.textOnPrimary} />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color={themeColors.textOnPrimary} />
              <Text style={[styles.saveText, { fontSize: fs.lg }]}>
                {isEditing ? 'Salvar Alterações' : 'Criar Produto'}
              </Text>
            </>
          )}
        </TouchableOpacity>
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
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    color: themeColors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  input: {
    backgroundColor: themeColors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: themeColors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: themeColors.textPrimary,
    minHeight: 52,
  },
  multiline: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: themeColors.error,
  },
  errorText: {
    color: themeColors.error,
    marginTop: spacing.xs,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: themeColors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 56,
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: themeColors.textOnPrimary,
    fontWeight: '700',
  },
});
