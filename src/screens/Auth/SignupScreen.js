import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signup, clearError } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../constants/designTokens';

export default function SignupScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!displayName.trim()) e.displayName = t('auth.nameRequired');
    if (!email) e.email = t('auth.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = t('auth.emailInvalid');
    if (!password) e.password = t('auth.passwordRequired');
    else if (password.length < 6) e.password = t('auth.passwordMin');
    if (password !== confirmPassword) e.confirmPassword = t('auth.passwordMismatch');
    if (!agreed) e.terms = t('auth.termsRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    dispatch(clearError());
    if (!validate()) return;

    const result = await dispatch(signup({ email, password, displayName }));
    if (signup.fulfilled.match(result)) {
      navigation.navigate('Onboarding');
    } else {
      Alert.alert(t('auth.signupFailed'), result.payload || t('common.error'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{t('auth.backBtn')}</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>{t('auth.joinCommunity')}</Text>

          <Input
            label={t('auth.displayName')}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={t('auth.namePlaceholder')}
            autoCapitalize="words"
            error={errors.displayName}
          />
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.emailPlaceholder')}
            keyboardType="email-address"
            error={errors.email}
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.passwordPlaceholder')}
            secureTextEntry
            error={errors.password}
          />
          <Input
            label={t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreed((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              <Text style={styles.termsLink}>{t('auth.terms')}</Text> {t('auth.termsAccept')}{' '}
              <Text style={styles.termsLink}>{t('auth.privacy')}</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && <Text style={styles.errorSmall}>{errors.terms}</Text>}

          {error && <Text style={styles.errorBanner}>{error}</Text>}

          <Button
            title={t('auth.signup')}
            onPress={handleSignup}
            loading={isLoading}
            style={styles.signupBtn}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.hasAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>{t('auth.login')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgPrimary },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backBtn: { marginBottom: 32 },
  backText: { color: colors.cyan, fontSize: 15 },
  form: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  checkmark: { color: colors.navy, fontSize: 12, fontWeight: '700' },
  termsText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  termsLink: { color: colors.cyan },
  errorSmall: { color: colors.error, fontSize: 12, marginBottom: 12 },
  errorBanner: {
    color: colors.error,
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  signupBtn: { marginTop: 20 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: { color: colors.textSecondary, fontSize: 14 },
  footerLink: { color: colors.cyan, fontSize: 14, fontWeight: '600' },
});
