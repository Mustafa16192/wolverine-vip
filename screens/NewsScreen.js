import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Clock,
  ChevronRight,
  Bookmark,
  Share2,
  Flame,
  Star,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

/**
 * NewsScreen - Insider Wire & News Feed
 *
 * Displays team news, insider content, and
 * exclusive VIP articles.
 */

// Mock news data
const FEATURED_ARTICLE = {
  id: 1,
  title: 'Michigan\'s Path to the Playoffs: What We Know',
  excerpt: 'With an undefeated record and dominant performances, the Wolverines are in prime position for a CFP berth.',
  category: 'ANALYSIS',
  timeAgo: '2 hours ago',
  readTime: '5 min read',
  isVipExclusive: true,
  imageUrl: null, // Would be actual image in production
};

const NEWS_ARTICLES = [
  {
    id: 2,
    title: 'Game Preview: Michigan vs. Ohio State',
    excerpt: 'Everything you need to know about the biggest rivalry in college football.',
    category: 'PREVIEW',
    timeAgo: '4 hours ago',
    readTime: '4 min read',
    isVipExclusive: false,
  },
  {
    id: 3,
    title: 'Injury Report: Key Players Return to Practice',
    excerpt: 'Good news on the injury front as several starters were spotted at practice.',
    category: 'TEAM NEWS',
    timeAgo: '6 hours ago',
    readTime: '2 min read',
    isVipExclusive: false,
  },
  {
    id: 4,
    title: 'VIP Exclusive: Behind the Scenes at The Big House',
    excerpt: 'An exclusive look at the game day preparations that make Michigan football special.',
    category: 'EXCLUSIVE',
    timeAgo: '1 day ago',
    readTime: '7 min read',
    isVipExclusive: true,
  },
  {
    id: 5,
    title: 'Recruiting Update: Top 2027 Prospects Visit Campus',
    excerpt: 'Several five-star recruits were in attendance for the latest home game.',
    category: 'RECRUITING',
    timeAgo: '1 day ago',
    readTime: '3 min read',
    isVipExclusive: false,
  },
  {
    id: 6,
    title: 'Season Ticket Holder Spotlight: The Price Family Legacy',
    excerpt: 'Three generations of Wolverines share their game day traditions.',
    category: 'COMMUNITY',
    timeAgo: '2 days ago',
    readTime: '6 min read',
    isVipExclusive: true,
  },
];

const QUICK_LINKS = [
  { label: 'All', active: true },
  { label: 'Exclusive', active: false },
  { label: 'Analysis', active: false },
  { label: 'Team News', active: false },
];

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.blue, COLORS.blue]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerLabel}>INSIDER</Text>
            <Text style={styles.headerTitle}>THE WIRE</Text>
          </View>

          {/* Quick Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {QUICK_LINKS.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.filterChip, link.active && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, link.active && styles.filterChipTextActive]}>
                  {link.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Article */}
          <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.15)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Featured Image Placeholder */}
            <View style={styles.featuredImageContainer}>
              <LinearGradient
                colors={[COLORS.blue, 'rgba(0,39,76,0.8)']}
                style={styles.featuredImagePlaceholder}
              >
                <Text style={styles.featuredImageText}>M</Text>
              </LinearGradient>
              {FEATURED_ARTICLE.isVipExclusive && (
                <View style={styles.vipBadge}>
                  <Star size={10} color={COLORS.blue} fill={COLORS.blue} />
                  <Text style={styles.vipBadgeText}>VIP</Text>
                </View>
              )}
            </View>

            <View style={styles.featuredContent}>
              <View style={styles.featuredMeta}>
                <View style={styles.categoryBadge}>
                  <Flame size={10} color={COLORS.maize} />
                  <Text style={styles.categoryText}>{FEATURED_ARTICLE.category}</Text>
                </View>
                <View style={styles.metaInfo}>
                  <Clock size={12} color={COLORS.textTertiary} />
                  <Text style={styles.metaText}>{FEATURED_ARTICLE.timeAgo}</Text>
                </View>
              </View>

              <Text style={styles.featuredTitle}>{FEATURED_ARTICLE.title}</Text>
              <Text style={styles.featuredExcerpt}>{FEATURED_ARTICLE.excerpt}</Text>

              <View style={styles.featuredFooter}>
                <Text style={styles.readTime}>{FEATURED_ARTICLE.readTime}</Text>
                <View style={styles.featuredActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Bookmark size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Latest News */}
          <Text style={styles.sectionTitle}>LATEST NEWS</Text>

          {NEWS_ARTICLES.map((article) => (
            <TouchableOpacity key={article.id} style={styles.articleCard} activeOpacity={0.8}>
              <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />

              <View style={styles.articleContent}>
                <View style={styles.articleHeader}>
                  <View style={styles.articleCategoryBadge}>
                    <Text style={styles.articleCategoryText}>{article.category}</Text>
                  </View>
                  {article.isVipExclusive && (
                    <View style={styles.vipBadgeSmall}>
                      <Star size={8} color={COLORS.blue} fill={COLORS.blue} />
                      <Text style={styles.vipBadgeTextSmall}>VIP</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleExcerpt} numberOfLines={2}>
                  {article.excerpt}
                </Text>

                <View style={styles.articleFooter}>
                  <View style={styles.articleMeta}>
                    <Text style={styles.articleMetaText}>{article.timeAgo}</Text>
                    <Text style={styles.articleMetaDot}>•</Text>
                    <Text style={styles.articleMetaText}>{article.readTime}</Text>
                  </View>
                  <ChevronRight size={18} color={COLORS.textTertiary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}

        </ScrollView>
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
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: 120,
  },

  // Header
  header: {
    marginBottom: SPACING.l,
  },
  headerLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },

  // Filters
  filtersContainer: {
    marginHorizontal: -SPACING.l,
    marginBottom: SPACING.l,
  },
  filtersContent: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.s,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.maize,
    borderColor: COLORS.maize,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  filterChipTextActive: {
    color: COLORS.blue,
  },

  // Featured Card
  featuredCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  featuredImageContainer: {
    height: 160,
    position: 'relative',
  },
  featuredImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredImageText: {
    color: COLORS.maize,
    fontSize: 72,
    fontFamily: 'Montserrat_700Bold',
    opacity: 0.2,
  },
  vipBadge: {
    position: 'absolute',
    top: SPACING.m,
    right: SPACING.m,
    backgroundColor: COLORS.maize,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
  },
  vipBadgeText: {
    color: COLORS.blue,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  featuredContent: {
    padding: SPACING.l,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
  },
  categoryText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
  },
  metaText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  featuredTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    lineHeight: TYPOGRAPHY.fontSize.xl * 1.3,
    marginBottom: SPACING.s,
  },
  featuredExcerpt: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    lineHeight: TYPOGRAPHY.fontSize.base * 1.5,
    marginBottom: SPACING.m,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readTime: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  featuredActions: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Title
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.m,
  },

  // Article Card
  articleCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.s,
  },
  articleContent: {
    padding: SPACING.m,
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.s,
  },
  articleCategoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.xs,
  },
  articleCategoryText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  vipBadgeSmall: {
    backgroundColor: COLORS.maize,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  vipBadgeTextSmall: {
    color: COLORS.blue,
    fontSize: 8,
    fontFamily: 'Montserrat_700Bold',
  },
  articleTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_700Bold',
    lineHeight: TYPOGRAPHY.fontSize.md * 1.3,
    marginBottom: SPACING.xs,
  },
  articleExcerpt: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    lineHeight: TYPOGRAPHY.fontSize.sm * 1.4,
    marginBottom: SPACING.m,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleMetaText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  articleMetaDot: {
    color: COLORS.textTertiary,
    marginHorizontal: SPACING.xs,
  },
});
