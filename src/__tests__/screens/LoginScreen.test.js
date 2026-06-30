import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import LoginScreen from '../../screens/Auth/LoginScreen';

const mockDispatch = jest.fn(() => Promise.resolve({ payload: {} }));

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) => selector({ auth: { isLoading: false, error: null } }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'tr' } }),
}));

jest.mock('../../store/slices/authSlice', () => ({
  login: jest.fn((args) => ({ type: 'auth/login', payload: args })),
  loginWithGoogle: jest.fn(() => ({ type: 'auth/loginWithGoogle' })),
  loginWithApple: jest.fn(() => ({ type: 'auth/loginWithApple' })),
  clearError: jest.fn(() => ({ type: 'auth/clearError' })),
}));

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate, goBack: jest.fn() };

describe('LoginScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    const renderer = TestRenderer.create(<LoginScreen navigation={navigation} />);
    expect(renderer.toJSON()).not.toBeNull();
  });

  it('renders email and password inputs', () => {
    const renderer = TestRenderer.create(<LoginScreen navigation={navigation} />);
    const inputs = renderer.root.findAllByType('TextInput');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('renders a login button', () => {
    const renderer = TestRenderer.create(<LoginScreen navigation={navigation} />);
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    expect(touchables.length).toBeGreaterThan(0);
  });

  it('shows spinner when isLoading is true', () => {
    jest
      .spyOn(require('../../store/hooks'), 'useAppSelector')
      .mockImplementation((selector) => selector({ auth: { isLoading: true, error: null } }));
    const renderer = TestRenderer.create(<LoginScreen navigation={navigation} />);
    const indicators = renderer.root.findAllByType('ActivityIndicator');
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('navigates to Signup when link pressed', () => {
    const renderer = TestRenderer.create(<LoginScreen navigation={navigation} />);
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    // Last pressable is typically the "no account" link
    const signupLink = touchables[touchables.length - 1];
    act(() => {
      signupLink.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('Signup');
  });

  it('renders a forgot password link', () => {
    const renderer = TestRenderer.create(<LoginScreen navigation={navigation} />);
    const texts = renderer.root.findAllByType('Text');
    const forgotText = texts.find(
      (t) =>
        String(t.props.children).toLowerCase().includes('forgot') ||
        String(t.props.children).includes('auth.forgotPassword')
    );
    expect(forgotText).toBeTruthy();
  });
});
