import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const avatarOptions = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png'];

  const getAvatarImage = (avatarName) => {
    switch (avatarName) {
      case 'avatar1.png':
        return require('../assets/avatar1.png');
      case 'avatar2.png':
        return require('../assets/avatar2.png');
      case 'avatar3.png':
        return require('../assets/avatar3.png');
      case 'avatar4.png':
        return require('../assets/avatar4.png');
      default:
        return null;
    }
  };

  const handleStart = async () => {
    if (!username || !selectedAvatar) {
      Alert.alert('Missing Info', 'Please enter a username and select an avatar');
      return;
    }

    await AsyncStorage.setItem('hasOnboarded', 'true');
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('avatar', selectedAvatar);

    navigation.replace('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Welcome to LabelArcade!</Text>

      <Text style={styles.label}>Your Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Choose Your Avatar</Text>
      <View style={styles.avatarList}>
        {avatarOptions.map((avatar) => (
          <TouchableOpacity
            key={avatar}
            onPress={() => setSelectedAvatar(avatar)}
            style={[
              styles.avatarOption,
              selectedAvatar === avatar && styles.selectedAvatar,
            ]}
          >
            <Image source={getAvatarImage(avatar)} style={styles.avatarImage} />
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Start Labeling" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  avatarList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarOption: {
    padding: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  selectedAvatar: {
    borderColor: '#4CAF50',
    backgroundColor: '#e0ffe0',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
