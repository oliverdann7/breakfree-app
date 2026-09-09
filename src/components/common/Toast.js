import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/designTokens';

// Module-level registry so any screen or callback can raise a toast without
// prop drilling or extra context providers. ToastHost (mounted once at each
// app root) subscribes here.
const listeners = new Set();

const AUTO_HIDE_MS = 3500;
const AUTO_HIDE_WITH_ACTION_MS = 6000;

/**
 * Show a transient toast. Options:
 *   actionLabel / onAction — render a tappable action (e.g. a retry button).
 */
export function showToast(message, options = {}) {
  listeners.forEach((notify) => notify({ message, ...options }));
}

export function ToastHost() {
  const [toast, setToast] = useState(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    // Each toast carries its own zero-valued opacity, so every one fades in
    // from scratch — including a repeat of the same message.
    const notify = (next) => setToast({ ...next, opacity: new Animated.Value(0) });
    listeners.add(notify);
    return () => {
      listeners.delete(notify);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    Animated.timing(toast.opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const ms = toast.onAction ? AUTO_HIDE_WITH_ACTION_MS : AUTO_HIDE_MS;
    hideTimer.current = setTimeout(() => setToast(null), ms);
    return () => clearTimeout(hideTimer.current);
  }, [toast]);

  if (!toast) return null;

  const handleAction = () => {
    const action = toast.onAction;
    setToast(null);
    if (action) action();
  };

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Animated.View
        style={[styles.toast, { opacity: toast.opacity }]}
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
      >
        <Text style={styles.message}>{toast.message}</Text>
        {toast.onAction && toast.actionLabel ? (
          <TouchableOpacity onPress={handleAction} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.action}>{toast.actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // The web app scrolls the document, where CSS `absolute` would anchor the
    // toast to the page bottom (off-screen on long pages); `fixed` pins it to
    // the viewport. react-native-web supports 'fixed'; native keeps absolute.
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    maxWidth: '90%',
    backgroundColor: colors.navy,
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  message: { color: colors.textPrimary, fontSize: 13, flexShrink: 1 },
  action: { color: colors.cyan, fontSize: 13, fontWeight: '700' },
});
