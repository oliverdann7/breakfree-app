import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../constants/designTokens';

export default function Skeleton({ width, height, borderRadius = 8, style }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
}

// Compound presets for common layouts
Skeleton.TalkCard = function TalkCardSkeleton() {
  return (
    <View style={skeletonStyles.talkCard}>
      <Skeleton width={80} height={80} borderRadius={12} />
      <View style={skeletonStyles.talkInfo}>
        <Skeleton width={60} height={12} />
        <Skeleton width={160} height={16} style={{ marginTop: 6 }} />
        <Skeleton width={100} height={12} style={{ marginTop: 4 }} />
        <Skeleton width={80} height={10} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
};

Skeleton.MetricCard = function MetricCardSkeleton() {
  return (
    <View style={skeletonStyles.metricCard}>
      <Skeleton width={36} height={36} borderRadius={10} />
      <Skeleton width={60} height={24} style={{ marginTop: 8 }} />
      <Skeleton width={40} height={10} style={{ marginTop: 4 }} />
      <Skeleton width={50} height={12} style={{ marginTop: 4 }} />
    </View>
  );
};

Skeleton.PostCard = function PostCardSkeleton() {
  return (
    <View style={skeletonStyles.postCard}>
      <View style={skeletonStyles.postHeader}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={{ gap: 6 }}>
          <Skeleton width={100} height={13} />
          <Skeleton width={60} height={10} />
        </View>
      </View>
      <Skeleton width="100%" height={14} style={{ marginTop: 12 }} />
      <Skeleton width="80%" height={14} style={{ marginTop: 6 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});

const skeletonStyles = StyleSheet.create({
  talkCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  talkInfo: { flex: 1, gap: 2 },
  metricCard: {
    width: '47%',
    padding: 14,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postCard: {
    padding: 16,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
