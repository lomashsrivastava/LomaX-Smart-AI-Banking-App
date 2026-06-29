import {
  TouchableOpacity, Text, ActivityIndicator, StyleSheet,
  TouchableOpacityProps, StyleProp, ViewStyle, TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, Typography } from '@/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title, variant = 'primary', size = 'md', loading = false,
  fullWidth = false, style, textStyle, disabled, ...props
}) => {
  const isDisabled = disabled || loading;
  const sizeStyle = sizes[size];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        {...props}
        disabled={isDisabled}
        style={[styles.base, sizeStyle.container, fullWidth && styles.full,
          isDisabled && styles.disabled, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#00D4FF', '#6C63FF']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: Radius.md }]}
        />
        {loading
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={[styles.text, sizeStyle.text, textStyle]}>{title}</Text>}
      </TouchableOpacity>
    );
  }

  const variantStyle = variants[variant];
  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      style={[styles.base, sizeStyle.container, variantStyle.container,
        fullWidth && styles.full, isDisabled && styles.disabled, style]}
      activeOpacity={0.7}
    >
      {loading
        ? <ActivityIndicator color={variantStyle.textColor || Colors.primary} size="small" />
        : <Text style={[styles.text, sizeStyle.text, { color: variantStyle.textColor }, textStyle]}>
            {title}
          </Text>}
    </TouchableOpacity>
  );
};

const sizes = {
  sm: {
    container: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, borderRadius: Radius.sm },
    text: { ...Typography.bodySmall, fontWeight: '600' as const },
  },
  md: {
    container: { paddingVertical: 14, paddingHorizontal: Spacing.lg, borderRadius: Radius.md },
    text: { ...Typography.body, fontWeight: '600' as const },
  },
  lg: {
    container: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.md },
    text: { ...Typography.bodyLarge, fontWeight: '700' as const },
  },
};

const variants: Record<string, { container: ViewStyle; textColor: string }> = {
  secondary: {
    container: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border },
    textColor: Colors.text,
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
    textColor: Colors.primary,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    textColor: Colors.textMuted,
  },
  danger: {
    container: { backgroundColor: Colors.errorBg, borderWidth: 1, borderColor: Colors.error },
    textColor: Colors.error,
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  full: { width: '100%' },
  disabled: { opacity: 0.5 },
  text: { color: Colors.text, fontWeight: '600' },
});
