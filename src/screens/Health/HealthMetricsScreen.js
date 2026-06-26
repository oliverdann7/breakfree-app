import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMetrics, logMetric } from '../../store/slices/metricsSlice';
import Card from '../../components/common/Card';
import MetricCard from '../../components/features/MetricCard';
import { colors } from '../../constants/designTokens';
import { scoreDailyEntry } from '../../utils/wellnessScore';

// Mood ratings are fixed numeric values; labels are resolved via t() at render time.
const MOOD_OPTIONS = [
  { emoji: '😞', rating: 2, labelKey: 'health.moodVeryBad' },
  { emoji: '🙁', rating: 4, labelKey: 'health.moodBad' },
  { emoji: '😐', rating: 6, labelKey: 'health.moodOk' },
  { emoji: '🙂', rating: 8, labelKey: 'health.moodGood' },
  { emoji: '😄', rating: 10, labelKey: 'health.moodGreat' },
];
const ML_PER_CUP = 250;

export default function HealthMetricsScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { dailyMetrics, weeklyData, wellnessScore } = useAppSelector((state) => state.metrics);
  const { user } = useAppSelector((state) => state.auth);

  const [logVisible, setLogVisible] = useState(false);
  const [sleepHours, setSleepHours] = useState('');
  const [steps, setSteps] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [calories, setCalories] = useState('');
  const [hydrationCups, setHydrationCups] = useState('');
  const [mood, setMood] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.uid) dispatch(fetchMetrics(user.uid));
  }, [user?.uid]);

  const handleLog = async () => {
    if (!user?.uid) {
      Alert.alert(t('common.error'), t('health.loginRequired'));
      return;
    }
    setSaving(true);
    try {
      const sh = parseFloat(sleepHours);
      const st = parseInt(steps, 10);
      const hr = parseInt(heartRate, 10);
      const cal = parseInt(calories, 10);
      const cups = parseFloat(hydrationCups);
      const data = {};
      if (!isNaN(sh) && sh > 0)
        data.sleep = {
          hours: sh,
          quality:
            sh >= 7
              ? t('health.sleepGood')
              : sh >= 5
                ? t('health.sleepFair')
                : t('health.sleepPoor'),
        };
      if (!isNaN(st) && st > 0) data.steps = st;
      if (!isNaN(hr) && hr > 0) data.heartRate = hr;
      if (!isNaN(cal) && cal > 0) data.calories = cal;
      if (!isNaN(cups) && cups > 0) data.hydration = Math.round(cups * ML_PER_CUP);
      if (mood != null) data.mood = mood;
      if (Object.keys(data).length === 0) {
        Alert.alert(t('common.error'), t('health.enterAtLeastOne'));
        return;
      }

      // Score the full day: combine today's entry with anything already logged,
      // using the canonical weighted algorithm (sleep/activity/HR/hydration/mood).
      data.wellnessScore = scoreDailyEntry(data, dm || {}) ?? wellnessScore;

      await dispatch(logMetric({ uid: user.uid, data })).unwrap();
      setSleepHours('');
      setSteps('');
      setHeartRate('');
      setCalories('');
      setHydrationCups('');
      setMood(null);
      setLogVisible(false);
    } catch (e) {
      Alert.alert(t('common.error'), e.message || t('health.recordFailed'));
    } finally {
      setSaving(false);
    }
  };

  const dm = dailyMetrics;
  const score = wellnessScore || 0;
  const weekAvg =
    weeklyData.length > 0
      ? Math.round(weeklyData.reduce((s, d) => s + (d.wellnessScore || 0), 0) / weeklyData.length)
      : 0;

  const moodFace = dm?.mood != null ? MOOD_OPTIONS.find((m) => m.rating >= dm.mood) : null;
  const noRecord = t('health.noRecord');
  const breakdown = [
    {
      emoji: '😴',
      label: t('health.sleepQuality'),
      value: dm?.sleep?.hours ? Math.min(100, Math.round((dm.sleep.hours / 8) * 100)) : null,
      color: colors.cyan,
      sub: dm?.sleep
        ? `${dm.sleep.quality} · ${dm.sleep.hours}${t('health.sleepGoodHours')}`
        : noRecord,
    },
    {
      emoji: '👟',
      label: t('health.movement'),
      value: dm?.steps ? Math.min(100, Math.round((dm.steps / 10000) * 100)) : null,
      color: colors.gold,
      sub: dm?.steps ? `${(dm.steps / 1000).toFixed(1)}${t('health.stepsK')}` : noRecord,
    },
    {
      emoji: '❤️',
      label: t('health.heartRate'),
      value: dm?.heartRate ? Math.min(100, Math.round(((200 - dm.heartRate) / 120) * 100)) : null,
      color: colors.royal,
      sub: dm?.heartRate ? `${dm.heartRate} ${t('health.bpmResting')}` : noRecord,
    },
    {
      emoji: '💧',
      label: t('health.water'),
      value: dm?.hydration ? Math.min(100, Math.round((dm.hydration / 2000) * 100)) : null,
      color: colors.cyan,
      sub: dm?.hydration
        ? `${(dm.hydration / ML_PER_CUP).toFixed(0)} ${t('health.cups')}`
        : noRecord,
    },
    {
      emoji: moodFace?.emoji || '🙂',
      label: t('health.mood'),
      value: dm?.mood != null ? Math.min(100, dm.mood * 10) : null,
      color: colors.gold,
      sub: moodFace ? t(moodFace.labelKey) : noRecord,
    },
    {
      emoji: '🔥',
      label: t('health.kcalLabel'),
      value: dm?.calories ? Math.min(100, Math.round((dm.calories / 2500) * 100)) : null,
      color: colors.gold,
      sub: dm?.calories ? `${dm.calories.toLocaleString()} ${t('health.kcalLabel')}` : noRecord,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>{t('health.detailedAnalysis')}</Text>
            <Text style={styles.headerTitle}>{t('health.myHealthData')}</Text>
          </View>
          <TouchableOpacity style={styles.logBtn} onPress={() => setLogVisible(true)}>
            <Text style={styles.logBtnText}>{t('health.addRecord')}</Text>
          </TouchableOpacity>
        </View>

        {/* Big Score Card */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartLabel}>{t('health.wellnessScore')}</Text>
              <View style={styles.chartValue}>
                <Text style={styles.chartBigValue}>{score || '—'}</Text>
                {weekAvg > 0 && score > 0 && (
                  <Text style={[styles.chartTrend, score >= weekAvg ? {} : { color: colors.gold }]}>
                    {score >= weekAvg ? '↑' : '↓'} {Math.abs(score - weekAvg)}%
                  </Text>
                )}
              </View>
            </View>
            {weekAvg > 0 && (
              <View style={styles.chartAverage}>
                <Text style={styles.chartAvgLabel}>{t('health.weeklyAvg')}</Text>
                <Text style={styles.chartAvgValue}>{weekAvg}</Text>
              </View>
            )}
          </View>

          {/* Weekly bar chart */}
          {weeklyData.length > 0 ? (
            <View style={styles.barChart}>
              {weeklyData.map((d, i) => (
                <View key={i} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${d.wellnessScore || 0}%`, backgroundColor: colors.cyan },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{d.date?.slice(5)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>{t('health.noData')}</Text>
            </View>
          )}
        </Card>

        {/* Breakdown */}
        <View style={styles.breakdownWrapper}>
          <View style={styles.breakdown}>
            {breakdown.map((metric, i) => (
              <MetricCard
                key={i}
                emoji={metric.emoji}
                label={metric.label}
                value={metric.value ?? '—'}
                unit="puan"
                color={metric.color}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Log Metrics Modal */}
      <Modal visible={logVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalSheet}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('health.saveToday')}</Text>

            <View style={styles.logField}>
              <Text style={styles.logFieldLabel}>{t('health.moodQuestion')}</Text>
              <View style={styles.moodRow}>
                {MOOD_OPTIONS.map((m) => {
                  const active = mood === m.rating;
                  return (
                    <TouchableOpacity
                      key={m.rating}
                      style={[styles.moodOption, active && styles.moodOptionActive]}
                      onPress={() => setMood(active ? null : m.rating)}
                      accessibilityRole="button"
                      accessibilityLabel={t(m.labelKey)}
                      accessibilityState={{ selected: active }}
                    >
                      <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {[
              {
                label: t('health.sleepHoursLabel'),
                value: sleepHours,
                set: setSleepHours,
                placeholder: t('health.phSleep'),
              },
              {
                label: t('health.stepsLabel'),
                value: steps,
                set: setSteps,
                placeholder: t('health.phSteps'),
              },
              {
                label: t('health.heartRateLabel'),
                value: heartRate,
                set: setHeartRate,
                placeholder: t('health.phHr'),
              },
              {
                label: t('health.caloriesLabel'),
                value: calories,
                set: setCalories,
                placeholder: t('health.phCal'),
              },
              {
                label: t('health.waterLabel'),
                value: hydrationCups,
                set: setHydrationCups,
                placeholder: t('health.phWater'),
              },
            ].map(({ label, value, set, placeholder }) => (
              <View key={label} style={styles.logField}>
                <Text style={styles.logFieldLabel}>{label}</Text>
                <TextInput
                  style={styles.logFieldInput}
                  value={value}
                  onChangeText={set}
                  placeholder={placeholder}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="decimal-pad"
                />
              </View>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.5 }]}
                onPress={handleLog}
                disabled={saving}
              >
                <Text style={styles.saveBtnText}>
                  {saving ? t('health.saving') : t('common.save')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setLogVisible(false)}>
                <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 24 }} />
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollContent: { paddingBottom: 20 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  headerAccent: { color: colors.gold, fontStyle: 'italic' },
  logBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.gold,
  },
  logBtnText: { color: colors.navyDeep, fontSize: 13, fontWeight: '700' },
  chartCard: { marginHorizontal: 20, marginBottom: 20, padding: 16 },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '500', marginBottom: 6 },
  chartValue: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  chartBigValue: { fontSize: 28, fontWeight: '300', color: colors.textPrimary },
  chartTrend: { fontSize: 13, color: colors.cyan, fontWeight: '500' },
  chartAverage: { alignItems: 'flex-end' },
  chartAvgLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
    marginBottom: 2,
  },
  chartAvgValue: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 6,
    marginTop: 8,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: { width: '100%', borderRadius: 4 },
  barLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)' },
  emptyChart: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    marginTop: 8,
  },
  emptyChartText: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  breakdownWrapper: {
    backgroundColor: 'rgba(20, 184, 212, 0.03)',
    paddingTop: 20,
    paddingBottom: 24,
  },
  breakdown: { paddingHorizontal: 20, gap: 12 },
  metricCard: { paddingVertical: 12, paddingHorizontal: 12 },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: { fontSize: 12, fontWeight: '500', color: colors.textPrimary },
  metricValue: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  metricBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  metricBarFill: { height: '100%', borderRadius: 3 },
  metricSub: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    backgroundColor: colors.bgSecondary || '#0F1E2E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  logField: { marginBottom: 14 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  moodOption: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  moodOptionActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.18)',
    borderColor: colors.gold,
  },
  moodEmoji: { fontSize: 24 },
  logFieldLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
    fontWeight: '500',
  },
  logFieldInput: {
    height: 46,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: colors.white,
    fontSize: 15,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  saveBtn: {
    flex: 2,
    height: 48,
    backgroundColor: colors.gold,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: colors.navyDeep, fontWeight: '700', fontSize: 15 },
  cancelBtn: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { color: colors.textSecondary, fontSize: 15 },
});
