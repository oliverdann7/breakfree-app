import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  PLANS,
  fetchSubscription,
  subscribe,
  cancelSubscription,
  selectIsPremium,
} from '../../store/slices/premiumSlice';
import { colors } from '../../constants/designTokens';

function PlanCard({ plan, selected, onSelect }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(plan.id)}
      activeOpacity={0.85}
      style={[styles.planCard, selected && styles.planCardSelected]}
    >
      <View style={styles.planHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceVal}>₺{plan.price}</Text>
            <Text style={styles.priceInterval}>{plan.intervalLabel}</Text>
          </View>
        </View>
        {plan.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{plan.badge}</Text>
          </View>
        )}
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      </View>
      <View style={styles.featureList}>
        {plan.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export default function PremiumScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { subscription, loading } = useAppSelector((state) => state.premium);
  const isPremium = useAppSelector(selectIsPremium);
  const [selected, setSelected] = useState('pro_annual');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.uid) dispatch(fetchSubscription(user.uid));
  }, [user?.uid, dispatch]);

  const handleSubscribe = async () => {
    if (!user?.uid) return;
    setSubmitting(true);
    try {
      await dispatch(subscribe({ planId: selected })).unwrap();
    } catch (err) {
      Alert.alert('Abonelik', typeof err === 'string' ? err : 'Bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!user?.uid) return;
    setSubmitting(true);
    try {
      await dispatch(cancelSubscription()).unwrap();
    } catch (err) {
      Alert.alert('Abonelik', typeof err === 'string' ? err : 'Bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={colors.cyan} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroRow}>
          {navigation && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>BREAKFREE PRO</Text>
            <Text style={styles.title}>Wellness yolculuğunu hızlandır</Text>
            <Text style={styles.subtitle}>
              Gelişmiş analiz, mentor seansları ve reklamsız deneyim.
            </Text>
          </View>
        </View>

        {isPremium && subscription?.status === 'active' ? (
          <View style={styles.activeBanner}>
            <Text style={styles.activeIcon}>✨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeTitle}>Pro aboneliğin aktif</Text>
              <Text style={styles.activeMeta}>
                Yenileme:{' '}
                {subscription.renewAt
                  ? new Date(subscription.renewAt).toLocaleDateString('tr-TR')
                  : '—'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelLink}>
              <Text style={styles.cancelLinkText}>İptal et</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.trial}>
              <Text style={styles.trialText}>7 gün ücretsiz dene · İstediğin zaman iptal et</Text>
            </View>

            {PLANS.map((p) => (
              <PlanCard key={p.id} plan={p} selected={selected === p.id} onSelect={setSelected} />
            ))}

            <TouchableOpacity
              onPress={handleSubscribe}
              disabled={submitting}
              style={[styles.cta, submitting && { opacity: 0.6 }]}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>
                {submitting
                  ? 'İşleniyor...'
                  : `${PLANS.find((p) => p.id === selected)?.name} ile başla`}
              </Text>
            </TouchableOpacity>

            <Text style={styles.fineprint}>
              Ödeme Apple/Google hesabınızdan tahsil edilir. Abonelik otomatik yenilenir; istediğin
              zaman ayarlardan iptal edebilirsin.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { padding: 20, paddingBottom: 60 },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 12 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: colors.textPrimary, fontSize: 18 },
  kicker: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', lineHeight: 30 },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 6, lineHeight: 19 },

  trial: {
    backgroundColor: 'rgba(20, 184, 212, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  trialText: { color: colors.cyan, fontSize: 12, fontWeight: '600' },

  planCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  planCardSelected: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(20,184,212,0.07)',
  },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  planName: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 },
  priceVal: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  priceInterval: { color: colors.textTertiary, fontSize: 12 },
  badge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: colors.navy, fontSize: 10, fontWeight: '800' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.cyan },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.cyan },

  featureList: { gap: 6 },
  featureRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  featureCheck: { color: colors.cyan, fontWeight: '800', fontSize: 13, width: 14 },
  featureText: { color: colors.textSecondary, fontSize: 13, flex: 1 },

  cta: {
    backgroundColor: colors.cyan,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaText: { color: colors.navy, fontWeight: '800', fontSize: 15 },
  fineprint: {
    color: colors.textTertiary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 14,
    textAlign: 'center',
  },

  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(201,150,26,0.1)',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 14,
    padding: 16,
  },
  activeIcon: { fontSize: 28 },
  activeTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 },
  activeMeta: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  cancelLink: { padding: 8 },
  cancelLinkText: { color: colors.error, fontSize: 12, fontWeight: '600' },
});
