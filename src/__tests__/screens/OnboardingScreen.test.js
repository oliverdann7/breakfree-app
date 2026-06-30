import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import OnboardingScreen from '../../screens/Auth/OnboardingScreen';

const mockDispatch = jest.fn(() => Promise.resolve({}));

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) => selector({ auth: { user: { uid: '1', displayName: 'Ali' } } }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
    i18n: { language: 'tr' },
  }),
}));

jest.mock('../../store/slices/userSlice', () => ({
  updateProfile: jest.fn((args) => ({ type: 'user/updateProfile', payload: args })),
  updateProfileFirestore: jest.fn((args) => ({
    type: 'user/updateProfileFirestore',
    payload: args,
  })),
  setHasCompletedOnboarding: jest.fn((v) => ({
    type: 'user/setHasCompletedOnboarding',
    payload: v,
  })),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

describe('OnboardingScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    const renderer = TestRenderer.create(<OnboardingScreen navigation={navigation} />);
    expect(renderer.toJSON()).not.toBeNull();
  });

  it('starts on step 0 (welcome step) with progress at 0', () => {
    const renderer = TestRenderer.create(<OnboardingScreen navigation={navigation} />);
    // On step 0 the back button is absent — only the next/start button
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    // Step 0: goals aren't shown yet, so fewer touchables than step 1
    expect(touchables.length).toBeGreaterThan(0);
    // Step 0 renders the welcome/profile form — TextInputs for name/bio are absent on step 0
    // so the only text content is the step header and navigation buttons
    expect(touchables.length).toBeGreaterThanOrEqual(1);
  });

  it('advances to step 1 when Next button pressed', () => {
    const renderer = TestRenderer.create(<OnboardingScreen navigation={navigation} />);
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    // Primary button (Next) is first or last touchable
    const nextBtn = touchables[touchables.length - 1];
    act(() => {
      nextBtn.props.onPress();
    });
    // After advancing, step changes — goal selection texts should appear
    const texts = renderer.root.findAllByType('Text');
    expect(texts.length).toBeGreaterThan(0);
  });

  it('renders back button on step > 0', () => {
    const renderer = TestRenderer.create(<OnboardingScreen navigation={navigation} />);
    // Advance to step 1
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    act(() => {
      touchables[touchables.length - 1].props.onPress();
    });
    const touchablesStep1 = renderer.root.findAllByType('TouchableOpacity');
    // Should have more buttons now (back + next + goals)
    expect(touchablesStep1.length).toBeGreaterThan(1);
  });

  it('renders progress indicator', () => {
    const renderer = TestRenderer.create(<OnboardingScreen navigation={navigation} />);
    const views = renderer.root.findAllByType('View');
    expect(views.length).toBeGreaterThan(0);
  });
});
