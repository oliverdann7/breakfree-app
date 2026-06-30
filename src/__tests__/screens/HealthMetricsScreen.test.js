import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import HealthMetricsScreen from '../../screens/Health/HealthMetricsScreen';

const mockDispatch = jest.fn(() => Promise.resolve({}));

const mockMetrics = {
  wellnessScore: 68,
  dailyMetrics: {
    sleep: 7,
    steps: 6500,
    heartRate: 72,
    calories: 1800,
    hydration: 5,
    mood: 4,
  },
  weeklyData: [
    { day: 'Pzt', score: 60 },
    { day: 'Sal', score: 65 },
    { day: 'Çar', score: 70 },
    { day: 'Per', score: 68 },
    { day: 'Cum', score: 72 },
    { day: 'Cmt', score: 58 },
    { day: 'Paz', score: 68 },
  ],
};

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) =>
    selector({
      auth: { user: { uid: 'u1' } },
      metrics: mockMetrics,
    }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'tr' } }),
}));

jest.mock('../../store/slices/metricsSlice', () => ({
  fetchMetrics: jest.fn((uid) => ({ type: 'metrics/fetch', payload: uid })),
  logMetric: jest.fn((args) => ({ type: 'metrics/log', payload: args })),
}));

// Victory native charts need a stub
jest.mock('victory-native', () => {
  const React = require('react');
  return {
    VictoryBar: () => React.createElement('View', null),
    VictoryChart: ({ children }) => React.createElement('View', null, children),
    VictoryTheme: { material: {} },
    VictoryAxis: () => React.createElement('View', null),
  };
});

describe('HealthMetricsScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    const renderer = TestRenderer.create(<HealthMetricsScreen />);
    expect(renderer.toJSON()).not.toBeNull();
  });

  it('dispatches fetchMetrics on mount', () => {
    TestRenderer.create(<HealthMetricsScreen />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('displays the wellness score', () => {
    const renderer = TestRenderer.create(<HealthMetricsScreen />);
    const texts = renderer.root.findAllByType('Text');
    const hasScore = texts.some((t) => String(t.props.children).includes('68'));
    expect(hasScore).toBe(true);
  });

  it('renders metric breakdown values', () => {
    const renderer = TestRenderer.create(<HealthMetricsScreen />);
    const texts = renderer.root.findAllByType('Text');
    const contents = texts.map((t) => String(t.props.children));
    const hasSleep = contents.some((c) => c.includes('7'));
    const hasSteps = contents.some((c) => c.includes('6500') || c.includes('6,500'));
    expect(hasSleep || hasSteps).toBe(true);
  });

  it('has a log button that opens the modal', () => {
    const renderer = TestRenderer.create(<HealthMetricsScreen />);
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    // Log button exists (header area)
    expect(touchables.length).toBeGreaterThan(0);
    // Press the first touchable to open the modal
    act(() => {
      touchables[0].props.onPress();
    });
    // Modal should now be visible — Modal component should exist
    const modals = renderer.root.findAllByType('Modal');
    expect(modals.length).toBeGreaterThan(0);
  });

  it('modal contains mood selector', () => {
    const renderer = TestRenderer.create(<HealthMetricsScreen />);
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    act(() => {
      touchables[0].props.onPress();
    });
    const texts = renderer.root.findAllByType('Text');
    // Mood emojis or mood label should appear
    const hasMood = texts.some(
      (t) =>
        ['😔', '😕', '😐', '🙂', '😄'].includes(String(t.props.children)) ||
        String(t.props.children).includes('mood') ||
        String(t.props.children).includes('Ruh')
    );
    expect(hasMood).toBe(true);
  });
});
