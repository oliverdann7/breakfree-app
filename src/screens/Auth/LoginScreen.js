import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/slices/authSlice';
import BreakFreeLogo from '../../components/branding/BreakFreeLogo';
import { colors } from '../../constants/designTokens';

function GoogleIcon({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

function AppleIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
        fill={color}
      />
    </Svg>
  );
}

export default function LoginScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'E-posta zorunlu';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Geçerli bir e-posta girin';
    if (!password) newErrors.password = 'Şifre zorunlu';
    else if (password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    dispatch(clearError());
    if (!validate()) return;

    const result = await dispatch(login({ email, password }));
    if (login.rejected.match(result)) {
      const errorMsg = result.payload;
      if (errorMsg?.includes('Firebase not configured')) {
        Alert.alert('Firebase Yapılandırılmadı', 'Test için mock girişi kullanmak ister misiniz?', [
          { text: 'İptal' },
          { text: 'Test (Mock)', onPress: () => forceMockLogin() },
        ]);
      } else {
        Alert.alert('Giriş Başarısız', errorMsg || 'E-posta veya şifre yanlış.');
      }
    }
  };

  const forceMockLogin = () => {
    dispatch({
      type: 'auth/login/fulfilled',
      payload: {
        user: { uid: 'mock-uid', email, displayName: 'Demo Kullanıcı' },
        token: 'mock-token-123',
      },
    });
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google', 'Google ile giriş çok yakında!');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple', 'Apple ile giriş çok yakında!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Ambient glow orbs */}
      <View style={styles.orbTopLeft} />
      <View style={styles.orbBottomRight} />
      <View style={styles.orbMidGold} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo + tagline */}
        <View style={styles.header}>
          <BreakFreeLogo variant="full" size="medium" />
          <Text style={styles.tagline}>Sağlıklı bir yaşam topluluğu</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Hoş geldin</Text>
          <Text style={styles.subtitle}>Hesabına giriş yap</Text>

          {/* Email */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>E-posta</Text>
            <View
              style={[
                styles.inputBox,
                focusedField === 'email' && styles.inputBoxFocused,
                errors.email && styles.inputBoxError,
              ]}
            >
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="ornek@email.com"
                placeholderTextColor="rgba(255,255,255,0.22)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
          </View>

          {/* Password */}
          <View style={styles.fieldWrapper}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Şifre</Text>
              <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.forgotLink}>Unuttun mu?</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputBox,
                focusedField === 'password' && styles.inputBoxFocused,
                errors.password && styles.inputBoxError,
              ]}
            >
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                placeholderTextColor="rgba(255,255,255,0.22)"
                secureTextEntry
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
          </View>

          {/* API error */}
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          {/* Primary CTA */}
          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.navyDeep} size="small" />
            ) : (
              <Text style={styles.loginBtnText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>veya şununla devam et</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social login row */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={handleAppleLogin}
              activeOpacity={0.75}
            >
              <AppleIcon size={17} color="#FFFFFF" />
              <Text style={styles.socialBtnText}>Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={handleGoogleLogin}
              activeOpacity={0.75}
            >
              <GoogleIcon size={17} />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabın yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.footerLink}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  /* ── Ambient orbs ── */
  orbTopLeft: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0,114,176,0.14)',
    top: -100,
    left: -100,
  },
  orbBottomRight: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(20,184,212,0.07)',
    bottom: 40,
    right: -80,
  },
  orbMidGold: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(201,150,26,0.05)',
    top: '38%',
    alignSelf: 'center',
  },

  /* ── Layout ── */
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 76,
    paddingBottom: 48,
  },

  /* ── Header ── */
  header: {
    alignItems: 'center',
    marginBottom: 52,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 14,
    letterSpacing: 0.4,
  },

  /* ── Form ── */
  form: { flex: 1 },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 36,
  },

  /* ── Fields ── */
  fieldWrapper: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 9,
    letterSpacing: 0.2,
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
  inputBoxFocused: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(20,184,212,0.05)',
  },
  inputBoxError: {
    borderColor: 'rgba(239,68,68,0.45)',
  },
  textInput: {
    color: colors.white,
    fontSize: 15,
    paddingVertical: 0,
  },
  forgotLink: {
    color: colors.cyan,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 9,
  },
  fieldError: {
    color: colors.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 2,
  },

  /* ── Error banner ── */
  errorBanner: {
    backgroundColor: 'rgba(239,68,68,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
  },

  /* ── Primary button ── */
  loginBtn: {
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
  loginBtnDisabled: {
    opacity: 0.55,
  },
  loginBtnText: {
    color: colors.navyDeep,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* ── Divider ── */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  dividerLabel: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 12,
    letterSpacing: 0.3,
  },

  /* ── Social ── */
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  socialBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  /* ── Footer ── */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 44,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
  },
});
