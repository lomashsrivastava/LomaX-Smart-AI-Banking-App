import React from 'react';
import {
  TextInput, View, Text, StyleSheet, TextInputProps,
  TouchableOpacity, ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '@/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label, error, leftIcon, rightIcon, onRightIconPress,
  containerStyle, hint, style, ...props
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, error ? styles.errorBorder : styles.normalBorder]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={error ? Colors.error : Colors.textMuted}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor={Colors.textDim}
          selectionColor={Colors.primary}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons name={rightIcon} size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.xs },
  label: { ...Typography.label, color: Colors.textMuted, textTransform: 'uppercase' },
  container: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  normalBorder: { borderColor: Colors.border },
  errorBorder: { borderColor: Colors.error },
  leftIcon: { marginRight: Spacing.sm },
  rightIcon: { padding: Spacing.xs },
  input: {
    flex: 1, color: Colors.text, paddingVertical: 14,
    ...Typography.body,
  },
  error: { ...Typography.caption, color: Colors.error },
  hint: { ...Typography.caption, color: Colors.textDim },
});
