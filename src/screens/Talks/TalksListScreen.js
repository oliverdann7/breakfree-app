import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

export default function TalksListScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              Palestralar <Text style={styles.headerAccent}>&</Text> sesler
            </Text>
            <Text style={styles.headerSub}>Türkiye&apos;nin en güçlü zihinleri</Text>
          </View>
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Live Now Card */}
        <Card style={styles.liveCard}>
          <View style={styles.liveHeader}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>Canlı</Text>
            </View>
            <Text style={styles.liveCount}>347 dinleyici</Text>
          </View>
          <Text style={styles.liveTitle}>
            Yorgunluğun ardındaki{'\n'}<Text style={styles.liveAccent}>gerçek hikaye</Text>
          </Text>
          <View style={styles.liveHosts}>
            <View style={styles.hostAvatar1} />
            <View style={styles.hostAvatar2} />
            <Text style={styles.hostsText}>Dr. Ayşe Demir · Coach Burak</Text>
          </View>
          <TouchableOpacity style={styles.liveButton}>
            <Text style={styles.liveButtonIcon}>🎧</Text>
            <Text style={styles.liveButtonText}>Şimdi dinle</Text>
          </TouchableOpacity>
        </Card>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {['Tümü', 'Beslenme', 'Zihin', 'Hareket', 'Uyku', 'Bağlantı'].map((cat, i) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                i === 0 && styles.categoryBtnActive,
              ]}
            >
              <Text style={[styles.categoryText, i === 0 && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Talk */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionLabel}>Öne çıkan</Text>
          <Card style={styles.featuredCard}>
            <View style={styles.featuredThumbnail} />
            <View style={styles.featuredDuration}>
              <Text style={styles.featuredDurationText}>42 dk</Text>
            </View>
            <View style={styles.playIconContainer}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredCategory}>Beslenme · Bölüm 12</Text>
              <Text style={styles.featuredTitle}>Sezgisel beslenme: kuralları unutmak</Text>
              <View style={styles.featuredHost}>
                <View style={styles.hostAvatar3} />
                <Text style={styles.hostName}>Beslenme uzmanı Selin Kaya</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Talks List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Senin için</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
          {[
            { cat: 'Zihin', title: 'Anksiyeteyi anlamak', dur: '28dk', host: 'Dr. Ayşe', color1: colors.cyan },
            { cat: 'Hareket', title: 'Koşunun bilimi', dur: '35dk', host: 'Mehmet Ç.', color1: colors.gold },
            { cat: 'Uyku', title: 'Derin uykuya yolculuk', dur: '22dk', host: 'Dr. Levent', color1: colors.royal },
          ].map((talk, i) => (
            <TouchableOpacity key={i} style={styles.talkItem}>
              <View style={[styles.talkThumbnail, { backgroundColor: talk.color1 }]} />
              <View style={styles.talkContent}>
                <Text style={styles.talkCategory}>{talk.cat}</Text>
                <Text style={styles.talkTitle}>{talk.title}</Text>
                <Text style={styles.talkMeta}>{talk.host} · {talk.dur}</Text>
              </View>
              <Text style={styles.plusIcon}>+</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: colors.textPrimary,
  },
  headerAccent: {
    color: colors.gold,
    fontStyle: 'italic',
  },
  headerSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  searchIcon: {
    fontSize: 18,
  },
  liveCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(230,181,48,0.3)',
    backgroundColor: 'rgba(230,181,48,0.08)',
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gold,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bgPrimary,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.bgPrimary,
  },
  liveCount: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 12,
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  liveAccent: {
    color: colors.gold,
    fontStyle: 'italic',
  },
  liveHosts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  hostAvatar1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.cyan,
    marginRight: -8,
  },
  hostAvatar2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold,
  },
  hostsText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  liveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingVertical: 10,
    gap: 6,
  },
  liveButtonIcon: {
    fontSize: 14,
  },
  liveButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.bgPrimary,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginRight: 8,
  },
  categoryBtnActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  categoryTextActive: {
    color: colors.bgPrimary,
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  featuredCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  featuredThumbnail: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#0B72B9',
  },
  featuredDuration: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  featuredDurationText: {
    fontSize: 9,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 10,
    color: colors.textPrimary,
  },
  featuredContent: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  featuredCategory: {
    fontSize: 8,
    color: colors.cyan,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  featuredTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: 4,
  },
  featuredHost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  hostAvatar3: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gold,
  },
  hostName: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
  },
  listSection: {
    paddingHorizontal: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  arrow: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  talkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  talkThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  talkContent: {
    flex: 1,
  },
  talkCategory: {
    fontSize: 8,
    color: colors.gold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  talkTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: 2,
  },
  talkMeta: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  plusIcon: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.3)',
  },
});
