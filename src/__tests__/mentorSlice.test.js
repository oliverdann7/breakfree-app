import mentorReducer from '../store/slices/mentorSlice';

const initialState = {
  assignment: null,
  mentorProfile: null,
  latestMessage: null,
  messages: [],
  goals: [],
  focusTitle: '',
  nextSession: null,
  loading: false,
  error: null,
};

describe('mentorSlice', () => {
  it('returns initial state', () => {
    const state = mentorReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('handles fetchMentorAssignment.pending', () => {
    const state = mentorReducer(initialState, {
      type: 'mentor/fetchAssignment/pending',
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchMentorAssignment.fulfilled', () => {
    const assignment = {
      id: 'user123',
      mentorId: 'dr-ayse-demir',
      focusTitle: 'Akşam rutini',
      goals: [
        { text: 'Meditasyon', done: false },
        { text: 'Yoga', done: true },
      ],
      nextSession: {
        day: 'Pzt',
        date: 17,
        title: 'Görüntülü görüşme',
        time: '19:00',
        duration: '30dk',
      },
    };
    const state = mentorReducer(initialState, {
      type: 'mentor/fetchAssignment/fulfilled',
      payload: assignment,
    });
    expect(state.loading).toBe(false);
    expect(state.assignment).toEqual(assignment);
    expect(state.goals).toHaveLength(2);
    expect(state.focusTitle).toBe('Akşam rutini');
    expect(state.nextSession.day).toBe('Pzt');
  });

  it('handles fetchMentorAssignment.fulfilled with null payload', () => {
    const state = mentorReducer(initialState, {
      type: 'mentor/fetchAssignment/fulfilled',
      payload: null,
    });
    expect(state.loading).toBe(false);
    expect(state.assignment).toBeNull();
  });

  it('handles fetchMentorAssignment.rejected', () => {
    const state = mentorReducer(initialState, {
      type: 'mentor/fetchAssignment/rejected',
      payload: 'Not found',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Not found');
  });

  it('handles fetchMentorProfile.fulfilled', () => {
    const profile = {
      id: 'dr-ayse-demir',
      name: 'Dr. Ayşe Demir',
      role: 'Wellness · 8 yıl',
      avatarEmoji: '🌿',
    };
    const state = mentorReducer(initialState, {
      type: 'mentor/fetchProfile/fulfilled',
      payload: profile,
    });
    expect(state.mentorProfile).toEqual(profile);
  });

  it('handles fetchLatestMessage.fulfilled with message', () => {
    const msg = { text: 'Merhaba!', sender: 'mentor', timeAgo: '2sa önce' };
    const state = mentorReducer(initialState, {
      type: 'mentor/fetchLatestMessage/fulfilled',
      payload: msg,
    });
    expect(state.latestMessage).toEqual(msg);
  });

  it('handles fetchLatestMessage.fulfilled with null', () => {
    const state = mentorReducer(initialState, {
      type: 'mentor/fetchLatestMessage/fulfilled',
      payload: null,
    });
    expect(state.latestMessage).toBeNull();
  });

  it('handles sendMessage.fulfilled', () => {
    const existing = { ...initialState, messages: [] };
    const msg = { id: 'msg1', text: 'Merhaba', sender: 'user', timeAgo: 'Az önce' };
    const state = mentorReducer(existing, {
      type: 'mentor/sendMessage/fulfilled',
      payload: msg,
    });
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]).toEqual(msg);
    expect(state.latestMessage).toEqual(msg);
  });

  it('handles toggleGoal.fulfilled', () => {
    const existing = {
      ...initialState,
      goals: [
        { text: 'Goal 1', done: false },
        { text: 'Goal 2', done: false },
      ],
      assignment: {
        goals: [
          { text: 'Goal 1', done: false },
          { text: 'Goal 2', done: false },
        ],
      },
    };
    const state = mentorReducer(existing, {
      type: 'mentor/toggleGoal/fulfilled',
      payload: {
        goals: [
          { text: 'Goal 1', done: true },
          { text: 'Goal 2', done: false },
        ],
      },
    });
    expect(state.goals[0].done).toBe(true);
    expect(state.goals[1].done).toBe(false);
    expect(state.assignment.goals[0].done).toBe(true);
  });
});
