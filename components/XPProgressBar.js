import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function XPProgressBar({ xp, level }) {
  const currentLevelXP = level > 1 ? (level - 1) * 50 : 0;
  const nextLevelXP = level * 50;
  const progress = Math.min(1, (xp - currentLevelXP) / (nextLevelXP - currentLevelXP));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>⚡ XP: {xp} / {nextLevelXP}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
});
