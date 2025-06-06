import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      return Alert.alert('Missing Info', 'Please enter username, email, and password');
    }

    try {
      const res = await fetch('https://labelarcade-backend-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();
      console.log('[DEBUG] Register response:', data);

      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        Alert.alert('🎉 Account Created', `Welcome, ${username}`);
        navigation.replace('Task');
      } else {
        Alert.alert('Registration failed', data.message || 'Try again');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Register" onPress={handleRegister} />

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 },
  link: { color: 'blue', marginTop: 16, textAlign: 'center' }
});
