import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Clock, Bookmark, Share2, Star, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, CHROME } from '../constants/theme';
import AppBackground from '../components/chrome/AppBackground';
import { useAssistant } from '../context/AssistantContext';

const { height: DEFAULT_HEIGHT } = Dimensions.get('window');
const FILTERS = ['All', 'Exclusive', 'Analysis', 'Team News'];

const STORIES = [
  {
    id: 'news-1',
    title: 'Michigan\'s Path to the Playoffs: What We Know',
    excerpt: 'With dominant performances and a top defense, the Wolverines control their postseason path.',
    category: 'ANALYSIS',
    timeAgo: '2 hours ago',
    readTime: '5 min read',
    isVipExclusive: true,
    source: 'The Wolverine Wire',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 'news-2',
    title: 'Game Preview: Michigan vs. Ohio State',
    excerpt: 'Key matchups, momentum signals, and what will decide the rivalry showdown.',
    category: 'PREVIEW',
    timeAgo: '4 hours ago',
    readTime: '4 min read',
    isVipExclusive: false,
    source: 'Game Day Desk',
    imageUrl: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 'news-3',
    title: 'Injury Report: Key Players Return to Practice',
    excerpt: 'Several starters were active in full-contact drills ahead of this week\'s matchup.',
    category: 'TEAM NEWS',
    timeAgo: '6 hours ago',
    readTime: '3 min read',
    isVipExclusive: false,
    source: 'Practice Notes',
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 'news-4',
    title: 'VIP Exclusive: Behind the Scenes at The Big House',
    excerpt: 'An insider look at tunnel prep, host operations, and premium access workflows.',
    category: 'EXCLUSIVE',
    timeAgo: '1 day ago',
    readTime: '7 min read',
    isVipExclusive: true,
    source: 'VIP Insider',
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 'news-5',
    title: 'Recruiting Update: Top 2027 Prospects Visit Campus',
    excerpt: 'Multiple high-priority recruits were on site for the latest home game experience.',
    category: 'TEAM NEWS',
    timeAgo: '1 day ago',
    readTime: '4 min read',
    isVipExclusive: false,
    source: 'Recruiting Board',
    imageUrl: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1800&q=80',
  },
];

function matchesFilter(story, filter) {
  if (filter === 'All') return true;
  if (filter === 'Exclusive') return story.isVipExclusive;
  if (filter === 'Analysis') return story.category === 'ANALYSIS' || story.category === 'PREVIEW';
  if (filter === 'Team News') return story.category === 'TEAM NEWS';
  return true;
}

export default function NewsScreen() {
  const listRef = useRef(null);
  const { selectedNewsFilter, setNewsFilter } = useAssistant();
  const [pageHeight, setPageHeight] = useState(DEFAULT_HEIGHT);
  const activeFilter = FILTERS.includes(selectedNewsFilter) ? selectedNewsFilter : 'All';

  const filteredStories = useMemo(() => {
    const result = STORIES.filter(story => matchesFilter(story, activeFilter));
    return result.length ? result : STORIES;
  }, [activeFilter]);

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [activeFilter]);

  const renderStory = ({ item, index }) => {
    const bottomInset = Platform.OS === 'ios' ? 178 : 146;

    return (
      <View style={[styles.storyPage, { height: pageHeight }]}>
        <ImageBackground source={{ uri: item.imageUrl }} resizeMode="cover" style={styles.storyImage}>
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.84)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.storyTop}>
            <View style={styles.storyTitleRow}>
              <Text style={styles.storyEyebrow}>INSIDER WIRE</Text>
              <Text style={styles.storyCounter}>{index + 1}/{filteredStories.length}</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {FILTERS.map(filter => {
                const selected = filter === activeFilter;
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.filterChip, selected && styles.filterChipActive]}
                    activeOpacity={0.85}
                    onPress={() => setNewsFilter(filter)}
                  >
                    <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={[styles.storyBottom, { paddingBottom: bottomInset }]}>
            <BlurView intensity={26} tint="dark" style={styles.storyMetaCard}>
              <View style={styles.metaTopRow}>
                <View style={styles.sourceBlock}>
                  <Text style={styles.sourceText}>{item.source}</Text>
                  <View style={styles.metaTimeRow}>
                    <Clock size={12} color={COLORS.textSecondary} />
                    <Text style={styles.metaTimeText}>{item.timeAgo} • {item.readTime}</Text>
                  </View>
                </View>
                {item.isVipExclusive && (
                  <View style={styles.vipBadge}>
                    <Star size={10} color={COLORS.blue} fill={COLORS.blue} />
                    <Text style={styles.vipBadgeText}>VIP</Text>
                  </View>
                )}
              </View>

              <Text style={styles.categoryLabel}>{item.category}</Text>
              <Text style={styles.storyTitle}>{item.title}</Text>
              <Text style={styles.storyExcerpt}>{item.excerpt}</Text>

              <View style={styles.storyFooter}>
                <TouchableOpacity style={styles.readMoreButton} activeOpacity={0.85}>
                  <Text style={styles.readMoreText}>Read Full Story</Text>
                  <ChevronRight size={16} color={COLORS.blue} />
                </TouchableOpacity>

                <View style={styles.storyActions}>
                  <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
                    <Bookmark size={16} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
                    <Share2 size={16} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppBackground />
      <SafeAreaView
        style={styles.safeArea}
        onLayout={(event) => setPageHeight(event.nativeEvent.layout.height)}
      >
        <FlatList
          ref={listRef}
          data={filteredStories}
          keyExtractor={(item) => item.id}
          renderItem={renderStory}
          pagingEnabled
          decelerationRate="fast"
          bounces={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={pageHeight}
          snapToAlignment="start"
          getItemLayout={(_, index) => ({
            length: pageHeight,
            offset: pageHeight * index,
            index,
          })}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue,
  },
  safeArea: {
    flex: 1,
  },
  storyPage: {
    width: '100%',
  },
  storyImage: {
    flex: 1,
    paddingHorizontal: SPACING.m,
  },
  storyTop: {
    paddingTop: SPACING.s,
  },
  storyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  storyEyebrow: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1.1,
  },
  storyCounter: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingRight: SPACING.m,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.elevated,
  },
  filterChipActive: {
    backgroundColor: COLORS.maize,
    borderColor: COLORS.maize,
  },
  filterText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: COLORS.blue,
  },
  storyBottom: {
    marginTop: 'auto',
  },
  storyMetaCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
    padding: SPACING.m,
  },
  metaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  sourceBlock: {
    flex: 1,
    marginRight: SPACING.s,
  },
  sourceText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 2,
  },
  metaTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaTimeText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.maize,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  vipBadgeText: {
    color: COLORS.blue,
    fontSize: 9,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  categoryLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: SPACING.xxs,
  },
  storyTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    lineHeight: 30,
    marginBottom: SPACING.s,
  },
  storyExcerpt: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: 21,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginBottom: SPACING.m,
  },
  storyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.maize,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.m,
    paddingVertical: 10,
  },
  readMoreText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.4,
  },
  storyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
