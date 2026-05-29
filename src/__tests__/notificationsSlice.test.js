import notificationsReducer, {
  setPushToken,
  setPermission,
  pushLocal,
} from '../store/slices/notificationsSlice';

const initial = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pushToken: null,
  permissionGranted: false,
};

describe('notificationsSlice', () => {
  it('returns initial state', () => {
    expect(notificationsReducer(undefined, { type: 'unknown' })).toEqual(initial);
  });

  it('setPushToken / setPermission', () => {
    let s = notificationsReducer(initial, setPushToken('expo-token-x'));
    expect(s.pushToken).toBe('expo-token-x');
    s = notificationsReducer(s, setPermission(true));
    expect(s.permissionGranted).toBe(true);
  });

  it('pushLocal prepends and increments unread', () => {
    let s = notificationsReducer(initial, pushLocal({ id: 'n1', read: false, title: 'A' }));
    expect(s.items[0].id).toBe('n1');
    expect(s.unreadCount).toBe(1);
    s = notificationsReducer(s, pushLocal({ id: 'n2', read: true, title: 'B' }));
    expect(s.items[0].id).toBe('n2');
    expect(s.unreadCount).toBe(1);
  });

  it('fetchNotifications.fulfilled sets items + unreadCount', () => {
    const items = [
      { id: 'a', read: false },
      { id: 'b', read: true },
      { id: 'c', read: false },
    ];
    const s = notificationsReducer(initial, {
      type: 'notifications/fetch/fulfilled',
      payload: items,
    });
    expect(s.items).toEqual(items);
    expect(s.unreadCount).toBe(2);
  });

  it('markRead decrements unreadCount only on first read', () => {
    const seeded = {
      ...initial,
      items: [{ id: 'a', read: false }],
      unreadCount: 1,
    };
    let s = notificationsReducer(seeded, {
      type: 'notifications/markRead/fulfilled',
      payload: 'a',
    });
    expect(s.items[0].read).toBe(true);
    expect(s.unreadCount).toBe(0);
    s = notificationsReducer(s, {
      type: 'notifications/markRead/fulfilled',
      payload: 'a',
    });
    expect(s.unreadCount).toBe(0);
  });

  it('markAllRead zeros unread + flips all items', () => {
    const seeded = {
      ...initial,
      items: [
        { id: 'a', read: false },
        { id: 'b', read: false },
      ],
      unreadCount: 2,
    };
    const s = notificationsReducer(seeded, { type: 'notifications/markAllRead/fulfilled' });
    expect(s.unreadCount).toBe(0);
    expect(s.items.every((i) => i.read)).toBe(true);
  });
});
