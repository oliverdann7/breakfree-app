import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAppSelector } from '../../store/hooks';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

export default function PrivacyScreen({ navigation }) {
  const { t } = useTranslation();
  const { user } = useAppSelector((s) => s.auth);
  const [submitting, setSubmitting] = useState(false);

  const submitRequest = async (type) => {
    if (!user?.uid) return;
    setSubmitting(true);
    try {
      if (db) {
        await addDoc(collection(db, 'users', user.uid, 'privacy_requests'), {
          type,
          status: 'pending',
          createdAt: Date.now(),
        });
      }
      Alert.alert(
        type === 'export' ? t('privacy.exportTitle') : t('privacy.deleteTitle'),
        type === 'export' ? t('privacy.exportSubmitted') : t('privacy.deleteDesc')
      );
    } catch (err) {
      Alert.alert(t('common.error'), err.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(t('privacy.deleteConfirmTitle'), t('privacy.deleteConfirmMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('privacy.deleteAction'),
        style: 'destructive',
        onPress: () => submitRequest('delete'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        <View style={styles.header}>
          {navigation && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{t('privacy.title')}</Text>
        </View>

        <Text style={styles.intro}>{t('privacy.intro')}</Text>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>📦 {t('privacy.exportTitle')}</Text>
          <Text style={styles.sectionDesc}>{t('privacy.exportDesc')}</Text>
          <TouchableOpacity
            style={styles.action}
            onPress={() => submitRequest('export')}
            disabled={submitting}
          >
            <Text style={styles.actionText}>
              {submitting ? t('privacy.submitting') : t('privacy.exportAction')}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 {t('privacy.integrationsTitle')}</Text>
          <Text style={styles.sectionDesc}>{t('privacy.integrationsDesc')}</Text>
        </Card>

        <Card style={[styles.section, styles.danger]}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>
            ⚠️ {t('privacy.deleteTitle')}
          </Text>
          <Text style={styles.sectionDesc}>{t('privacy.deleteDesc')}</Text>
          <TouchableOpacity
            style={styles.dangerAction}
            onPress={confirmDelete}
            disabled={submitting}
          >
            <Text style={styles.dangerActionText}>{t('privacy.deleteAction')}</Text>
          </TouchableOpacity>
        </Card>

        <Text style={styles.legal}>{t('privacy.contact')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: colors.textPrimary, fontSize: 18 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  intro: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginBottom: 20 },
  section: { marginBottom: 14, gap: 10 },
  sectionTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 },
  sectionDesc: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  action: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: colors.cyan,
    borderRadius: 999,
  },
  actionText: { color: colors.navy, fontWeight: '700', fontSize: 12 },
  danger: { borderColor: colors.error, borderWidth: 1, backgroundColor: 'rgba(239,68,68,0.04)' },
  dangerAction: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.error,
  },
  dangerActionText: { color: colors.error, fontWeight: '700', fontSize: 12 },
  legal: {
    color: colors.textTertiary,
    fontSize: 10,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 15,
  },
});
