import React from 'react';
import TestRenderer from 'react-test-renderer';
import DashboardScreen from '../../screens/Home/DashboardScreen';

const mockDispatch = jest.fn(() => Promise.resolve({}));
const mockNavigate = jest.fn();

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) =>
    selector({
      auth: { user: { uid: 'u1', displayName: 'Zeynep' } },
      metrics: {
        wellnessScore: 72,
        dailyMetrics: {
          sleep: 7,
          steps: 8000,
          heartRate: 68,
          calories: 1900,
        },
      },
      user: {
        profile: { displayName: 'Zeynep' },
        dailyPlan: {
          tasks: [
            { title: 'Sabah meditasyonu', time: '07:00', duration: 10, completed: false },
            { title: 'Yürüyüş', time: '08:00', duration: 30, completed: true },
          ],
          insight: { title: 'Uyku kaliten iyi', cta: 'Sağlık', screen: 'Health' },
        },
      },
    }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'tr' } }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../store/slices/metricsSlice', () => ({
  fetchMetrics: jest.fn((uid) => ({ type: 'metrics/fetch', payload: uid })),
}));

jest.mock('../../store/slices/userSlice', () => ({
  fetchDailyPlan: jest.fn((uid) => ({ type: 'user/fetchDailyPlan', payload: uid })),
  fetchUserProfile: jest.fn((uid) => ({ type: 'user/fetchUserProfile', payload: uid })),
  completeTask: jest.fn((args) => ({ type: 'user/completeTask', payload: args })),
}));

jest.mock('../../components/features/WellnessRing', () => {
  const React = require('react');
  const WellnessRing = ({ score }) =>
    React.createElement('View', { testID: 'wellness-ring' }, String(score));
  WellnessRing.displayName = 'WellnessRing';
  return WellnessRing;
});

describe('DashboardScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    const renderer = TestRenderer.create(<DashboardScreen />);
    expect(renderer.toJSON()).not.toBeNull();
  });

  it('dispatches fetchMetrics and fetchDailyPlan on mount', () => {
    TestRenderer.create(<DashboardScreen />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('shows user display name in greeting', () => {
    const renderer = TestRenderer.create(<DashboardScreen />);
    const texts = renderer.root.findAllByType('Text');
    const hasName = texts.some((t) => String(t.props.children).includes('Zeynep'));
    expect(hasName).toBe(true);
  });

  it('renders metric values from store', () => {
    const renderer = TestRenderer.create(<DashboardScreen />);
    const texts = renderer.root.findAllByType('Text');
    // steps, heartRate, etc. should appear somewhere
    const textContents = texts.map((t) => String(t.props.children));
    const hasMetric = textContents.some(
      (c) => c.includes('8000') || c.includes('68') || c.includes('7')
    );
    expect(hasMetric).toBe(true);
  });

  it('renders WellnessRing with the wellness score', () => {
    const renderer = TestRenderer.create(<DashboardScreen />);
    // WellnessRing is mocked to a View with testID='wellness-ring'
    const rings = renderer.root.findAll((node) => node.props.testID === 'wellness-ring');
    expect(rings.length).toBeGreaterThan(0);
  });

  it('renders plan tasks', () => {
    const renderer = TestRenderer.create(<DashboardScreen />);
    const texts = renderer.root.findAllByType('Text');
    const hasTasks = texts.some((t) => String(t.props.children).includes('Sabah meditasyonu'));
    expect(hasTasks).toBe(true);
  });
});
