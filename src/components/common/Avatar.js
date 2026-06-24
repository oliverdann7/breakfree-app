import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/designTokens';

/**
 * Shared emoji avatar. Replaces the three near-identical local `Avatar`
 * implementations previously duplicated in HealthStatusCard, LeaderboardCard
 * and CommunityScreen.
 *
 * @param {string} emoji - emoji glyph to render (falls back to 🧘)
 * @param {string} bg    - background colour (falls back to royal)
 * @param {number} size  - diameter in px (default 40)
 * @param {string} label - accessibilityLabel; defaults to a generic value
 */
export default function Avatar({ emoji = '🧘', bg = colors.royal, size = 40, label, style }) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label || 'Kullanıcı avatarı'}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.44 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
});
