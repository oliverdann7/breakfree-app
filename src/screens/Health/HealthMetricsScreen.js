import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

export default function HealthMetricsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Detaylı analiz</Text>
            <Text style={styles.headerTitle}>
              Sağlık <Text style={styles.headerAccent}>verilerin</Text>
            </Text>
          </View>
          <Text style={styles.chartIcon}>📊</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['Gün', 'Hafta', 'Ay', 'Yıl'].map((period, i) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodBtn, i === 1 && styles.periodBtnActive]}
            >
              <Text style={[styles.periodText, i === 1 && styles.periodTextActive]}>{period}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Big Chart Card */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartLabel}>Wellness skoru</Text>
              <View style={styles.chartValue}>
                <Text style={styles.chartBigValue}>76</Text>
                <Text style={styles.chartTrend}>↑ +12%</Text>
              </View>
            </View>
            <View style={styles.chartAverage}>
              <Text style={styles.chartAvgLabel}>Ortalama</Text>
              <Text style={styles.chartAvgValue}>71</Text>
            </View>
          </View>

          {/* Mini SVG Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.miniChart} />
          </View>

          <View style={styles.chartDays}>
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
              <Text key={day} style={styles.dayLabel}>
                {day}
              </Text>
            ))}
          </View>
        </Card>

        {/* Breakdown */}
        <View style={styles.breakdownWrapper}>
          <View style={styles.breakdown}>
            {[
              { label: 'Uyku kalitesi', value: 84, color: colors.cyan, sub: 'Mükemmel · 7s 24dk' },
              { label: 'Hareket', value: 72, color: colors.gold, sub: 'İyi · 8.2k adım' },
              { label: 'Zihin & stres', value: 68, color: colors.royal, sub: 'İyi · 3 meditasyon' },
              { label: 'Beslenme', value: 81, color: colors.gold, sub: 'Çok iyi · 2.1L su' },
            ].map((metric, i) => (
              <Card
                key={i}
                style={[
                  styles.metricCard,
                  {
                    borderLeftWidth: 3,
                    borderLeftColor: metric.color,
                    backgroundColor: 'rgba(20, 184, 212, 0.06)',
                  },
                  metric.color === colors.gold && { backgroundColor: 'rgba(201, 150, 26, 0.06)' },
                  metric.color === colors.royal && { backgroundColor: 'rgba(0, 114, 176, 0.06)' },
                ]}
              >
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                </View>
                <View style={styles.metricBarTrack}>
                  <View
                    style={[
                      styles.metricBarFill,
                      { width: `${metric.value}%`, backgroundColor: metric.color },
                    ]}
                  />
                </View>
                <Text style={styles.metricSub}>{metric.sub}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* AI Insight */}
        <Card style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>✨</Text>
            <Text style={styles.insightLabel}>AI İçgörü</Text>
          </View>
          <Text style={styles.insightText}>
            Uyku puanın bu hafta <Text style={styles.insightHighlight}>%14 yükseldi</Text>. Akşam
            meditasyonu rutinini sürdürmeni öneririm — sonuçlar harika.
          </Text>
        </Card>

        <View style={{ height: 24 }} />
      </ScrollView>
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
  chartIcon: { fontSize: 20 },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  periodBtnActive: { backgroundColor: colors.cyan, borderColor: colors.cyan },
  periodText: { fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.6)' },
  periodTextActive: { color: colors.navy, fontWeight: '600' },
  chartCard: { marginHorizontal: 20, marginBottom: 20, padding: 16 },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '500', marginBottom: 6 },
  chartValue: { gap: 4 },
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
  chartContainer: {
    marginVertical: 16,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
  },
  miniChart: { flex: 1 },
  chartDays: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  dayLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  breakdownWrapper: {
    backgroundColor: 'rgba(20, 184, 212, 0.03)',
    paddingTop: 20,
    paddingBottom: 24,
  },
  breakdown: { paddingHorizontal: 20, gap: 12, marginBottom: 0 },
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
  insightCard: {
    marginHorizontal: 20,
    padding: 16,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00FF88',
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  insightIcon: { fontSize: 18 },
  insightLabel: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  insightText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 19 },
  insightHighlight: { color: colors.gold, fontWeight: '600' },
});
