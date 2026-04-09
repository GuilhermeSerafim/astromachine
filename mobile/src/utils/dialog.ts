import { Alert, Platform } from 'react-native';

function buildMessage(title: string, message: string) {
  return message ? `${title}\n\n${message}` : title;
}

export async function showMessage(
  title: string,
  message: string,
  onClose?: () => void | Promise<void>
): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.alert?.(buildMessage(title, message));
    await onClose?.();
    return;
  }

  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: () => {
        void onClose?.();
      },
    },
  ]);
}

export async function showConfirm(
  title: string,
  message: string,
  onConfirm: () => void | Promise<void>,
  options?: {
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
  }
): Promise<void> {
  const confirmText = options?.confirmText ?? 'Confirmar';
  const cancelText = options?.cancelText ?? 'Cancelar';
  const destructive = options?.destructive ?? false;

  if (Platform.OS === 'web') {
    const confirmed = globalThis.confirm?.(buildMessage(title, message)) ?? false;
    if (confirmed) {
      await onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    {
      text: confirmText,
      style: destructive ? 'destructive' : 'default',
      onPress: () => {
        void onConfirm();
      },
    },
  ]);
}
