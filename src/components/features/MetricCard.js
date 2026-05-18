import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import { colors } from '../../constants/designTokens';

export default function MetricCard({ emoji, label, value, unit, color = colors.cyan, style }) {
  return (
    <Card style={[styles.card, { borderColor: color + '35' }, style]}>
      <View style={[styles.iconBadge, { backgroundColor: color + '18' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    gap: 2,
    padding: 14,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emoji: { fontSize: 18 },
  value: { fontSize: 24, fontWeight: '800', lineHeight: 28 },
  unit: { fontSize: 11, color: colors.textTertiary },
  label: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
