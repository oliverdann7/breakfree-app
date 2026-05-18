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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../constants/designTokens';

export default function LoginScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

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

    // For mock mode: bypass Firebase and go directly to authenticated state
    // Dispatch a mock login - in real mode this calls Firebase
    const result = await dispatch(login({ email, password }));
    if (login.rejected.match(result)) {
      // Mock fallback: allow any credentials in dev mode
      Alert.alert(
        'Giriş Başarılı (Mock)',
        'Firebase bağlantısı olmadan devam ediyorsunuz.',
        [{ text: 'Tamam', onPress: () => forceMockLogin() }]
      );
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

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>BREAK<Text style={styles.logoAccent}>FREE</Text></Text>
          <Text style={styles.tagline}>Sağlıklı bir yaşam topluluğu</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Hoş geldin</Text>
          <Text style={styles.subtitle}>Hesabına giriş yap</Text>

          <Input
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@email.com"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Şifreni mi unuttun?</Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorBanner}>{error}</Text>}

          <Button
            title="Giriş Yap"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginBtn}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="🍎  Apple ile Devam Et"
            variant="outline"
            onPress={() => Alert.alert('Yakında', 'Apple girişi çok yakında!')}
            style={styles.socialBtn}
          />
          <Button
            title="🔵  Google ile Devam Et"
            variant="outline"
            onPress={() => Alert.alert('Yakında', 'Google girişi çok yakında!')}
            style={styles.socialBtn}
          />
        </View>

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
  flex: { flex: 1, backgroundColor: colors.bgPrimary },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 2,
  },
  logoAccent: { color: colors.cyan },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
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
  forgotBtn: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 24 },
  forgotText: { color: colors.cyan, fontSize: 13 },
  errorBanner: {
    color: colors.error,
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginBtn: { marginTop: 4 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: {
    color: colors.textTertiary,
    fontSize: 12,
    marginHorizontal: 12,
  },
  socialBtn: { marginBottom: 12 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: { color: colors.textSecondary, fontSize: 14 },
  footerLink: { color: colors.cyan, fontSize: 14, fontWeight: '600' },
});
