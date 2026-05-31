// Focused coverage for the password-reset flow added to authService.
const mockSendReset = jest.fn();

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithPopup: jest.fn(),
  sendPasswordResetEmail: (...args) => mockSendReset(...args),
  GoogleAuthProvider: class {},
  OAuthProvider: class {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../services/firebase', () => ({
  auth: { __mockAuth: true },
  db: { __mockDb: true },
}));

import { sendPasswordReset } from '../services/authService';

describe('sendPasswordReset', () => {
  beforeEach(() => mockSendReset.mockReset());

  it('sends a reset email to the given address', async () => {
    mockSendReset.mockResolvedValueOnce();
    const result = await sendPasswordReset('user@example.com');
    expect(result).toEqual({ ok: true });
    expect(mockSendReset).toHaveBeenCalledWith({ __mockAuth: true }, 'user@example.com');
  });

  it('rejects when no email is provided', async () => {
    await expect(sendPasswordReset('')).rejects.toThrow('E-posta adresi gerekli');
    expect(mockSendReset).not.toHaveBeenCalled();
  });

  it('surfaces Firebase errors', async () => {
    mockSendReset.mockRejectedValueOnce(new Error('auth/user-not-found'));
    await expect(sendPasswordReset('missing@example.com')).rejects.toThrow('auth/user-not-found');
  });
});
