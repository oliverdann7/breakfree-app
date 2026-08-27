import React from 'react';
import TestRenderer from 'react-test-renderer';
import Icon, { ICON_NAMES } from '../../components/web/Icons';
import ProfileTab from '../../components/web/WebProfileTab';
import HomeTab from '../../components/web/WebHomeTab';
import HealthTab from '../../components/web/WebHealthTab';

const user = { displayName: 'Test User', email: 'test@example.com' };
const weeklyData = [{ wellnessScore: 80, steps: 8000, sleep: 7, heartRate: 60 }];
const metrics = { dailyMetrics: null };

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

describe('web Icon set', () => {
  it('renders an svg for every registered icon name', () => {
    expect(ICON_NAMES.length).toBeGreaterThan(20);
    for (const name of ICON_NAMES) {
      const tree = TestRenderer.create(<Icon name={name} />).toJSON();
      expect(tree.type).toBe('svg');
    }
  });

  it('renders nothing for an unknown name', () => {
    expect(TestRenderer.create(<Icon name="does-not-exist" />).toJSON()).toBeNull();
  });

  it('supports fill for active states', () => {
    const tree = TestRenderer.create(<Icon name="heart" filled color="#C9961A" />).toJSON();
    expect(tree.props.fill).toBe('#C9961A');
    expect(tree.props.stroke).toBe('#C9961A');
  });
});

describe('dashboard tabs use icons, not emoji, for UI chrome', () => {
  const cases = [
    ['ProfileTab', <ProfileTab key="p" user={user} onLogout={() => {}} weeklyData={weeklyData} />],
    [
      'HomeTab',
      <HomeTab
        key="h"
        user={user}
        metrics={metrics}
        weeklyData={weeklyData}
        wellnessScore={70}
        loading={false}
        onLogMetrics={() => {}}
      />,
    ],
    [
      'HealthTab',
      <HealthTab
        key="s"
        metrics={metrics}
        weeklyData={weeklyData}
        wellnessScore={70}
        loading={false}
      />,
    ],
  ];

  it.each(cases)('%s renders svg icons and no emoji codepoints', (_name, element) => {
    const serialized = JSON.stringify(TestRenderer.create(element).toJSON());
    expect(serialized).toContain('"svg"');
    expect(EMOJI.test(serialized)).toBe(false);
  });
});
