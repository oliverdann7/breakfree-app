import { formatFirebaseError, formatError, retryableAsync } from '../utils/errorUtils';

describe('formatFirebaseError', () => {
  it('returns default message for null input', () => {
    expect(formatFirebaseError(null)).toBe('Beklenmeyen bir hata oluştu.');
  });

  it('handles auth/user-not-found', () => {
    const error = { code: 'auth/user-not-found' };
    expect(formatFirebaseError(error)).toBe('Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.');
  });

  it('handles auth/wrong-password', () => {
    const error = { code: 'auth/wrong-password' };
    expect(formatFirebaseError(error)).toBe('Şifre yanlış. Lütfen tekrar deneyin.');
  });

  it('handles auth/email-already-in-use', () => {
    const error = { code: 'auth/email-already-in-use' };
    expect(formatFirebaseError(error)).toBe('Bu e-posta adresi zaten kullanılıyor.');
  });

  it('handles auth/weak-password', () => {
    const error = { code: 'auth/weak-password' };
    expect(formatFirebaseError(error)).toBe('Şifre en az 6 karakter olmalıdır.');
  });

  it('handles auth/invalid-email', () => {
    const error = { code: 'auth/invalid-email' };
    expect(formatFirebaseError(error)).toBe('Geçerli bir e-posta adresi girin.');
  });

  it('handles auth/too-many-requests', () => {
    const error = { code: 'auth/too-many-requests' };
    expect(formatFirebaseError(error)).toBe(
      'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.'
    );
  });

  it('handles auth/network-request-failed', () => {
    const error = { code: 'auth/network-request-failed' };
    expect(formatFirebaseError(error)).toBe('İnternet bağlantınızı kontrol edin.');
  });

  it('handles auth/popup-closed-by-user', () => {
    const error = { code: 'auth/popup-closed-by-user' };
    expect(formatFirebaseError(error)).toBe('Giriş işlemi iptal edildi.');
  });

  it('handles permission-denied', () => {
    const error = { code: 'permission-denied' };
    expect(formatFirebaseError(error)).toBe('Bu işlem için yetkiniz bulunmuyor.');
  });

  it('handles unavailable', () => {
    const error = { code: 'unavailable' };
    expect(formatFirebaseError(error)).toBe(
      'Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.'
    );
  });

  it('handles Firebase prefix in code', () => {
    const error = { code: 'Firebase: Error (auth/user-not-found).' };
    expect(formatFirebaseError(error)).toBe('Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.');
  });

  it('returns raw code for unknown error codes', () => {
    const error = { code: 'auth/unknown-error' };
    expect(formatFirebaseError(error)).toBe('auth/unknown-error');
  });

  it('handles error with message only', () => {
    const error = { message: 'Something went wrong' };
    expect(formatFirebaseError(error)).toBe('Something went wrong');
  });

  it('handles string error', () => {
    expect(formatFirebaseError('Network error')).toBe('Network error');
  });
});

describe('formatError', () => {
  it('handles string input', () => {
    expect(formatError('Bir hata oluştu')).toBe('Bir hata oluştu');
  });

  it('handles Firebase error with code', () => {
    const error = { code: 'auth/invalid-email' };
    expect(formatError(error)).toBe('Geçerli bir e-posta adresi girin.');
  });

  it('handles Error object', () => {
    const error = new Error('Test error');
    expect(formatError(error)).toBe('Test error');
  });

  it('handles null input', () => {
    expect(formatError(null)).toBe('Beklenmeyen bir hata oluştu.');
  });

  it('handles undefined input', () => {
    expect(formatError(undefined)).toBe('Beklenmeyen bir hata oluştu.');
  });
});

describe('retryableAsync', () => {
  it('returns result on first success', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await retryableAsync(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on network error and succeeds', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce('success');
    const result = await retryableAsync(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after max retries on network errors', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('network error'));
    await expect(retryableAsync(fn, 2)).rejects.toThrow('network error');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not retry non-retryable errors (e.g. validation)', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('invalid input'));
    await expect(retryableAsync(fn, 2)).rejects.toThrow('invalid input');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
