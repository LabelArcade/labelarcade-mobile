import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getLeaderboard } from '../services/api';

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaders(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

 const renderItem = ({ item, index }) => (
  <View style={styles.row}>
    <Text style={styles.rank}>{getMedal(index)}</Text>
    <View style={styles.infoColumn}>
      <Text style={styles.email}>{item.email?.split('@')[0] || `User #${item.id}`}</Text>
      <Text style={styles.meta}>⭐ Level: {item.level || 1} | ⚡ XP: {item.xp || 0}</Text>
    </View>
    <Text style={styles.score}>{item.score}</Text>
  </View>
);


  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading Leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Rank</Text>
        <Text style={styles.headerText}>Email</Text>
        <Text style={styles.headerText}>Score</Text>
      </View>

      <FlatList
        data={leaders}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  rank: {
    flex: 0.5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    flex: 2,
    color: '#555',
    fontSize: 14,
  },
  score: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007AFF',
  },
  infoColumn: {
  flex: 2,
  justifyContent: 'center',
},
meta: {
  fontSize: 12,
  color: '#888',
},
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
