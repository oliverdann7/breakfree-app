import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import PremiumScreen from '../../screens/Premium/PremiumScreen';
import { PLANS } from '../../store/slices/premiumSlice';

let mockState;
const mockDispatch = jest.fn(() => ({ unwrap: () => Promise.resolve({}) }));

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) => selector(mockState),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'tr' } }),
}));

jest.mock('../../store/slices/premiumSlice', () => {
  const actual = jest.requireActual('../../store/slices/premiumSlice');
  return {
    ...actual,
    fetchSubscription: jest.fn((uid) => ({ type: 'premium/fetchSubscription', payload: uid })),
    subscribe: jest.fn((args) => ({ type: 'premium/subscribe', payload: args })),
    cancelSubscription: jest.fn(() => ({ type: 'premium/cancelSubscription' })),
  };
});

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

// Deep-flattens Text children so template strings and arrays compare alike.
const textOf = (node) => {
  const flat = (c) => (Array.isArray(c) ? c.map(flat).join('') : String(c ?? ''));
  return flat(node.props.children);
};
const findButtonByText = (root, text) =>
  root
    .findAll((n) => n.type === 'TouchableOpacity')
    .find((btn) => btn.findAll((n) => n.type === 'Text').some((t) => textOf(t).includes(text)));

const renderScreen = () => {
  let renderer;
  act(() => {
    renderer = TestRenderer.create(<PremiumScreen navigation={navigation} />);
  });
  return renderer;
};

describe('PremiumScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      auth: { user: { uid: 'u1' } },
      premium: { subscription: null, loading: false },
    };
  });

  it('fetches the subscription for the signed-in user on mount', () => {
    renderScreen();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'premium/fetchSubscription',
      payload: 'u1',
    });
  });

  it('shows a spinner while the subscription is loading', () => {
    mockState.premium.loading = true;
    const renderer = renderScreen();
    expect(renderer.root.findAllByType('ActivityIndicator').length).toBeGreaterThan(0);
    expect(renderer.root.findAllByType('ScrollView')).toHaveLength(0);
  });

  it('renders every plan with its price', () => {
    const renderer = renderScreen();
    const texts = renderer.root.findAllByType('Text').map(textOf);
    PLANS.forEach((plan) => {
      expect(texts).toContain(plan.name);
      expect(texts).toContain(`₺${plan.price}`);
    });
  });

  it('subscribes to the annual plan by default', async () => {
    const renderer = renderScreen();
    const cta = findButtonByText(renderer.root, 'premium.subscribe');
    await act(async () => {
      cta.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'premium/subscribe',
      payload: { planId: 'pro_annual' },
    });
  });

  it('subscribes to the monthly plan after selecting it', async () => {
    const renderer = renderScreen();
    const monthly = PLANS.find((p) => p.id === 'pro_monthly');
    const monthlyCard = renderer.root
      .findAll((n) => n.type === 'TouchableOpacity')
      .find((btn) => btn.findAll((n) => n.type === 'Text').some((t) => textOf(t) === monthly.name));
    act(() => {
      monthlyCard.props.onPress();
    });
    const cta = findButtonByText(renderer.root, 'premium.subscribe');
    await act(async () => {
      cta.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'premium/subscribe',
      payload: { planId: 'pro_monthly' },
    });
  });

  it('does not subscribe when signed out', async () => {
    mockState.auth.user = null;
    const renderer = renderScreen();
    const cta = findButtonByText(renderer.root, 'premium.subscribe');
    await act(async () => {
      cta.props.onPress();
    });
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'premium/subscribe' })
    );
  });

  it('shows the active banner instead of plans for premium members', () => {
    mockState.premium.subscription = { status: 'active', renewAt: Date.now() };
    const renderer = renderScreen();
    const texts = renderer.root.findAllByType('Text').map(textOf);
    expect(texts).toContain('premium.active');
    expect(texts).not.toContain(PLANS[0].name);
  });

  it('dispatches cancelSubscription from the active banner', async () => {
    mockState.premium.subscription = { status: 'active', renewAt: Date.now() };
    const renderer = renderScreen();
    const cancel = findButtonByText(renderer.root, 'premium.cancel');
    await act(async () => {
      cancel.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'premium/cancelSubscription' });
  });
});
