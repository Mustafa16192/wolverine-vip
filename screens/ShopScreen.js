import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  ShoppingBag,
  Star,
  Tag,
  Truck,
  ChevronRight,
  Heart,
  Package,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.l * 2 - SPACING.s) / 2;

/**
 * ShopScreen - Merch & Gear Store
 *
 * VIP exclusive merchandise and team gear.
 */

// Mock product data
const FEATURED_PRODUCT = {
  id: 1,
  name: '2026 Championship Jersey',
  price: 149.99,
  originalPrice: 179.99,
  discount: 17,
  isVipExclusive: true,
  rating: 4.9,
  reviews: 234,
};

const PRODUCTS = [
  {
    id: 2,
    name: 'Vintage Logo Hoodie',
    price: 89.99,
    isVipExclusive: false,
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Game Day Cap',
    price: 34.99,
    isVipExclusive: true,
    rating: 4.8,
  },
  {
    id: 4,
    name: 'Block M Polo',
    price: 64.99,
    isVipExclusive: false,
    rating: 4.6,
  },
  {
    id: 5,
    name: 'Legacy Scarf',
    price: 44.99,
    isVipExclusive: true,
    rating: 4.9,
  },
];

const CATEGORIES = [
  { name: 'All', count: 156 },
  { name: 'Jerseys', count: 24 },
  { name: 'Apparel', count: 67 },
  { name: 'Accessories', count: 45 },
  { name: 'Home', count: 20 },
];

export default function ShopScreen() {
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
            <View>
              <Text style={styles.headerLabel}>M DEN</Text>
              <Text style={styles.headerTitle}>VIP SHOP</Text>
            </View>
            <TouchableOpacity style={styles.cartButton}>
              <ShoppingBag size={22} color={COLORS.text} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* VIP Benefits Banner */}
          <View style={styles.benefitsBanner}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.15)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.benefitsContent}>
              <View style={styles.benefitItem}>
                <Tag size={18} color={COLORS.maize} />
                <Text style={styles.benefitText}>15% VIP Discount</Text>
              </View>
              <View style={styles.benefitDivider} />
              <View style={styles.benefitItem}>
                <Truck size={18} color={COLORS.maize} />
                <Text style={styles.benefitText}>Free Shipping</Text>
              </View>
            </View>
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {CATEGORIES.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryChip, index === 0 && styles.categoryChipActive]}
              >
                <Text style={[styles.categoryText, index === 0 && styles.categoryTextActive]}>
                  {category.name}
                </Text>
                <Text style={[styles.categoryCount, index === 0 && styles.categoryCountActive]}>
                  {category.count}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Product */}
          <Text style={styles.sectionTitle}>FEATURED</Text>
          <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

            {/* Product Image Placeholder */}
            <View style={styles.featuredImageContainer}>
              <LinearGradient
                colors={[COLORS.blue, 'rgba(0,39,76,0.7)']}
                style={styles.featuredImagePlaceholder}
              >
                <Text style={styles.featuredImageText}>M</Text>
                <Package size={48} color={COLORS.maize} style={styles.featuredIcon} />
              </LinearGradient>

              {FEATURED_PRODUCT.isVipExclusive && (
                <View style={styles.exclusiveBadge}>
                  <Star size={10} color={COLORS.blue} fill={COLORS.blue} />
                  <Text style={styles.exclusiveBadgeText}>VIP EXCLUSIVE</Text>
                </View>
              )}

              <TouchableOpacity style={styles.wishlistButton}>
                <Heart size={18} color={COLORS.text} />
              </TouchableOpacity>

              {FEATURED_PRODUCT.discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{FEATURED_PRODUCT.discount}%</Text>
                </View>
              )}
            </View>

            <View style={styles.featuredContent}>
              <Text style={styles.featuredName}>{FEATURED_PRODUCT.name}</Text>

              <View style={styles.ratingContainer}>
                <Star size={14} color={COLORS.maize} fill={COLORS.maize} />
                <Text style={styles.ratingText}>{FEATURED_PRODUCT.rating}</Text>
                <Text style={styles.reviewsText}>({FEATURED_PRODUCT.reviews} reviews)</Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>${FEATURED_PRODUCT.price}</Text>
                {FEATURED_PRODUCT.originalPrice && (
                  <Text style={styles.originalPrice}>${FEATURED_PRODUCT.originalPrice}</Text>
                )}
              </View>

              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>ADD TO CART</Text>
                <ChevronRight size={18} color={COLORS.blue} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Product Grid */}
          <Text style={styles.sectionTitle}>VIP PICKS</Text>
          <View style={styles.productGrid}>
            {PRODUCTS.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.8}>
                <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.productImageContainer}>
                  <LinearGradient
                    colors={['rgba(0,39,76,0.8)', 'rgba(0,39,76,0.4)']}
                    style={styles.productImagePlaceholder}
                  >
                    <Package size={32} color={COLORS.maize} />
                  </LinearGradient>

                  {product.isVipExclusive && (
                    <View style={styles.vipBadgeSmall}>
                      <Star size={8} color={COLORS.blue} fill={COLORS.blue} />
                    </View>
                  )}

                  <TouchableOpacity style={styles.wishlistButtonSmall}>
                    <Heart size={14} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.productContent}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>

                  <View style={styles.productRating}>
                    <Star size={10} color={COLORS.maize} fill={COLORS.maize} />
                    <Text style={styles.productRatingText}>{product.rating}</Text>
                  </View>

                  <Text style={styles.productPrice}>${product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Order Status Card */}
          <Text style={styles.sectionTitle}>YOUR ORDERS</Text>
          <TouchableOpacity style={styles.orderCard} activeOpacity={0.8}>
            <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.orderContent}>
              <View style={styles.orderIcon}>
                <Truck size={24} color={COLORS.maize} />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderTitle}>Order #WVP-2847</Text>
                <Text style={styles.orderStatus}>In Transit • Arriving Nov 25</Text>
              </View>
              <ChevronRight size={20} color={COLORS.textTertiary} />
            </View>
          </TouchableOpacity>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.maize,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: COLORS.blue,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
  },

  // Benefits Banner
  benefitsBanner: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.l,
  },
  benefitsContent: {
    flexDirection: 'row',
    padding: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  benefitText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  benefitDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.l,
  },

  // Categories
  categoriesContainer: {
    marginHorizontal: -SPACING.l,
    marginBottom: SPACING.l,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.s,
    flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.maize,
    borderColor: COLORS.maize,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  categoryTextActive: {
    color: COLORS.blue,
  },
  categoryCount: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  categoryCountActive: {
    color: COLORS.blue,
    opacity: 0.7,
  },

  // Section Title
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.m,
  },

  // Featured Product
  featuredCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  featuredImageContainer: {
    height: 200,
    position: 'relative',
  },
  featuredImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredImageText: {
    color: COLORS.maize,
    fontSize: 120,
    fontFamily: 'Montserrat_700Bold',
    opacity: 0.1,
    position: 'absolute',
  },
  featuredIcon: {
    opacity: 0.5,
  },
  exclusiveBadge: {
    position: 'absolute',
    top: SPACING.m,
    left: SPACING.m,
    backgroundColor: COLORS.maize,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
  },
  exclusiveBadgeText: {
    color: COLORS.blue,
    fontSize: 9,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  wishlistButton: {
    position: 'absolute',
    top: SPACING.m,
    right: SPACING.m,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    bottom: SPACING.m,
    left: SPACING.m,
    backgroundColor: COLORS.tappanRed,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.xs,
  },
  discountText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
  },
  featuredContent: {
    padding: SPACING.l,
  },
  featuredName: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.s,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.m,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  reviewsText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.s,
    marginBottom: SPACING.l,
  },
  currentPrice: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
  },
  originalPrice: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    backgroundColor: COLORS.maize,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
  },
  addToCartText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },

  // Product Grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
    marginBottom: SPACING.xl,
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productImageContainer: {
    height: 120,
    position: 'relative',
  },
  productImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipBadgeSmall: {
    position: 'absolute',
    top: SPACING.s,
    left: SPACING.s,
    backgroundColor: COLORS.maize,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButtonSmall: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContent: {
    padding: SPACING.m,
  },
  productName: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
    lineHeight: TYPOGRAPHY.fontSize.sm * 1.3,
    marginBottom: SPACING.xs,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    marginBottom: SPACING.xs,
  },
  productRatingText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  productPrice: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_700Bold',
  },

  // Order Card
  orderCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_600SemiBold',
  },
  orderStatus: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
});
