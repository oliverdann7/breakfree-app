import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import BreakFreeLogo from '../../components/branding/BreakFreeLogo';
import { colors } from '../../constants/designTokens';

export default function ForgotPasswordScreen({ navigation }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth.emailInvalid'));
      return;
    }
    if (!auth) {
      setError(t('auth.noFirebase'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (e) {
      setError(e.message || t('auth.sendError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{t('auth.backBtn')}</Text>
        </TouchableOpacity>

        <BreakFreeLogo variant="symbol" size="small" />

        <Text style={styles.title}>{t('auth.forgotPasswordTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.forgotPasswordDesc')}</Text>

        {sent ? (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✉️</Text>
            <Text style={styles.successTitle}>{t('auth.forgotPasswordSentTitle')}</Text>
            <Text style={styles.successText}>{t('auth.forgotPasswordSentDesc', { email })}</Text>
            <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.doneBtnText}>{t('auth.backToLogin')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>{t('auth.email')}</Text>
              <View style={[styles.inputBox, error && styles.inputBoxError]}>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={(txt) => {
                    setEmail(txt);
                    setError('');
                  }}
                  placeholder={t('auth.emailPlaceholder')}
                  placeholderTextColor="rgba(255,255,255,0.22)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {error ? <Text style={styles.fieldError}>{error}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={colors.navyDeep} size="small" />
              ) : (
                <Text style={styles.sendBtnText}>{t('auth.forgotPasswordBtn')}</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 60 },
  back: { marginBottom: 32 },
  backText: { color: colors.textSecondary, fontSize: 15 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 36,
  },
  fieldWrapper: { marginBottom: 20 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 9,
  },
  inputBox: {
    height: 54,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  inputBoxError: { borderColor: 'rgba(239,68,68,0.45)' },
  textInput: { color: colors.white, fontSize: 15 },
  fieldError: { color: colors.error, fontSize: 12, marginTop: 6, marginLeft: 2 },
  sendBtn: {
    height: 56,
    backgroundColor: colors.gold,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 8,
  },
  sendBtnDisabled: { opacity: 0.55 },
  sendBtnText: { color: colors.navyDeep, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  successBox: { alignItems: 'center', paddingTop: 24 },
  successIcon: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '700', color: colors.white, marginBottom: 12 },
  successText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 36,
  },
  doneBtn: {
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  doneBtnText: { color: colors.white, fontSize: 15, fontWeight: '600' },
});
