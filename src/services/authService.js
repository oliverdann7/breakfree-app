import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const checkFirebaseAvailable = () => {
  if (!auth || !db) {
    throw new Error('Firebase not configured. Please add environment variables.');
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
      preferences: { language: 'tr', units: 'metric', notifications: true },
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

export const logout = async () => {
  try {
    checkFirebaseAvailable();
    await signOut(auth);
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
