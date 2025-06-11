import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const avatarOptions = [
    require('../assets/avatar1.png'),
    require('../assets/avatar2.png'),
    require('../assets/avatar3.png'),
    require('../assets/avatar4.png'),
  ];

  const handleRegister = async () => {
    if (!email || !username || !password || selectedAvatar === null) {
      return Alert.alert('Missing Info', 'Please fill all fields and choose an avatar');
    }

    try {
      const avatarPaths = [
  '../assets/avatar1.png',
  '../assets/avatar2.png',
  '../assets/avatar3.png',
  '../assets/avatar4.png',
];

const avatarPath = avatarPaths[selectedAvatar];

      const response = await fetch('https://labelarcade-backend-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username,
          password,
          avatar: avatarPath,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Registration failed');
      }

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('hasOnboarded', 'true');
      Alert.alert('🎉 Registered', 'Welcome to LabelArcade!');
      navigation.replace('Task');
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎮 Join LabelArcade</Text>

      <TextInput
        style={[styles.input, { color: '#000' }]}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
      <TextInput
        style={[styles.input, { color: '#000' }]}
        placeholder="Username"
        onChangeText={setUsername}
        placeholderTextColor="#999"
      />
      <TextInput
        style={[styles.input, { color: '#000' }]}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>🧑 Choose Your Avatar</Text>
      <View style={styles.avatarRow}>
        {avatarOptions.map((avatar, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedAvatar(index)}
            style={[
              styles.avatarWrapper,
              selectedAvatar === index && styles.selectedAvatar,
            ]}
          >
            <Image source={avatar} style={styles.avatarImage} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>🚀 Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? <Text style={{ color: '#007AFF' }}>Login</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F9FBFF',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 14,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#555',
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 40,
    padding: 4,
  },
  selectedAvatar: {
    borderColor: '#4CAF50',
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#444',
    fontSize: 14,
  },
});
