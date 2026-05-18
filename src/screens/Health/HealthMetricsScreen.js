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
import { LineChart } from 'react-native-chart-kit';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMetrics, setPeriod } from '../../store/slices/metricsSlice';
import WellnessRing from '../../components/features/WellnessRing';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CHART_CONFIG = {
  backgroundColor: 'transparent',
  backgroundGradientFrom: colors.bgSecondary,
  backgroundGradientTo: colors.bgSecondary,
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(20, 184, 212, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.45})`,
  style: { borderRadius: 12 },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: colors.cyan,
  },
  propsForBackgroundLines: {
    stroke: 'rgba(255,255,255,0.06)',
    strokeDasharray: '',
  },
};

function MetricBar({ label, value, max, unit, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <View style={styles.metricBarItem}>
      <View style={styles.metricBarHeader}>
        <Text style={styles.metricBarLabel}>{label}</Text>
        <Text style={styles.metricBarValue}>
          {value} <Text style={styles.metricBarUnit}>{unit}</Text>
        </Text>
      </View>
      <View style={styles.metricBarTrack}>
        <View style={[styles.metricBarFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function HealthMetricsScreen() {
  const dispatch = useAppDispatch();
  const { dailyMetrics, weeklyData, wellnessScore, selectedPeriod } = useAppSelector(
    (state) => state.metrics
  );

  useEffect(() => {
    dispatch(fetchMetrics());
  }, []);

  const periods = ['Gün', 'Hafta', 'Ay'];

  const chartData = weeklyData.length > 0 ? {
    labels: weeklyData.map((d) => d.day),
    datasets: [
      {
        data: weeklyData.map((d) => d.steps),
        color: (opacity = 1) => `rgba(20, 184, 212, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  } : null;

  const sleepChartData = weeklyData.length > 0 ? {
    labels: weeklyData.map((d) => d.day),
    datasets: [
      {
        data: weeklyData.map((d) => d.sleep),
        color: (opacity = 1) => `rgba(11, 114, 185, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  } : null;

  const chartWidth = SCREEN_WIDTH - 40;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sağlık Metrikleri</Text>
          <View style={styles.periodRow}>
            {periods.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, selectedPeriod === p && styles.periodBtnActive]}
                onPress={() => dispatch(setPeriod(p))}
              >
                <Text style={[styles.periodText, selectedPeriod === p && styles.periodTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Wellness Score */}
        <Card style={styles.scoreCard} variant="elevated">
          <View style={styles.scoreRow}>
            <WellnessRing score={wellnessScore || 0} size={140} />
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreTitle}>Bugünkü Skor</Text>
              <Text style={styles.scoreTrend}>
                {wellnessScore >= 75 ? '🌟 Harika!' : wellnessScore >= 45 ? '💪 İyi' : '🎯 Gelişiyor'}
              </Text>
              <View style={styles.scoreStats}>
                <View>
                  <Text style={styles.scoreStatValue}>+5</Text>
                  <Text style={styles.scoreStatLabel}>dünden fazla</Text>
                </View>
                <View>
                  <Text style={styles.scoreStatValue}>{wellnessScore || 0}</Text>
                  <Text style={styles.scoreStatLabel}>hafta ort.</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Steps Chart */}
        {chartData && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Haftalık Adımlar</Text>
            <Text style={styles.chartSubtitle}>Son 7 gün</Text>
            <LineChart
              data={chartData}
              width={chartWidth}
              height={160}
              chartConfig={CHART_CONFIG}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              fromZero={true}
            />
          </Card>
        )}

        {/* Sleep Chart */}
        {sleepChartData && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Haftalık Uyku</Text>
            <Text style={styles.chartSubtitle}>Saat cinsinden</Text>
            <LineChart
              data={sleepChartData}
              width={chartWidth}
              height={160}
              chartConfig={{
                ...CHART_CONFIG,
                color: (opacity = 1) => `rgba(11, 114, 185, ${opacity})`,
                propsForDots: { r: '4', strokeWidth: '2', stroke: colors.royal },
              }}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={false}
              fromZero={false}
              yAxisSuffix="s"
            />
          </Card>
        )}

        {/* Metric Bars */}
        {dailyMetrics && (
          <Card style={styles.barsCard}>
            <Text style={styles.barsTitle}>Bugünkü Detaylar</Text>
            <MetricBar
              label="Uyku"
              value={dailyMetrics.sleep.hours}
              max={9}
              unit="saat"
              color={colors.royal}
            />
            <MetricBar
              label="Kalp Atışı"
              value={dailyMetrics.heartRate}
              max={180}
              unit="bpm"
              color={colors.error}
            />
            <MetricBar
              label="Adımlar"
              value={dailyMetrics.steps}
              max={15000}
              unit="adım"
              color={colors.success}
            />
            <MetricBar
              label="Kalori"
              value={dailyMetrics.calories}
              max={3000}
              unit="kcal"
              color={colors.gold}
            />
          </Card>
        )}

        {/* AI Insight */}
        <Card style={styles.insightCard} variant="glass">
          <View style={styles.insightHeader}>
            <Text style={styles.insightEmoji}>🤖</Text>
            <Text style={styles.insightTitle}>AI Tavsiyesi</Text>
          </View>
          <Text style={styles.insightText}>
            Bu hafta uyku süreniz ortalamanın üzerinde. Egzersiz rutininizi daha da
            artırırsanız wellness skorunuz 90'a ulaşabilir. Kalp atış hızınız dinlenme
            değerleri mükemmel görünüyor.
          </Text>
        </Card>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  periodBtn: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 8 },
  periodBtnActive: { backgroundColor: colors.cyan },
  periodText: { fontSize: 13, color: colors.textSecondary },
  periodTextActive: { color: colors.navy, fontWeight: '600' },
  scoreCard: { marginHorizontal: 20, marginBottom: 12 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  scoreInfo: { flex: 1, gap: 8 },
  scoreTitle: { fontSize: 13, color: colors.textSecondary },
  scoreTrend: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  scoreStats: { flexDirection: 'row', gap: 20 },
  scoreStatValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  scoreStatLabel: { fontSize: 11, color: colors.textTertiary },
  chartCard: { marginHorizontal: 20, marginBottom: 12, padding: 16 },
  chartTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  chartSubtitle: { fontSize: 12, color: colors.textTertiary, marginBottom: 12 },
  chart: { borderRadius: 8, marginLeft: -16 },
  barsCard: { marginHorizontal: 20, marginBottom: 12 },
  barsTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 },
  metricBarItem: { marginBottom: 16 },
  metricBarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  metricBarLabel: { fontSize: 13, color: colors.textPrimary },
  metricBarValue: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  metricBarUnit: { fontWeight: '400', color: colors.textTertiary },
  metricBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  metricBarFill: { height: '100%', borderRadius: 3 },
  insightCard: { marginHorizontal: 20, gap: 8 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightEmoji: { fontSize: 24 },
  insightTitle: { fontSize: 15, fontWeight: '700', color: colors.cyan },
  insightText: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },
});
