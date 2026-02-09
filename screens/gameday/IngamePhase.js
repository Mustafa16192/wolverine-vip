import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Utensils,
  ChevronRight,
  ArrowLeft,
  Beer,
  Coffee,
  Pizza,
  Popcorn,
  Clock,
  MapPin,
  Ticket,
  Plus,
  Minus,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

/**
 * IngamePhase - At Seat Experience
 *
 * Food/drink ordering, in-game info, seat amenities.
 */

const FOOD_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'food', label: 'Food' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'alcohol', label: 'Alcohol' },
];

const MENU_ITEMS = [
  { id: 1, name: 'Classic Hot Dog', price: 8, category: 'food', icon: Utensils },
  { id: 2, name: 'Loaded Nachos', price: 12, category: 'food', icon: Pizza },
  { id: 3, name: 'Popcorn', price: 6, category: 'food', icon: Popcorn },
  { id: 4, name: 'Soft Drink', price: 5, category: 'drinks', icon: Coffee },
  { id: 5, name: 'Craft Beer', price: 12, category: 'alcohol', icon: Beer },
  { id: 6, name: 'Premium Wine', price: 14, category: 'alcohol', icon: Beer },
];

export default function IngamePhase({ navigation }) {
  const { advancePhase, user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState({});

  const filteredItems = MENU_ITEMS.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  );

  const addToCart = (itemId) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const cartTotal = Object.entries(cart).reduce((total, [itemId, qty]) => {
    const item = MENU_ITEMS.find(i => i.id === parseInt(itemId));
    return total + (item?.price || 0) * qty;
  }, 0);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleContinue = () => {
    advancePhase();
    navigation.navigate('GameDayHome');
  };

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.blue }]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>IN-GAME</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Your Seat Card */}
          <View style={styles.seatCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.seatContent}>
              <View style={styles.seatIcon}>
                <Ticket size={24} color={COLORS.maize} />
              </View>
              <View style={styles.seatInfo}>
                <Text style={styles.seatLabel}>YOUR SEAT</Text>
                <Text style={styles.seatLocation}>
                  Section {user.seat.section} • Row {user.seat.row} • Seat {user.seat.seat}
                </Text>
              </View>
            </View>
          </View>

          {/* Live Score (Mock) */}
          <View style={styles.scoreCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.scoreContent}>
              <View style={styles.scoreTeam}>
                <Text style={styles.scoreTeamName}>MICH</Text>
                <Text style={styles.scoreValue}>21</Text>
              </View>
              <View style={styles.scoreCenter}>
                <Text style={styles.scoreQuarter}>2ND QTR</Text>
                <Text style={styles.scoreTime}>8:42</Text>
              </View>
              <View style={styles.scoreTeam}>
                <Text style={styles.scoreTeamName}>OSU</Text>
                <Text style={styles.scoreValueOpponent}>14</Text>
              </View>
            </View>
          </View>

          {/* Food & Drinks */}
          <Text style={styles.sectionTitle}>ORDER TO YOUR SEAT</Text>

          {/* Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {FOOD_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Menu Items */}
          <View style={styles.menuList}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.menuItem}>
                <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemIcon}>
                    <item.icon size={20} color={COLORS.maize} />
                  </View>
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>${item.price}</Text>
                  </View>
                  <View style={styles.menuItemActions}>
                    {cart[item.id] ? (
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => removeFromCart(item.id)}
                        >
                          <Minus size={16} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{cart[item.id]}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => addToCart(item.id)}
                        >
                          <Plus size={16} color={COLORS.text} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToCart(item.id)}
                      >
                        <Plus size={16} color={COLORS.blue} />
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Delivery Info */}
          <View style={styles.deliveryCard}>
            <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.deliveryContent}>
              <Clock size={18} color={COLORS.maize} />
              <Text style={styles.deliveryText}>
                Estimated delivery: 10-15 min to your seat
              </Text>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>GAME OVER</Text>
            <ChevronRight size={20} color={COLORS.blue} />
          </TouchableOpacity>

        </ScrollView>

        {/* Cart Footer */}
        {cartCount > 0 && (
          <View style={styles.cartFooter}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.cartContent}>
              <View style={styles.cartInfo}>
                <Text style={styles.cartCount}>{cartCount} items</Text>
                <Text style={styles.cartTotal}>${cartTotal.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: 100,
  },

  // Section Title
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.m,
    marginTop: SPACING.m,
  },

  // Seat Card
  seatCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  seatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  seatIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatInfo: {
    flex: 1,
  },
  seatLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  seatLocation: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Score Card
  scoreCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.2)',
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
  },
  scoreTeam: {
    flex: 1,
    alignItems: 'center',
  },
  scoreTeamName: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'Montserrat_700Bold',
  },
  scoreValueOpponent: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'Montserrat_700Bold',
  },
  scoreCenter: {
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
  },
  scoreQuarter: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
  },
  scoreTime: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.xxs,
  },

  // Categories
  categoriesContainer: {
    marginHorizontal: -SPACING.l,
    marginBottom: SPACING.m,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.s,
    flexDirection: 'row',
  },
  categoryChip: {
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

  // Menu Items
  menuList: {
    gap: SPACING.s,
  },
  menuItem: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
  },
  menuItemPrice: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
  menuItemActions: {},
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    backgroundColor: COLORS.maize,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.full,
  },
  addButtonText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_700Bold',
    minWidth: 20,
    textAlign: 'center',
  },

  // Delivery Card
  deliveryCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deliveryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  deliveryText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Continue Button
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    backgroundColor: COLORS.maize,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
  },
  continueButtonText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },

  // Cart Footer
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
    paddingBottom: SPACING.l,
  },
  cartInfo: {},
  cartCount: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  cartTotal: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  checkoutButton: {
    backgroundColor: COLORS.maize,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
  },
  checkoutButtonText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
  },
});
