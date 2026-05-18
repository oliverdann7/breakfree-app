import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMetrics } from '../../store/slices/metricsSlice';
import WellnessRing from '../../components/features/WellnessRing';
import MetricCard from '../../components/features/MetricCard';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

const TODAY_PLAN = [
  { time: '07:00', title: 'Sabah Yürüyüşü', done: true },
  { time: '12:00', title: 'Beslenme Talk\'ı — Prof. Mert', done: false },
  { time: '19:00', title: 'Akşam Meditasyonu', done: false },
];

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { dailyMetrics, wellnessScore } = useAppSelector((state) => state.metrics);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMetrics());
  }, []);

  const metrics = dailyMetrics
    ? [
        {
          emoji: '😴',
          label: 'Uyku',
          value: `${dailyMetrics.sleep.hours}`,
          unit: 'saat',
          color: colors.royal,
        },
        {
          emoji: '❤️',
          label: 'Kalp Atışı',
          value: `${dailyMetrics.heartRate}`,
          unit: 'bpm',
          color: colors.error,
        },
        {
          emoji: '👟',
          label: 'Adımlar',
          value: `${(dailyMetrics.steps / 1000).toFixed(1)}K`,
          unit: 'adım',
          color: colors.success,
        },
        {
          emoji: '🔥',
          label: 'Kalori',
          value: `${dailyMetrics.calories}`,
          unit: 'kcal',
          color: colors.gold,
        },
      ]
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.name}>{user?.displayName || 'Kullanıcı'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Wellness Ring Card */}
        <Card style={styles.wellnessCard} variant="elevated">
          <View style={styles.wellnessRow}>
            <WellnessRing score={wellnessScore || 0} size={150} />
            <View style={styles.wellnessSide}>
              <Text style={styles.wellnessSideTitle}>Bu Hafta</Text>
              <View style={styles.wellnessStat}>
                <Text style={styles.wellnessStatValue} numberOfLines={1}>
                  +5{' '}
                  <Text style={[styles.wellnessStatSub, { color: colors.success }]}>↑</Text>
                </Text>
                <Text style={styles.wellnessStatLabel}>dünden fazla</Text>
              </View>
              <View style={styles.wellnessDivider} />
              <View style={styles.wellnessStat}>
                <Text style={styles.wellnessStatValue}>{wellnessScore || 0}</Text>
                <Text style={styles.wellnessStatLabel}>haftalık ort.</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Metric Cards */}
        <Text style={styles.sectionTitle}>Günlük Metrikler</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} style={styles.metricCardSize} />
          ))}
        </View>

        {/* Today's Plan */}
        <Text style={styles.sectionTitle}>Bugünkü Plan</Text>
        <Card style={styles.planCard}>
          {TODAY_PLAN.map((item, i) => (
            <View
              key={item.time}
              style={[styles.planItem, i < TODAY_PLAN.length - 1 && styles.planItemBorder]}
            >
              <Text style={styles.planTime}>{item.time}</Text>
              <View style={[styles.planDot, item.done && styles.planDotDone]} />
              <Text style={[styles.planTitle, item.done && styles.planTitleDone]}>
                {item.title}
              </Text>
              {item.done && <Text style={styles.planCheck}>✓</Text>}
            </View>
          ))}
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
        <View style={styles.quickRow}>
          {[
            { emoji: '🎙', label: 'Palestralar', color: colors.royal },
            { emoji: '📊', label: 'Sağlık', color: colors.success },
            { emoji: '👥', label: 'Topluluk', color: colors.gold },
            { emoji: '🧘', label: 'Meditasyon', color: colors.cyan },
          ].map((action) => (
            <TouchableOpacity key={action.label} style={styles.quickBtn} activeOpacity={0.7}>
              <View style={[styles.quickIcon, { backgroundColor: action.color + '20' }]}>
                <Text style={styles.quickEmoji}>{action.emoji}</Text>
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: { fontSize: 14, color: colors.textSecondary },
  name: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: { fontSize: 18 },
  wellnessCard: { marginHorizontal: 20, marginBottom: 8 },
  wellnessRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  wellnessSide: { flex: 1, gap: 12 },
  wellnessSideTitle: { fontSize: 12, color: colors.textTertiary, fontWeight: '600', letterSpacing: 0.5 },
  wellnessStat: { gap: 2 },
  wellnessStatValue: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  wellnessStatSub: { fontSize: 16 },
  wellnessStatLabel: { fontSize: 11, color: colors.textTertiary },
  wellnessDivider: { height: 1, backgroundColor: colors.border },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
  },
  metricCardSize: { width: '47%' },
  planCard: { marginHorizontal: 20, padding: 0, overflow: 'hidden' },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  planItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  planTime: { fontSize: 12, color: colors.textTertiary, width: 44 },
  planDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cyan,
  },
  planDotDone: { backgroundColor: colors.success },
  planTitle: { flex: 1, fontSize: 14, color: colors.textPrimary },
  planTitleDone: { color: colors.textTertiary, textDecorationLine: 'line-through' },
  planCheck: { color: colors.success, fontWeight: '700', fontSize: 15 },
  quickRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  quickBtn: { alignItems: 'center', gap: 6 },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickEmoji: { fontSize: 26 },
  quickLabel: { fontSize: 11, color: colors.textSecondary },
});
