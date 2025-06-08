import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { getProfile } from '../services/api';
import XPProgressBar from '../components/XPProgressBar';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        alert('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4CAF50" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 {profile.username}</Text>
      <Text style={styles.info}>📧 {profile.email}</Text>
      <Text style={styles.info}>🏆 Score: {profile.score}</Text>

      {/* ✅ XP Progress */}
      <XPProgressBar xp={profile.xp} level={profile.level} />

      {/* ✅ New: Streak Info */}
      <Text style={styles.info}>🔥 Streak: {profile.streakCount || 0} days</Text>

      {profile.lastSubmissionDate && (
        <Text style={styles.info}>
          📅 Last Submission: {new Date(profile.lastSubmissionDate).toLocaleDateString()}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
  },
});
