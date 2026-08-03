import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { signInWithGoogle, signInWithApple } from './socialSignIn';

const checkFirebaseAvailable = () => {
  if (!auth || !db) {
    throw new Error(
      'Firebase not configured. Please copy .env.local.example to .env.local and add your Firebase credentials from https://console.firebase.google.com/'
    );
  }
};

export const signup = async (email, password, displayName) => {
  try {
    checkFirebaseAvailable();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName,
      avatar: null,
      bio: '',
      goals: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      preferences: { language: 'auto', units: 'metric', notifications: true },
    });

    const token = await user.getIdToken();
    return { user: { uid: user.uid, email: user.email, displayName }, token };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const login = async (email, password) => {
  try {
    checkFirebaseAvailable();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    const token = await user.getIdToken();
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: userData?.displayName || 'User',
        ...userData,
      },
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Shared post-sign-in step for social providers: create the Firestore user
// doc on first login, then normalize the return shape.
const finishSocialLogin = async (user, fallbackName) => {
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || fallbackName,
      avatar: user.photoURL || null,
      bio: '',
      goals: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      preferences: { language: 'auto', units: 'metric', notifications: true },
    });
  }

  const token = await user.getIdToken();
  return {
    user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || fallbackName,
    },
    token,
  };
};

export const loginWithGoogle = async () => {
  try {
    checkFirebaseAvailable();
    let user;
    if (Platform.OS === 'web') {
      const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      user = userCredential.user;
    } else {
      // Popup auth doesn't exist in React Native — use the native Google
      // Sign-In SDK and exchange its idToken for a Firebase credential.
      ({ user } = await signInWithGoogle());
    }
    return await finishSocialLogin(user, 'User');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginWithApple = async () => {
  try {
    checkFirebaseAvailable();
    let user;
    if (Platform.OS === 'web') {
      const userCredential = await signInWithPopup(auth, new OAuthProvider('apple.com'));
      user = userCredential.user;
    } else {
      ({ user } = await signInWithApple());
    }
    return await finishSocialLogin(user, 'Apple User');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    checkFirebaseAvailable();
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const sendPasswordReset = async (email) => {
  try {
    checkFirebaseAvailable();
    if (!email) throw new Error('E-posta adresi gerekli');
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const refreshToken = async () => {
  try {
    checkFirebaseAvailable();
    const user = auth.currentUser;
    if (user) return await user.getIdToken(true);
    throw new Error('No authenticated user');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    try {
      checkFirebaseAvailable();
    } catch (error) {
      reject(error);
      return;
    }
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe();
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          resolve({ uid: user.uid, email: user.email, ...userDoc.data() });
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};
