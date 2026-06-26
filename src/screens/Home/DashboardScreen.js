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
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMetrics } from '../../store/slices/metricsSlice';
import { fetchUserProfile, fetchDailyPlan, completeTask } from '../../store/slices/userSlice';
import WellnessRing from '../../components/features/WellnessRing';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';
import { wellnessLabel } from '../../utils/wellnessScore';
import { topInsight } from '../../utils/wellnessInsights';

const { width } = Dimensions.get('window');

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return 'greeting.morning';
  if (h < 18) return 'greeting.afternoon';
  return 'greeting.evening';
}

function todayLabel(locale) {
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'tr-TR';
  const { wellnessScore, dailyMetrics } = useAppSelector((state) => state.metrics);
  const { user } = useAppSelector((state) => state.auth);
  const { profile, dailyPlan } = useAppSelector((state) => state.user);
  const insight = topInsight(dailyMetrics);

  const handleInsightPress = () => {
    if (!insight) return;
    if (insight.screen) {
      navigation.navigate(insight.tab, { screen: insight.screen, params: insight.params });
    } else {
      navigation.navigate(insight.tab);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchMetrics(user.uid));
      dispatch(fetchDailyPlan(user.uid));
      if (!profile) dispatch(fetchUserProfile(user.uid));
    }
  }, [user?.uid]);

  const todayPlan = dailyPlan?.tasks || [];

  const dm = dailyMetrics;
  const scoreLabel = wellnessScore ? wellnessLabel(wellnessScore) : null;
  const metrics = [
    {
      emoji: '😴',
      label: t('health.metrics.sleep'),
      value: dm?.sleep?.hours ? `${dm.sleep.hours}${t('home.hoursSuffix')}` : '—',
      sub: dm?.sleep?.quality || t('home.noRecord'),
      color: colors.cyan,
    },
    {
      emoji: '❤️',
      label: t('health.metrics.heartRate'),
      value: dm?.heartRate ? String(dm.heartRate) : '—',
      sub: t('home.resting'),
      color: colors.gold,
    },
    {
      emoji: '👟',
      label: t('health.metrics.steps'),
      value: dm?.steps ? `${(dm.steps / 1000).toFixed(1)}k` : '—',
      sub: dm?.steps
        ? t('home.goalPercent', { pct: Math.min(100, Math.round((dm.steps / 10000) * 100)) })
        : t('home.noRecord'),
      color: colors.cyan,
    },
    {
      emoji: '🔥',
      label: t('health.metrics.calories'),
      value: dm?.calories ? dm.calories.toLocaleString(locale) : '—',
      sub: t('home.active'),
      color: colors.gold,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{todayLabel(locale)}</Text>
            <Text style={styles.greeting}>
              {t(greetingKey())}, <Text style={styles.name}>{user?.displayName || 'Elif'}</Text>
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
              <Text style={styles.wellnessSideLabel}>{t('home.wellnessYours')}</Text>
              <Text style={styles.wellnessSideTitle}>
                {t('home.readyPrefix')}{' '}
                <Text style={styles.wellnessSideAccent}>{t('home.readyAccent')}</Text>
              </Text>
              {scoreLabel && (
                <View style={styles.wellnessBadge}>
                  <Text style={styles.wellnessBadgeText}>{scoreLabel}</Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Personalized insight — surfaces the weakest dimension as a CTA */}
        {insight && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleInsightPress}
            accessibilityRole="button"
            accessibilityLabel={`${insight.title}. ${insight.ctaLabel}`}
            style={styles.insightWrapper}
          >
            <Card style={styles.insightCard}>
              <View style={styles.insightRow}>
                <Text style={styles.insightEmoji}>{insight.emoji}</Text>
                <View style={styles.insightBody}>
                  <Text style={styles.insightLabel}>{t('home.insightKicker')}</Text>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightMessage}>{insight.message}</Text>
                  <View style={styles.insightCta}>
                    <Text style={styles.insightCtaText}>{insight.ctaLabel}</Text>
                    <Text style={styles.insightCtaArrow}>→</Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}

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
              <Text style={styles.sectionTitle}>{t('home.todaysPlan')}</Text>
              <Text style={styles.planArrow}>→</Text>
            </View>
            <View style={styles.planList}>
              {todayPlan.map((item, i) => (
                <TouchableOpacity
                  key={item.title + i}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (!item.done) {
                      dispatch(completeTask({ uid: user.uid, taskIndex: i }));
                    }
                  }}
                >
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
                        {item.time
                          ? new Date(item.time).toLocaleTimeString(locale, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}{' '}
                        · {item.duration}
                      </Text>
                    </View>
                    {item.accent && (
                      <View style={styles.planLiveTag}>
                        <Text style={styles.planLiveText}>{t('home.live')}</Text>
                      </View>
                    )}
                  </View>
                  {i < todayPlan.length - 1 && <View style={styles.planDivider} />}
                </TouchableOpacity>
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
  wellnessBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  wellnessBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.3,
  },
  insightWrapper: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  insightCard: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 212, 0.25)',
    backgroundColor: 'rgba(20, 184, 212, 0.07)',
  },
  insightRow: {
    flexDirection: 'row',
    gap: 12,
  },
  insightEmoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  insightBody: {
    flex: 1,
    gap: 2,
  },
  insightLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  insightMessage: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 16,
    marginTop: 4,
  },
  insightCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  insightCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.cyan,
  },
  insightCtaArrow: {
    fontSize: 12,
    color: colors.cyan,
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
