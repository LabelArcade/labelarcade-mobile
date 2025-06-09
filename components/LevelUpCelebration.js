import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image } from 'react-native';

export default function LevelUpCelebration({ visible, level, onClose }) {
  useEffect(() => {
    let timer;
    if (visible) {
      timer = setTimeout(() => {
        onClose && onClose(); // Call the parent's handler to close the modal
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Image
            source={require('../assets/levelup.png')}
            style={styles.image}
          />
          <Text style={styles.title}>🎉 Level Up!</Text>
          <Text style={styles.text}>You’ve reached Level {level}!</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#34A853',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
