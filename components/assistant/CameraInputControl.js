import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'lucide-react-native';
import { COLORS, CHROME } from '../../constants/theme';

export default function CameraInputControl({ onCapture, disabled = false }) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handlePress = async () => {
    if (disabled || isCapturing) return;

    try {
      setIsCapturing(true);
      await onCapture?.();
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handlePress}
      activeOpacity={0.85}
      disabled={disabled || isCapturing}
      accessibilityRole="button"
      accessibilityLabel="Submit camera context"
    >
      {isCapturing ? (
        <ActivityIndicator size="small" color={COLORS.maize} />
      ) : (
        <Camera size={18} color={COLORS.maize} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CHROME.surface.elevated,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
