import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { getLeaderboard } from '../services/api';

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      if (!Array.isArray(data)) throw new Error('Invalid leaderboard data');
      setLeaders(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const renderItem = ({ item, index }) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;
    return (
      <View style={styles.row}>
        <Text style={styles.rank}>{medal}</Text>
        <Text style={styles.email}>{item.email || 'N/A'}</Text>
        <Text style={styles.score}>{item.score ?? 0}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <View style={styles.header}>
        <Text style={styles.headerText}>Rank</Text>
        <Text style={styles.headerText}>Email</Text>
        <Text style={styles.headerText}>Score</Text>
      </View>
      <FlatList
        data={leaders}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No data found.</Text>}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  rank: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  email: {
    flex: 3,
    textAlign: 'center',
  },
  score: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    paddingVertical: 30,
    color: '#666',
  },
});
