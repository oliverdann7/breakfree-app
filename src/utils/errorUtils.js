import { logAnalyticsEvent, logError } from '../services/monitoringService';

export const FIREBASE_ERROR_MESSAGES = {
  'auth/user-not-found': 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.',
  'auth/wrong-password': 'Şifre yanlış. Lütfen tekrar deneyin.',
  'auth/invalid-credential': 'E-posta veya şifre yanlış.',
  'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanılıyor.',
  'auth/weak-password': 'Şifre en az 6 karakter olmalıdır.',
  'auth/invalid-email': 'Geçerli bir e-posta adresi girin.',
  'auth/too-many-requests': 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.',
  'auth/user-disabled': 'Bu hesap devre dışı bırakılmış.',
  'auth/operation-not-allowed': 'Bu giriş yöntemi şu anda kullanılamıyor.',
  'auth/network-request-failed': 'İnternet bağlantınızı kontrol edin.',
  'auth/popup-closed-by-user': 'Giriş işlemi iptal edildi.',
  'permission-denied': 'Bu işlem için yetkiniz bulunmuyor.',
  unavailable: 'Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.',
};

export function formatFirebaseError(error) {
  if (!error) return 'Beklenmeyen bir hata oluştu.';
  const code = error.code || error.message;
  if (!code) return error.toString();
  const cleanCode = code
    .replace(/^Firebase:\s*/i, '')
    .replace(/Error\s*\(([^)]+)\)\.?\s*$/i, '$1')
    .trim();
  return FIREBASE_ERROR_MESSAGES[cleanCode] || FIREBASE_ERROR_MESSAGES[code] || code;
}

export function formatError(error) {
  if (typeof error === 'string') return error;
  if (error?.code) return formatFirebaseError(error);
  return error?.message || 'Beklenmeyen bir hata oluştu.';
}

export async function retryableAsync(fn, maxRetries = 2, context = {}) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries && isRetryableError(error)) {
        const delay = Math.pow(2, attempt) * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      break;
    }
  }
  logError(lastError, { ...context, maxRetries });
  throw lastError;
}

function isRetryableError(error) {
  const msg = error?.message || error?.code || '';
  return (
    msg.includes('network') ||
    msg.includes('unavailable') ||
    msg.includes('deadline') ||
    msg.includes('timeout') ||
    msg.includes('reset') ||
    msg.includes('too-many-requests')
  );
}

export function trackAsyncAction(actionName, asyncFn, params = {}) {
  return async (...args) => {
    try {
      const result = await asyncFn(...args);
      logAnalyticsEvent(actionName, { ...params, status: 'success' });
      return result;
    } catch (error) {
      logAnalyticsEvent(actionName, { ...params, status: 'error', error: error?.message });
      throw error;
    }
  };
}
