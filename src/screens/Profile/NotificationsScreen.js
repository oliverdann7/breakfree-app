import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNotifications, markRead, markAllRead } from '../../store/slices/notificationsSlice';
import Icon from '../../components/common/Icon';
import { colors } from '../../constants/designTokens';

const ICONS = {
  talk: 'mic',
  mentor: 'handshake',
  challenge: 'trophy',
  badge: 'star',
  health: 'heart',
  system: 'bell',
};

function timeAgo(ts, t) {
  if (!ts) return '';
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return t('notifications.now');
  if (mins < 60) return t('notifications.mins', { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('notifications.hours', { count: hours });
  return t('notifications.days', { count: Math.floor(hours / 24) });
}

export default function NotificationsScreen({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { items, unreadCount, loading } = useAppSelector((s) => s.notifications);

  useEffect(() => {
    if (user?.uid) dispatch(fetchNotifications(user.uid));
  }, [user?.uid, dispatch]);

  const onItemPress = (n) => {
    if (!n.read && user?.uid) dispatch(markRead({ uid: user.uid, id: n.id }));
    if (n.data?.route && navigation?.navigate) {
      navigation.navigate(n.data.route, n.data.params || {});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => user?.uid && dispatch(fetchNotifications(user.uid))}
            tintColor={colors.cyan}
          />
        }
      >
        <View style={styles.header}>
          {navigation && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{t('notifications.title')}</Text>
            <Text style={styles.subtitle}>
              {unreadCount > 0
                ? t('notifications.unread', { count: unreadCount })
                : t('notifications.allRead')}
            </Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={() => user?.uid && dispatch(markAllRead(user.uid))}
              style={styles.markAll}
              accessibilityRole="button"
            >
              <Text style={styles.markAllText}>{t('notifications.markAll')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="bellOff" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>{t('notifications.empty')}</Text>
            <Text style={styles.emptyDesc}>{t('notifications.emptyDesc')}</Text>
          </View>
        ) : (
          items.map((n) => (
            <TouchableOpacity
              key={n.id}
              onPress={() => onItemPress(n)}
              activeOpacity={0.7}
              style={[styles.row, !n.read && styles.rowUnread]}
              accessibilityRole="button"
            >
              <Icon
                name={ICONS[n.type] || 'bell'}
                size={22}
                color={colors.textPrimary}
                style={styles.icon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{n.title}</Text>
                {n.body ? (
                  <Text style={styles.rowBody} numberOfLines={2}>
                    {n.body}
                  </Text>
                ) : null}
                <Text style={styles.rowTime}>
                  {timeAgo(n.createdAt, t)} {t('notifications.ago')}
                </Text>
              </View>
              {!n.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: colors.textPrimary, fontSize: 18 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.textTertiary, fontSize: 11, marginTop: 2 },
  markAll: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(20,184,212,0.15)',
    borderRadius: 999,
  },
  markAllText: { color: colors.cyan, fontSize: 11, fontWeight: '600' },

  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  rowUnread: { backgroundColor: 'rgba(20,184,212,0.07)' },
  icon: { marginTop: 2 },
  rowTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 13 },
  rowBody: { color: colors.textSecondary, fontSize: 12, marginTop: 3, lineHeight: 17 },
  rowTime: { color: colors.textTertiary, fontSize: 10, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cyan, marginTop: 6 },

  empty: { alignItems: 'center', padding: 40, gap: 10 },
  emptyTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 15 },
  emptyDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 240,
  },
});
