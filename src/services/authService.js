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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

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

export const loginWithGoogle = async () => {
  try {
    checkFirebaseAvailable();
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        avatar: user.photoURL,
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
        displayName: user.displayName || 'User',
      },
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginWithApple = async () => {
  try {
    checkFirebaseAvailable();
    const provider = new OAuthProvider('apple.com');
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Apple User',
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
        displayName: user.displayName || 'Apple User',
      },
      token,
    };
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
