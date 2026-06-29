import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-outline', title, message,
}) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <Ionicons name={icon} size={48} color={Colors.textDim} />
    </View>
    <Text style={styles.title}>{title}</Text>
    {message && <Text style={styles.message}>{message}</Text>}
  </View>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong.', onRetry,
}) => (
  <View style={styles.container}>
    <View style={[styles.iconWrap, { backgroundColor: Colors.errorBg }]}>
      <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
    </View>
    <Text style={styles.title}>Error</Text>
    <Text style={styles.message}>{message}</Text>
    {onRetry && (
      <Text style={styles.retry} onPress={onRetry}>Tap to retry</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconWrap: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.surface2,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: { ...Typography.h3, color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  message: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
  retry: { ...Typography.body, color: Colors.primary, marginTop: Spacing.md },
});
