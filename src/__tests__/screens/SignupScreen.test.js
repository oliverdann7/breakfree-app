import React from 'react';
import TestRenderer from 'react-test-renderer';
import SignupScreen from '../../screens/Auth/SignupScreen';

const mockDispatch = jest.fn(() =>
  Promise.resolve({ type: 'auth/signup/fulfilled', payload: { user: { uid: '1' }, token: 'tok' } })
);

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) => selector({ auth: { isLoading: false, error: null } }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'tr' } }),
}));

jest.mock('../../store/slices/authSlice', () => ({
  signup: jest.fn((args) => ({ type: 'auth/signup', payload: args })),
  clearError: jest.fn(() => ({ type: 'auth/clearError' })),
}));

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate, goBack: jest.fn() };

describe('SignupScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    const renderer = TestRenderer.create(<SignupScreen navigation={navigation} />);
    expect(renderer.toJSON()).not.toBeNull();
  });

  it('renders at least 4 text inputs (name, email, password, confirm)', () => {
    const renderer = TestRenderer.create(<SignupScreen navigation={navigation} />);
    const inputs = renderer.root.findAllByType('TextInput');
    expect(inputs.length).toBeGreaterThanOrEqual(4);
  });

  it('renders a signup submit button', () => {
    const renderer = TestRenderer.create(<SignupScreen navigation={navigation} />);
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    expect(touchables.length).toBeGreaterThan(0);
  });

  it('shows ActivityIndicator when loading', () => {
    jest
      .spyOn(require('../../store/hooks'), 'useAppSelector')
      .mockImplementation((selector) => selector({ auth: { isLoading: true, error: null } }));
    const renderer = TestRenderer.create(<SignupScreen navigation={navigation} />);
    const indicators = renderer.root.findAllByType('ActivityIndicator');
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('has a link to navigate back to Login', () => {
    const renderer = TestRenderer.create(<SignupScreen navigation={navigation} />);
    const texts = renderer.root.findAllByType('Text');
    const loginLink = texts.find(
      (t) =>
        String(t.props.children).includes('auth.login') ||
        String(t.props.children).toLowerCase().includes('login')
    );
    expect(loginLink).toBeTruthy();
  });

  it('renders terms checkbox area', () => {
    const renderer = TestRenderer.create(<SignupScreen navigation={navigation} />);
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    // Terms checkbox is a touchable
    expect(touchables.length).toBeGreaterThanOrEqual(2);
  });
});
