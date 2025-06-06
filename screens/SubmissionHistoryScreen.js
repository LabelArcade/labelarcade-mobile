import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getSubmissionHistory } from '../services/api';

export default function SubmissionHistoryScreen() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const data = await getSubmissionHistory();
      setSubmissions(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load submission history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.label}>🆔 Task ID: {item.taskId || 'N/A'}</Text>
      <Text style={styles.text}>📝 Answer: {item.answer || 'N/A'}</Text>
      <Text style={styles.text}>
        ⏱ Time: {item.timeTakenInSeconds != null ? `${item.timeTakenInSeconds} sec` : 'N/A'}
      </Text>
      <Text style={styles.timestamp}>
        📅 {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading submission history…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Submission History</Text>
      {submissions.length === 0 ? (
        <Text style={styles.noData}>No submissions found.</Text>
      ) : (
        <FlatList
          data={submissions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 50,
  },
  list: { paddingBottom: 20 },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    elevation: 2,
  },
  label: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  text: { fontSize: 15 },
  timestamp: { fontSize: 13, color: 'gray', marginTop: 8 },
});
