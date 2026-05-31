import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../constants/designTokens';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const variantStyle = styles[variant] || styles.primary;
  const variantTextStyle = textStyles[variant] || textStyles.primary;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, variantStyle, isDisabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.cyan : colors.navy} size="small" />
      ) : (
        <Text style={[styles.text, variantTextStyle, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.cyan,
  },
  secondary: {
    backgroundColor: colors.gold,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.cyan,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

const textStyles = StyleSheet.create({
  primary: { color: colors.navy },
  secondary: { color: colors.navy },
  outline: { color: colors.cyan },
  ghost: { color: colors.textSecondary },
});
