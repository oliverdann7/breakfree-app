import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import MentorScreen from '../../screens/Mentor/MentorScreen';

let mockState;
const mockDispatch = jest.fn(() => ({ unwrap: () => Promise.resolve({}) }));

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) => selector(mockState),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'tr' } }),
}));

jest.mock('../../store/slices/mentorSlice', () => ({
  seedMentorProfile: jest.fn(() => ({ type: 'mentor/seedMentorProfile' })),
  fetchMentorAssignment: jest.fn((uid) => ({
    type: 'mentor/fetchMentorAssignment',
    payload: uid,
  })),
  fetchMentorProfile: jest.fn((id) => ({ type: 'mentor/fetchMentorProfile', payload: id })),
  fetchLatestMessage: jest.fn((uid) => ({ type: 'mentor/fetchLatestMessage', payload: uid })),
  sendMessage: jest.fn((args) => ({ type: 'mentor/sendMessage', payload: args })),
  toggleGoal: jest.fn((args) => ({ type: 'mentor/toggleGoal', payload: args })),
}));

const textOf = (node) => {
  const flat = (c) => (Array.isArray(c) ? c.map(flat).join('') : String(c ?? ''));
  return flat(node.props.children);
};
const findButtonByText = (root, text) =>
  root
    .findAll((n) => n.type === 'TouchableOpacity')
    .find((btn) => btn.findAll((n) => n.type === 'Text').some((t) => textOf(t).includes(text)));
const findInputByPlaceholder = (root, placeholder) =>
  root.findAll((n) => n.type === 'TextInput').find((i) => i.props.placeholder === placeholder);

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

const renderScreen = () => {
  let renderer;
  act(() => {
    renderer = TestRenderer.create(<MentorScreen navigation={navigation} />);
  });
  return renderer;
};

describe('MentorScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      auth: { user: { uid: 'u1' } },
      mentor: {
        assignment: { mentorId: 'm1' },
        mentorProfile: {
          name: 'Dr. Ayşe Demir',
          role: 'Wellness',
          avatarEmoji: '🌿',
          avatarBg: '#111',
        },
        latestMessage: { text: 'Bu hafta harika gidiyorsun!', timeAgo: '2s önce' },
        goals: [
          { text: '22:30 ekran kapatma', done: true },
          { text: '10 dk meditasyon', done: false },
        ],
        focusTitle: 'Uyku kalitesi',
        nextSession: {
          day: 'Paz',
          date: '12',
          title: 'Haftalık seans',
          time: '10:00',
          duration: '30 dk',
        },
      },
    };
  });

  it('loads the assignment, profile seed and latest message on mount', () => {
    renderScreen();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'mentor/seedMentorProfile' });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mentor/fetchMentorAssignment',
      payload: 'u1',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mentor/fetchLatestMessage',
      payload: 'u1',
    });
  });

  it('renders the assigned mentor name', () => {
    const renderer = renderScreen();
    const texts = renderer.root.findAllByType('Text').map(textOf);
    expect(texts).toContain('Dr. Ayşe Demir');
  });

  it('routes booking actions to the assigned mentor detail', () => {
    const renderer = renderScreen();
    const scheduleBtn = findButtonByText(renderer.root, 'mentor.schedule');
    act(() => {
      scheduleBtn.props.onPress();
    });
    expect(navigation.navigate).toHaveBeenCalledWith('MentorDetail', { mentorId: 'm1' });
  });

  it('routes booking to the directory when no mentor is assigned', () => {
    mockState.mentor.assignment = null;
    const renderer = renderScreen();
    const sessionBtn = findButtonByText(renderer.root, 'mentor.session');
    act(() => {
      sessionBtn.props.onPress();
    });
    expect(navigation.navigate).toHaveBeenCalledWith('MentorDirectory');
  });

  it('opens the chat modal from the chat action', () => {
    const renderer = renderScreen();
    expect(renderer.root.findByType('Modal').props.visible).toBe(false);
    const chatBtn = findButtonByText(renderer.root, 'mentor.chat');
    act(() => {
      chatBtn.props.onPress();
    });
    expect(renderer.root.findByType('Modal').props.visible).toBe(true);
  });

  it('sends a chat message and clears the input', () => {
    const renderer = renderScreen();
    const input = findInputByPlaceholder(renderer.root, 'mentor.messagePlaceholder');
    act(() => {
      input.props.onChangeText('Merhaba hocam');
    });
    const sendBtn = findButtonByText(renderer.root, '→');
    act(() => {
      sendBtn.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mentor/sendMessage',
      payload: { uid: 'u1', text: 'Merhaba hocam' },
    });
    expect(findInputByPlaceholder(renderer.root, 'mentor.messagePlaceholder').props.value).toBe('');
  });

  it('does not send an empty chat message', () => {
    const renderer = renderScreen();
    const sendBtn = findButtonByText(renderer.root, '→');
    act(() => {
      sendBtn.props.onPress();
    });
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'mentor/sendMessage' })
    );
  });

  it('toggles a weekly goal for the signed-in user', () => {
    const renderer = renderScreen();
    const goalBtn = findButtonByText(renderer.root, '10 dk meditasyon');
    act(() => {
      goalBtn.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mentor/toggleGoal',
      payload: { uid: 'u1', goalIndex: 1 },
    });
  });
});
