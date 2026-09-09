import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Alert } from 'react-native';
import MentorDetailScreen from '../../screens/Mentor/MentorDetailScreen';

let mockState;
const mockDispatch = jest.fn(() => ({ unwrap: () => Promise.resolve({}) }));

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) => selector(mockState),
}));

jest.mock('../../services/firebase', () => ({ db: {} }));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'tr' } }),
}));

const mockAddDoc = jest.fn(() => Promise.resolve({ id: 'session-1' }));
jest.mock('firebase/firestore', () => ({
  addDoc: (...args) => mockAddDoc(...args),
  collection: jest.fn(() => 'sessions-ref'),
}));

jest.mock('../../store/slices/mentorSlice', () => ({
  fetchMentorProfile: jest.fn((id) => ({ type: 'mentor/fetchMentorProfile', payload: id })),
}));

const textOf = (node) => {
  const flat = (c) => (Array.isArray(c) ? c.map(flat).join('') : String(c ?? ''));
  return flat(node.props.children);
};
const findButtonByText = (root, text) =>
  root
    .findAll((n) => n.type === 'TouchableOpacity')
    .find((btn) => btn.findAll((n) => n.type === 'Text').some((t) => textOf(t).includes(text)));

// Every weekday is available so slots exist whichever day the suite runs.
const ALL_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].reduce(
  (acc, day) => ({ ...acc, [day]: ['10:00', '14:00'] }),
  {}
);

const MENTOR = {
  id: 'm1',
  name: 'Dr. Ayşe Demir',
  title: 'Uyku ve Wellness Mentoru',
  avatarEmoji: '🌿',
  avatarBg: '#111111',
  bio: 'Uyku hijyeni uzmanı.',
  experience: '8 yıl',
  specialties: ['Uyku', 'Stres'],
  rating: 4.8,
  reviewCount: 24,
  priceTryPerSession: 250,
  availability: ALL_WEEK,
};

const navigation = { navigate: jest.fn(), goBack: jest.fn() };
const route = { params: { mentorId: 'm1' } };

const renderScreen = (props = {}) => {
  let renderer;
  act(() => {
    renderer = TestRenderer.create(
      <MentorDetailScreen navigation={navigation} route={route} {...props} />
    );
  });
  return renderer;
};

const selectFirstSlot = (renderer) => {
  const dayPill = findButtonByText(renderer.root, 'mentor.today');
  act(() => {
    dayPill.props.onPress();
  });
  const hourBtn = findButtonByText(renderer.root, '10:00');
  act(() => {
    hourBtn.props.onPress();
  });
};

describe('MentorDetailScreen — booking flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      auth: { user: { uid: 'u1' } },
      mentor: { allMentors: [MENTOR], mentorProfile: null },
    };
  });

  it('renders the mentor profile and price CTA', () => {
    const renderer = renderScreen();
    const texts = renderer.root.findAllByType('Text').map(textOf);
    expect(texts).toContain('Dr. Ayşe Demir');
    expect(texts).toContain('₺250 · mentor.bookSession');
  });

  it('fetches the profile when the mentor is not loaded yet', () => {
    mockState.mentor.allMentors = [];
    const renderer = renderScreen();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mentor/fetchMentorProfile',
      payload: 'm1',
    });
    const texts = renderer.root.findAllByType('Text').map(textOf);
    expect(texts).toContain('common.loading');
  });

  it('keeps the CTA disabled until a day and hour are picked', () => {
    const renderer = renderScreen();
    const cta = findButtonByText(renderer.root, 'mentor.bookSession');
    expect(cta.props.disabled).toBe(true);
    selectFirstSlot(renderer);
    expect(findButtonByText(renderer.root, 'mentor.bookSession').props.disabled).toBe(false);
  });

  it('books a pending 30-minute session for the picked slot', async () => {
    const renderer = renderScreen();
    selectFirstSlot(renderer);
    const cta = findButtonByText(renderer.root, 'mentor.bookSession');
    await act(async () => {
      cta.props.onPress();
    });
    expect(mockAddDoc).toHaveBeenCalledWith(
      'sessions-ref',
      expect.objectContaining({
        uid: 'u1',
        mentorId: 'm1',
        mentorName: 'Dr. Ayşe Demir',
        duration: 30,
        status: 'pending',
        scheduledFor: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T10:00:00\+03:00$/),
      })
    );
    expect(Alert.alert).toHaveBeenCalledWith('mentor.bookedTitle', expect.any(String));
  });

  it('resets the selection after a successful booking', async () => {
    const renderer = renderScreen();
    selectFirstSlot(renderer);
    const cta = findButtonByText(renderer.root, 'mentor.bookSession');
    await act(async () => {
      cta.props.onPress();
    });
    expect(findButtonByText(renderer.root, 'mentor.bookSession').props.disabled).toBe(true);
  });

  it('surfaces booking failures in an alert', async () => {
    mockAddDoc.mockRejectedValueOnce(new Error('permission-denied'));
    const renderer = renderScreen();
    selectFirstSlot(renderer);
    const cta = findButtonByText(renderer.root, 'mentor.bookSession');
    await act(async () => {
      cta.props.onPress();
    });
    expect(Alert.alert).toHaveBeenCalledWith('common.error', 'permission-denied');
  });

  it('does not book when signed out', async () => {
    mockState.auth.user = null;
    const renderer = renderScreen();
    selectFirstSlot(renderer);
    const cta = findButtonByText(renderer.root, 'mentor.bookSession');
    await act(async () => {
      cta.props.onPress();
    });
    expect(mockAddDoc).not.toHaveBeenCalled();
  });
});
