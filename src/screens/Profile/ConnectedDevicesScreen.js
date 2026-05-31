import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { connectSource, disconnectSource, syncDaily } from '../../store/slices/healthSlice';
import { getAvailableSources } from '../../services/healthService';
import { colors } from '../../constants/designTokens';

const SOURCE_ICONS = {
  appleHealth: '',
  googleFit: '🟢',
  garmin: '⌚',
};

function lastSyncLabel(ts) {
  if (!ts) return null;
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return 'şimdi senkronize edildi';
  if (mins < 60) return `${mins}dk önce senkronize edildi`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}sa önce senkronize edildi`;
  return `${Math.floor(hours / 24)}g önce senkronize edildi`;
}

export default function ConnectedDevicesScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { connectedSources, syncStatus, lastSync } = useAppSelector((s) => s.health);
  const sources = getAvailableSources();

  const isConnected = (id) => connectedSources.includes(id);

  const toggle = (id) => {
    if (isConnected(id)) {
      dispatch(disconnectSource(id));
    } else {
      dispatch(connectSource(id)).then((action) => {
        if (!action.error) dispatch(syncDaily(id));
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        <View style={styles.header}>
          {navigation && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Cihazları Yönet</Text>
            <Text style={styles.subtitle}>
              {connectedSources.length > 0
                ? `${connectedSources.length} cihaz bağlı`
                : 'Bağlı cihaz yok'}
            </Text>
          </View>
        </View>

        <Text style={styles.intro}>
          Sağlık verilerini otomatik senkronize etmek için bir kaynak bağla. Uyku, adım, kalp atışı
          ve daha fazlası wellness skorunu besler.
        </Text>

        {sources.map((src) => {
          const connected = isConnected(src.id);
          return (
            <View key={src.id} style={[styles.row, connected && styles.rowConnected]}>
              <Text style={styles.icon}>{SOURCE_ICONS[src.id] || '📲'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{src.name}</Text>
                <Text style={styles.rowStatus}>
                  {connected
                    ? syncStatus === 'syncing'
                      ? 'Senkronize ediliyor…'
                      : lastSyncLabel(lastSync) || 'Bağlı'
                    : 'Bağlı değil'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggle(src.id)}
                activeOpacity={0.8}
                style={[styles.btn, connected ? styles.btnDisconnect : styles.btnConnect]}
              >
                <Text style={[styles.btnText, connected && styles.btnTextDisconnect]}>
                  {connected ? 'Kaldır' : 'Bağla'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <Text style={styles.footnote}>
          Verilerin cihazından güvenli şekilde alınır ve yalnızca senin wellness skorun için
          kullanılır. İstediğin zaman bağlantıyı kaldırabilirsin.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
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
  intro: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginBottom: 18 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    marginBottom: 10,
  },
  rowConnected: { backgroundColor: 'rgba(20,184,212,0.08)' },
  icon: { fontSize: 26 },
  rowTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 },
  rowStatus: { color: colors.textTertiary, fontSize: 11, marginTop: 3 },

  btn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  btnConnect: { backgroundColor: colors.cyan },
  btnDisconnect: { backgroundColor: 'rgba(255,255,255,0.08)' },
  btnText: { fontSize: 12, fontWeight: '700', color: colors.navy },
  btnTextDisconnect: { color: colors.textSecondary },

  footnote: {
    color: colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
