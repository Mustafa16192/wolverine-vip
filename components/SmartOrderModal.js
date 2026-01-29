import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { BlurView } from 'expo-blur';
import { X, Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Menu Items
const MENU_ITEMS = [
  { id: 1, name: 'Hot Dog', emoji: '🌭', price: 6 },
  { id: 2, name: 'Pretzel', emoji: '🥨', price: 5 },
  { id: 3, name: 'Nachos', emoji: '🧀', price: 8 },
  { id: 4, name: 'Beer', emoji: '🍺', price: 12 },
  { id: 5, name: 'Soda', emoji: '🥤', price: 4 },
  { id: 6, name: 'Water', emoji: '💧', price: 3 },
];

// Favorite Quick Reorder Items
const FAVORITES = [
  { id: 2, name: 'Pretzel', emoji: '🥨', quantity: 2 },
  { id: 5, name: 'Diet Coke', emoji: '🥤', quantity: 1 },
];

export default function SmartOrderModal({ visible, onClose, onOrderPlaced }) {
  const [cart, setCart] = useState({});

  const addToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = MENU_ITEMS.find((i) => i.id === parseInt(itemId));
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const handlePlaceOrder = () => {
    const total = calculateTotal();
    if (total > 0) {
      setCart({});
      if (onOrderPlaced) {
        onOrderPlaced(total);
      }
      if (onClose) {
        onClose();
      }
    }
  };

  const quickReorder = () => {
    const newCart = {};
    FAVORITES.forEach((fav) => {
      newCart[fav.id] = fav.quantity;
    });
    setCart(newCart);
  };

  const total = calculateTotal();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={40} tint="dark" style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>SMART ORDER</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Quick Reorder Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>QUICK REORDER</Text>
              <TouchableOpacity style={styles.quickReorderCard} onPress={quickReorder}>
                <View style={styles.favoritesRow}>
                  {FAVORITES.map((fav, index) => (
                    <Text key={index} style={styles.favoriteEmoji}>
                      {fav.emoji} x{fav.quantity}
                    </Text>
                  ))}
                </View>
                <Text style={styles.quickReorderLabel}>Tap to add favorites</Text>
              </TouchableOpacity>
            </View>

            {/* Menu Grid */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MENU</Text>
              <View style={styles.menuGrid}>
                {MENU_ITEMS.map((item) => {
                  const itemCount = cart[item.id] || 0;
                  return (
                    <View key={item.id} style={styles.menuCard}>
                      <Text style={styles.itemEmoji}>{item.emoji}</Text>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>${item.price}</Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToCart(item)}
                      >
                        <Plus size={16} color={COLORS.primary} />
                        {itemCount > 0 && (
                          <Text style={styles.itemCount}>{itemCount}</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Summary */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.placeOrderButton, total === 0 && styles.placeOrderButtonDisabled]}
              onPress={handlePlaceOrder}
              disabled={total === 0}
            >
              <Text style={styles.placeOrderText}>
                {total > 0 ? 'PLACE ORDER' : 'ADD ITEMS TO ORDER'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: 'rgba(0, 26, 51, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeButton: {
    padding: SPACING.s,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
  },
  section: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: SPACING.m,
  },
  quickReorderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  favoritesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  favoriteEmoji: {
    fontSize: 24,
    marginHorizontal: SPACING.s,
  },
  quickReorderLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: (width * 0.9 - SPACING.l * 2 - SPACING.m) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemEmoji: {
    fontSize: 36,
    marginBottom: SPACING.s,
  },
  itemName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemPrice: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.s,
  },
  addButton: {
    backgroundColor: COLORS.secondary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  itemCount: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
  },
  footer: {
    padding: SPACING.l,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  totalLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
  },
  placeOrderButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    backgroundColor: 'rgba(255, 203, 5, 0.3)',
  },
  placeOrderText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
