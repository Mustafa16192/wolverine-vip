import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, CHROME } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBackground from '../components/chrome/AppBackground';
import {
  ShoppingBag,
  Star,
  Tag,
  Truck,
  ChevronRight,
  Heart,
} from 'lucide-react-native';
import { useAssistant } from '../context/AssistantContext';

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
  category: 'Jerseys',
  price: 149.99,
  originalPrice: 179.99,
  discount: 17,
  isVipExclusive: true,
  rating: 4.9,
  reviews: 234,
  imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1400&q=80',
};

const PRODUCTS = [
  {
    id: 2,
    name: 'Vintage Logo Hoodie',
    category: 'Apparel',
    price: 89.99,
    isVipExclusive: false,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Game Day Cap',
    category: 'Accessories',
    price: 34.99,
    isVipExclusive: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Block M Polo',
    category: 'Apparel',
    price: 64.99,
    isVipExclusive: false,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Legacy Scarf',
    category: 'Accessories',
    price: 44.99,
    isVipExclusive: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1603037159424-8fd3f788f137?auto=format&fit=crop&w=900&q=80',
  },
];

const CATEGORIES = [
  { name: 'All' },
  { name: 'Jerseys' },
  { name: 'Apparel' },
  { name: 'Accessories' },
  { name: 'Home' },
];

export default function ShopScreen() {
  const { selectedShopCategory, setShopCategory } = useAssistant();
  const activeCategory = CATEGORIES.some(category => category.name === selectedShopCategory)
    ? selectedShopCategory
    : 'All';

  const categoryCounts = useMemo(() => {
    const allItems = [FEATURED_PRODUCT, ...PRODUCTS];
    const counts = { All: allItems.length, Jerseys: 0, Apparel: 0, Accessories: 0, Home: 0 };

    allItems.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category] += 1;
      }
    });

    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(product => product.category === activeCategory);
  }, [activeCategory]);

  const featuredProduct = useMemo(() => {
    if (activeCategory === 'All' || FEATURED_PRODUCT.category === activeCategory) return FEATURED_PRODUCT;
    return filteredProducts[0] || FEATURED_PRODUCT;
  }, [activeCategory, filteredProducts]);

  return (
    <View style={styles.container}>
      <AppBackground />

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
            {CATEGORIES.map((category) => {
              const selected = category.name === activeCategory;
              return (
                <TouchableOpacity
                  key={category.name}
                  style={[styles.categoryChip, selected && styles.categoryChipActive]}
                  activeOpacity={0.85}
                  onPress={() => setShopCategory(category.name)}
                >
                  <Text style={[styles.categoryText, selected && styles.categoryTextActive]}>
                    {category.name}
                  </Text>
                  <Text style={[styles.categoryCount, selected && styles.categoryCountActive]}>
                    {categoryCounts[category.name] || 0}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Featured Product */}
          <Text style={styles.sectionTitle}>FEATURED</Text>
          <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

            {/* Product Image Placeholder */}
            <View style={styles.featuredImageContainer}>
              <Image source={{ uri: featuredProduct.imageUrl }} style={styles.featuredImagePlaceholder} />
              <LinearGradient
                colors={['rgba(0,0,0,0.12)', 'rgba(0,0,0,0.54)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {featuredProduct.isVipExclusive && (
                <View style={styles.exclusiveBadge}>
                  <Star size={10} color={COLORS.blue} fill={COLORS.blue} />
                  <Text style={styles.exclusiveBadgeText}>VIP EXCLUSIVE</Text>
                </View>
              )}

              <TouchableOpacity style={styles.wishlistButton}>
                <Heart size={18} color={COLORS.text} />
              </TouchableOpacity>

              {featuredProduct.discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{featuredProduct.discount}%</Text>
                </View>
              )}
            </View>

            <View style={styles.featuredContent}>
              <Text style={styles.featuredName}>{featuredProduct.name}</Text>

              <View style={styles.ratingContainer}>
                <Star size={14} color={COLORS.maize} fill={COLORS.maize} />
                <Text style={styles.ratingText}>{featuredProduct.rating}</Text>
                <Text style={styles.reviewsText}>({featuredProduct.reviews || 164} reviews)</Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>${featuredProduct.price}</Text>
                {featuredProduct.originalPrice && (
                  <Text style={styles.originalPrice}>${featuredProduct.originalPrice}</Text>
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.8}>
                  <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />

                  <View style={styles.productImageContainer}>
                    <Image source={{ uri: product.imageUrl }} style={styles.productImagePlaceholder} />
                    <LinearGradient
                      colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.42)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />

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
              ))
            ) : (
              <View style={styles.emptyCategoryCard}>
                <BlurView intensity={14} tint="dark" style={StyleSheet.absoluteFill} />
                <Text style={styles.emptyCategoryTitle}>No items yet in {activeCategory}</Text>
                <Text style={styles.emptyCategoryBody}>
                  New drops will appear here first for VIP members.
                </Text>
              </View>
            )}
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
    backgroundColor: CHROME.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
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
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
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
    backgroundColor: CHROME.surface.elevated,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
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
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
    marginBottom: SPACING.xl,
  },
  featuredImageContainer: {
    height: 200,
    position: 'relative',
  },
  featuredImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
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
  emptyCategoryCard: {
    width: '100%',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
    overflow: 'hidden',
    padding: SPACING.m,
    gap: 4,
  },
  emptyCategoryTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_600SemiBold',
  },
  emptyCategoryBody: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
  },
  productImageContainer: {
    height: 120,
    position: 'relative',
  },
  productImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
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
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
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
