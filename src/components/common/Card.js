import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants/designTokens';

export default function Card({ children, style, variant = 'default' }) {
  return <View style={[styles.base, styles[variant], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.bgSecondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cyanAccent: {
    backgroundColor: 'rgba(20, 184, 212, 0.08)',
    borderLeftWidth: 4,
    borderLeftColor: colors.cyan,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  goldAccent: {
    backgroundColor: 'rgba(201, 150, 26, 0.08)',
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  greenAccent: {
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderLeftWidth: 4,
    borderLeftColor: '#00FF88',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
});
