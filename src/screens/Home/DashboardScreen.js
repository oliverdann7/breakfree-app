import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMetrics } from '../../store/slices/metricsSlice';
import { fetchUserProfile } from '../../store/slices/userSlice';
import WellnessRing from '../../components/features/WellnessRing';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

const { width } = Dimensions.get('window');

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

const GOAL_TASKS = {
  sleep: { title: 'Uyku Takibi', icon: '😴', duration: '5dk', accent: false },
  fitness: { title: '30dk Antrenman', icon: '💪', duration: '30dk', accent: false },
  mindfulness: { title: 'Meditasyon', icon: '🧘', duration: '10dk', accent: false },
  nutrition: { title: 'Su İçmeyi Takip Et', icon: '💧', duration: '1dk', accent: false },
  community: { title: 'Gönderi Paylaş', icon: '🤝', duration: '5dk', accent: false },
  stress: { title: 'Nefes Egzersizi', icon: '🌿', duration: '5dk', accent: false },
};

function todayLabel() {
  const d = new Date();
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const months = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { wellnessScore, dailyMetrics } = useAppSelector((state) => state.metrics);
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchMetrics(user.uid));
      if (!profile) dispatch(fetchUserProfile(user.uid));
    }
  }, [user?.uid]);

  const goals = profile?.goals || user?.goals || [];
  const todayPlan =
    goals.length > 0
      ? goals.map((g) => GOAL_TASKS[g]).filter(Boolean)
      : [
          GOAL_TASKS.mindfulness,
          GOAL_TASKS.fitness,
          { title: 'Wellness Palestrası', icon: '🎙', duration: '30dk', accent: true },
        ];

  const dm = dailyMetrics;
  const metrics = [
    {
      emoji: '😴',
      label: 'Uyku',
      value: dm?.sleep?.hours ? `${dm.sleep.hours}s` : '—',
      sub: dm?.sleep?.quality || 'Kayıt yok',
      color: colors.cyan,
    },
    {
      emoji: '❤️',
      label: 'Nabız',
      value: dm?.heartRate ? String(dm.heartRate) : '—',
      sub: 'Dinlenme',
      color: colors.gold,
    },
    {
      emoji: '👟',
      label: 'Adım',
      value: dm?.steps ? `${(dm.steps / 1000).toFixed(1)}k` : '—',
      sub: dm?.steps
        ? `Hedef %${Math.min(100, Math.round((dm.steps / 10000) * 100))}`
        : 'Kayıt yok',
      color: colors.cyan,
    },
    {
      emoji: '🔥',
      label: 'Kalori',
      value: dm?.calories ? dm.calories.toLocaleString() : '—',
      sub: 'Aktif',
      color: colors.gold,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{todayLabel()}</Text>
            <Text style={styles.greeting}>
              {greeting()}, <Text style={styles.name}>{user?.displayName || 'Elif'}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Wellness Ring Card */}
        <Card style={styles.wellnessCard}>
          <View style={styles.wellnessRow}>
            <View style={styles.ringContainer}>
              <WellnessRing score={wellnessScore || 76} size={70} />
            </View>
            <View style={styles.wellnessSide}>
              <Text style={styles.wellnessSideLabel}>Wellness skorun</Text>
              <Text style={styles.wellnessSideTitle}>
                Bugün <Text style={styles.wellnessSideAccent}>hazırsın.</Text>
              </Text>
            </View>
          </View>
        </Card>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map((m) => (
            <Card
              key={m.label}
              style={[
                styles.metricCard,
                {
                  borderLeftWidth: 3,
                  borderLeftColor: m.color,
                  backgroundColor: 'rgba(20, 184, 212, 0.06)',
                },
                m.color === '#C9961A' && { backgroundColor: 'rgba(201, 150, 26, 0.06)' },
              ]}
            >
              <Text style={{ fontSize: 14, color: m.color }}>●</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricSub}>{m.sub}</Text>
            </Card>
          ))}
        </View>

        {/* Today's Plan */}
        <View style={styles.planSectionWrapper}>
          <View style={styles.planSection}>
            <View style={styles.planHeader}>
              <Text style={styles.sectionTitle}>Bugünkü plan</Text>
              <Text style={styles.planArrow}>→</Text>
            </View>
            <View style={styles.planList}>
              {todayPlan.map((item, i) => (
                <View key={item.title + i}>
                  <View style={[styles.planItem, item.accent && styles.planItemAccent]}>
                    <View style={[styles.planIconBox, item.accent && styles.planIconBoxAccent]}>
                      {item.done ? (
                        <Text style={styles.planCheck}>✓</Text>
                      ) : (
                        <Text style={styles.planEmoji}>{item.icon}</Text>
                      )}
                    </View>
                    <View style={styles.planContent}>
                      <Text style={[styles.planTitle, item.done && styles.planTitleDone]}>
                        {item.title}
                      </Text>
                      <Text style={styles.planTime}>
                        {item.time} · {item.duration}
                      </Text>
                    </View>
                    {item.accent && (
                      <View style={styles.planLiveTag}>
                        <Text style={styles.planLiveText}>Canlı</Text>
                      </View>
                    )}
                  </View>
                  {i < todayPlan.length - 1 && <View style={styles.planDivider} />}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  date: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: '300',
  },
  name: {
    fontWeight: '600',
    color: colors.gold,
  },
  notifBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 16,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  wellnessCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(230,181,48,0.2)',
    backgroundColor: 'rgba(230,181,48,0.08)',
  },
  wellnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellnessSide: {
    flex: 1,
    gap: 4,
  },
  wellnessSideLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  wellnessSideTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '300',
  },
  wellnessSideAccent: {
    color: colors.gold,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 56) / 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '300',
    color: colors.textPrimary,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '600',
  },
  metricSub: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
  },
  planSectionWrapper: {
    backgroundColor: 'rgba(20, 184, 212, 0.03)',
    paddingTop: 20,
    paddingBottom: 24,
  },
  planSection: {
    paddingHorizontal: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  planArrow: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  planList: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  planItemAccent: {
    borderColor: 'rgba(230,181,48,0.3)',
    backgroundColor: 'rgba(230,181,48,0.05)',
  },
  planIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planIconBoxAccent: {
    backgroundColor: colors.gold,
  },
  planEmoji: {
    fontSize: 18,
  },
  planCheck: {
    fontSize: 16,
    color: colors.cyan,
    fontWeight: '700',
  },
  planContent: {
    flex: 1,
    gap: 2,
  },
  planTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  planTitleDone: {
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'line-through',
  },
  planTime: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
  },
  planLiveTag: {
    backgroundColor: colors.gold,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  planLiveText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#0A2540',
  },
  planDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
