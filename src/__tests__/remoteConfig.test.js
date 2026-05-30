import { get, getBool, getNumber, getString, __defaults } from '../services/remoteConfig';

describe('remoteConfig defaults', () => {
  it('returns featureFlags + tunable defaults', () => {
    expect(__defaults).toHaveProperty('paywall_trial_days', 7);
    expect(__defaults).toHaveProperty('challenge_carousel_max', 3);
    expect(__defaults).toHaveProperty('mentor_directory_pagesize', 12);
    expect(__defaults).toHaveProperty('experiment_v1', 'control');
  });

  it('get reads defaults when not initialized', () => {
    expect(get('paywall_trial_days')).toBe(7);
    expect(get('experiment_v1')).toBe('control');
  });

  it('getBool / getNumber / getString coerce types', () => {
    expect(getNumber('paywall_trial_days')).toBe(7);
    expect(getString('experiment_v1')).toBe('control');
    expect(getBool('dataExport')).toBe(true);
  });

  it('unknown key returns sensible falsy', () => {
    expect(get('nope')).toBeUndefined();
    expect(getNumber('nope')).toBe(0);
  });
});
