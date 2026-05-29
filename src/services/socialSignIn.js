// Apple / Google sign-in wrappers. Native modules are added later via EAS
// dev build; this file gives the app a stable API and gracefully no-ops when
// the modules are missing. Calls return { user } on success or throw on
// failure.

import { Platform } from 'react-native';
import { signInWithCredential, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase not configured');

  // expo-auth-session is the recommended path for both iOS + Android in Expo.
  let GoogleSignin;
  try {
    GoogleSignin = await import('@react-native-google-signin/google-signin');
  } catch {
    throw new Error('@react-native-google-signin/google-signin not installed');
  }

  await GoogleSignin.GoogleSignin.configure({
    webClientId: process.env['EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'],
  });
  const { idToken } = await GoogleSignin.GoogleSignin.signIn();
  const cred = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, cred);
  return { user: result.user };
}

export async function signInWithApple() {
  if (!auth) throw new Error('Firebase not configured');
  if (Platform.OS !== 'ios') throw new Error('Apple sign-in is iOS only');

  let AppleAuthentication;
  try {
    AppleAuthentication = await import('expo-apple-authentication');
  } catch {
    throw new Error('expo-apple-authentication not installed');
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const provider = new OAuthProvider('apple.com');
  const cred = provider.credential({
    idToken: credential.identityToken,
    rawNonce: credential.nonce,
  });
  const result = await signInWithCredential(auth, cred);
  return { user: result.user };
}

export async function isAppleSignInAvailable() {
  if (Platform.OS !== 'ios') return false;
  try {
    const AppleAuthentication = await import('expo-apple-authentication');
    return AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}
