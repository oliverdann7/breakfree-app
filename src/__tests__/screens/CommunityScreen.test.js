import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import CommunityScreen from '../../screens/Community/CommunityScreen';

let mockState;
const mockDispatch = jest.fn(() => ({ unwrap: () => Promise.resolve({}) }));

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) => selector(mockState),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: 'tr' } }),
}));

// db:null forces the non-realtime fetchPosts path (no Firestore listener).
jest.mock('../../services/firebase', () => ({ db: null }));

jest.mock('../../store/slices/communitySlice', () => ({
  POSTS_PAGE_SIZE: 20,
  fetchPosts: jest.fn((args) => ({ type: 'community/fetchPosts', payload: args })),
  createPost: jest.fn((args) => ({ type: 'community/createPost', payload: args })),
  toggleLike: jest.fn((args) => ({ type: 'community/toggleLike', payload: args })),
  fetchComments: jest.fn((postId) => ({ type: 'community/fetchComments', payload: postId })),
  addComment: jest.fn((args) => ({ type: 'community/addComment', payload: args })),
  realtimePostsUpdate: jest.fn((args) => ({
    type: 'community/realtimePostsUpdate',
    payload: args,
  })),
  requestMorePosts: jest.fn(() => ({ type: 'community/requestMorePosts' })),
}));

jest.mock('../../store/slices/userSlice', () => ({
  updateProfile: jest.fn((args) => ({ type: 'user/updateProfile', payload: args })),
  updateProfileFirestore: jest.fn((args) => ({
    type: 'user/updateProfileFirestore',
    payload: args,
  })),
  fetchUserStats: jest.fn((uid) => ({ type: 'user/fetchUserStats', payload: uid })),
}));

jest.mock('../../store/slices/challengesSlice', () => ({
  fetchActiveChallenges: jest.fn((uid) => ({
    type: 'challenges/fetchActiveChallenges',
    payload: uid,
  })),
  joinChallenge: jest.fn((args) => ({ type: 'challenges/joinChallenge', payload: args })),
}));

// These cards pull their own data; irrelevant to the post flow under test.
jest.mock('../../components/features/LeaderboardCard', () => () => null);
jest.mock('../../components/features/HealthStatusCard', () => () => null);

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

const POST = {
  postId: 'p1',
  author: 'Zeynep',
  time: '2s',
  text: 'Bugün 10k adım!',
  likes: 3,
  liked: false,
  emoji: '🏃',
  bg: '#123456',
};

const renderScreen = () => {
  let renderer;
  act(() => {
    renderer = TestRenderer.create(<CommunityScreen />);
  });
  return renderer;
};

describe('CommunityScreen — post flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      auth: { user: { uid: 'u1', displayName: 'Dan' } },
      user: {
        profile: { nickname: 'Dan', avatarEmoji: '🧘', avatarBg: '#111111' },
        stats: { streak: 3, totalTalks: 5 },
      },
      metrics: {
        dailyMetrics: { steps: 8000, sleep: { hours: 7 }, heartRate: 62, calories: 2100 },
        wellnessScore: 81,
      },
      community: {
        posts: [POST],
        commentsByPost: {},
        loadingMorePosts: false,
        hasMorePosts: true,
      },
      challenges: { challenges: [], userParticipation: {}, loading: false },
    };
  });

  it('fetches stats, challenges and posts on mount', () => {
    renderScreen();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/fetchUserStats', payload: 'u1' });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'challenges/fetchActiveChallenges',
      payload: 'u1',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'community/fetchPosts',
      payload: { uid: 'u1', pageSize: 20 },
    });
  });

  it('creates a post with the composed text and author profile', () => {
    const renderer = renderScreen();
    const composer = findInputByPlaceholder(renderer.root, 'community.postPlaceholder');
    act(() => {
      composer.props.onChangeText('  Merhaba topluluk!  ');
    });
    const postBtn = findButtonByText(renderer.root, 'community.postBtn');
    act(() => {
      postBtn.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'community/createPost',
      payload: expect.objectContaining({
        uid: 'u1',
        authorName: 'Dan',
        authorEmoji: '🧘',
        text: 'Merhaba topluluk!',
        sharedStats: null,
      }),
    });
  });

  it('attaches shared stats to the post when the toggle is on', () => {
    const renderer = renderScreen();
    const composer = findInputByPlaceholder(renderer.root, 'community.postPlaceholder');
    act(() => {
      composer.props.onChangeText('Skorumu paylaşıyorum');
    });
    const toggle = findButtonByText(renderer.root, 'community.shareStatsLabel');
    act(() => {
      toggle.props.onPress();
    });
    const postBtn = findButtonByText(renderer.root, 'community.postBtn');
    act(() => {
      postBtn.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'community/createPost',
      payload: expect.objectContaining({
        sharedStats: { wellness: 81, steps: 8000, sleep: 7 },
      }),
    });
  });

  it('does not create a post from empty text', () => {
    const renderer = renderScreen();
    const postBtn = findButtonByText(renderer.root, 'community.postBtn');
    act(() => {
      postBtn.props.onPress();
    });
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'community/createPost' })
    );
  });

  it('toggles like on a feed post for the signed-in user', () => {
    const renderer = renderScreen();
    const flatList = renderer.root.findByType('FlatList');
    let card;
    act(() => {
      card = TestRenderer.create(flatList.props.renderItem({ item: POST }));
    });
    const likeBtn = findButtonByText(card.root, '🤍');
    act(() => {
      likeBtn.props.onPress();
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'community/toggleLike',
      payload: { postId: 'p1', uid: 'u1', currentlyLiked: false },
    });
  });

  it('requests more posts when the end of the feed is reached', () => {
    const renderer = renderScreen();
    const flatList = renderer.root.findByType('FlatList');
    act(() => {
      flatList.props.onEndReached();
    });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'community/requestMorePosts' });
  });
});
