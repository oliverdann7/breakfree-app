import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import WellnessRing from './WellnessRing';
import { colors } from '../../constants/designTokens';

function Pill({ icon, value, label }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillIcon}>{icon}</Text>
      <Text style={styles.pillValue}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

export default function HealthStatusCard({
  name,
  emoji = '🧘',
  bg = colors.royal,
  wellnessScore = 0,
  steps,
  sleep,
  heartRate,
  calories,
  streak,
  message,
  time,
  compact = false,
}) {
  const scoreColor =
    wellnessScore >= 75 ? colors.success : wellnessScore >= 45 ? colors.cyan : colors.gold;
  const ringSize = compact ? 52 : 68;
  const ringStroke = compact ? 5 : 7;
  const avatarSize = compact ? 36 : 44;

  const pills = [
    steps > 0 && {
      icon: '👟',
      value: steps >= 1000 ? `${(steps / 1000).toFixed(1)}k` : String(steps),
      label: 'Adım',
    },
    sleep > 0 && { icon: '😴', value: `${sleep}s`, label: 'Uyku' },
    heartRate > 0 && { icon: '❤️', value: String(heartRate), label: 'Nabız' },
    calories > 0 && { icon: '🔥', value: String(calories), label: 'kcal' },
    streak > 0 && { icon: '⚡', value: `${streak}g`, label: 'Seri' },
  ].filter(Boolean);

  return (
    <Card style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Avatar emoji={emoji} bg={bg} size={avatarSize} label={name} />
          <View style={styles.nameBlock}>
            <Text style={[styles.name, compact && styles.nameCompact]}>{name}</Text>
            {time ? <Text style={styles.time}>{time}</Text> : null}
          </View>
        </View>
        <View style={{ width: ringSize, height: ringSize }}>
          <WellnessRing
            score={wellnessScore}
            size={ringSize}
            strokeWidth={ringStroke}
            showLabel={false}
          />
          <View style={[StyleSheet.absoluteFill, styles.scoreOverlayWrap]}>
            <Text style={[styles.scoreOverlay, { color: scoreColor, fontSize: compact ? 13 : 17 }]}>
              {wellnessScore}
            </Text>
          </View>
        </View>
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {pills.length > 0 && (
        <View style={styles.pillsRow}>
          {pills.map((p) => (
            <Pill key={p.label} {...p} />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.18)',
    gap: 12,
  },
  cardCompact: { gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  nameBlock: { gap: 2, flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  nameCompact: { fontSize: 13 },
  time: { fontSize: 10, color: colors.textTertiary },
  scoreOverlayWrap: { alignItems: 'center', justifyContent: 'center' },
  scoreOverlay: { fontWeight: '800', lineHeight: 20 },
  message: { fontSize: 13, color: colors.textPrimary, lineHeight: 19, marginTop: -4 },
  pillsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  pillIcon: { fontSize: 13 },
  pillValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginTop: 2 },
  pillLabel: {
    fontSize: 9,
    color: colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
