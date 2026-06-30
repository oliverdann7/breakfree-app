import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import TalkDetailScreen from '../../screens/Talks/TalkDetailScreen';

const mockDispatch = jest.fn(() => Promise.resolve({}));

const liveTalk = {
  id: 't1',
  title: 'Stres Yönetimi',
  description: 'Günlük stresle başa çıkma teknikleri.',
  status: 'live',
  category: 'mindfulness',
  host: { name: 'Dr. Ayşe', title: 'Psikolog' },
  speakerCount: 42,
  scheduledAt: null,
};

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) => selector({ talks: { currentTalk: liveTalk } }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'tr' } }),
}));

jest.mock('../../store/slices/talksSlice', () => ({
  fetchTalkById: jest.fn((id) => ({ type: 'talks/fetchById', payload: id })),
  clearCurrentTalk: jest.fn(() => ({ type: 'talks/clearCurrentTalk' })),
  joinTalk: jest.fn((id) => ({ type: 'talks/join', payload: id })),
}));

const mockGoBack = jest.fn();
const navigation = { goBack: mockGoBack };
const route = { params: { talkId: 't1' } };

describe('TalkDetailScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    const renderer = TestRenderer.create(
      <TalkDetailScreen navigation={navigation} route={route} />
    );
    expect(renderer.toJSON()).not.toBeNull();
  });

  it('dispatches fetchTalkById on mount', () => {
    TestRenderer.create(<TalkDetailScreen navigation={navigation} route={route} />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('displays the talk title', () => {
    const renderer = TestRenderer.create(
      <TalkDetailScreen navigation={navigation} route={route} />
    );
    const texts = renderer.root.findAllByType('Text');
    const hasTitle = texts.some((t) => String(t.props.children).includes('Stres Yönetimi'));
    expect(hasTitle).toBe(true);
  });

  it('displays host name', () => {
    const renderer = TestRenderer.create(
      <TalkDetailScreen navigation={navigation} route={route} />
    );
    const texts = renderer.root.findAllByType('Text');
    const hasHost = texts.some((t) => String(t.props.children).includes('Dr. Ayşe'));
    expect(hasHost).toBe(true);
  });

  it('shows live status badge', () => {
    const renderer = TestRenderer.create(
      <TalkDetailScreen navigation={navigation} route={route} />
    );
    const texts = renderer.root.findAllByType('Text');
    // Status badge shows 'CANLI' or 'talks.live' key
    const hasLive = texts.some(
      (t) => String(t.props.children).includes('CANLI') || String(t.props.children).includes('live')
    );
    expect(hasLive).toBe(true);
  });

  it('back button calls navigation.goBack', () => {
    const renderer = TestRenderer.create(
      <TalkDetailScreen navigation={navigation} route={route} />
    );
    const touchables = renderer.root.findAllByType('TouchableOpacity');
    act(() => {
      touchables[0].props.onPress();
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders loading state gracefully when currentTalk is null', () => {
    jest
      .spyOn(require('../../store/hooks'), 'useAppSelector')
      .mockImplementation((selector) => selector({ talks: { currentTalk: null } }));
    // Should not throw — renders a loader/null state
    expect(() =>
      TestRenderer.create(<TalkDetailScreen navigation={navigation} route={route} />)
    ).not.toThrow();
  });
});
