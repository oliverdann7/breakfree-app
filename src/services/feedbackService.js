// Phase 3 Sprint 12 — in-app feedback via shake gesture.
// Writes to feedback/{auto-id} for the admin CMS queue. expo-shake is added
// dynamically; if missing, expose only the submit() function for in-app forms.

import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

let shakeListener = null;

export async function submitFeedback({ uid, type = 'general', message, screen, meta = {} }) {
  if (!db || !message?.trim()) return;
  await addDoc(collection(db, 'feedback'), {
    uid: uid || null,
    type,
    message: message.trim(),
    screen: screen || null,
    meta,
    status: 'open',
    createdAt: Date.now(),
  });
}

export async function attachShakeListener(onShake) {
  try {
    const Shake = await import('expo-shake');
    if (shakeListener) shakeListener.remove?.();
    shakeListener = Shake.addListener(onShake);
    return () => {
      shakeListener?.remove?.();
      shakeListener = null;
    };
  } catch {
    return () => {};
  }
}
