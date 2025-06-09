import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from 'react-native';
import { getProfile, updateProfile } from '../services/api';
import XPProgressBar from '../components/XPProgressBar';

const avatarOptions = [
  require('../assets/avatar1.png'),
  require('../assets/avatar2.png'),
  require('../assets/avatar3.png'),
  require('../assets/avatar4.png'),
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedUsername, setEditedUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const badgeInfo = {
    first_task: {
      title: '🚀 First Submission',
      desc: 'Completed your very first task!',
    },
    streak_3: {
      title: '🔥 3-Day Streak',
      desc: 'Submitted 3 days in a row!',
    },
    level_5: {
      title: '🏆 Level 5+',
      desc: 'Reached Level 5 — great job!',
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setEditedUsername(data.username);
        setSelectedAvatar(data.avatar || null);
      } catch (err) {
        alert('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        username: editedUsername,
        avatar: selectedAvatar,
      });
      Alert.alert('✅ Profile Updated!');
    } catch (err) {
      Alert.alert('❌ Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4CAF50" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Edit Profile</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={editedUsername}
        onChangeText={setEditedUsername}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Choose Avatar</Text>
      <View style={styles.avatarList}>
        {avatarOptions.map((img, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.avatarWrapper, selectedAvatar === img && styles.selectedAvatar]}
            onPress={() => setSelectedAvatar(img)}
          >
            <Image source={img} style={styles.avatarImage} />
          </TouchableOpacity>
        ))}
      </View>

      <Button title={isSaving ? 'Saving...' : 'Save Profile'} onPress={handleSave} disabled={isSaving} />

      <View style={styles.section}>
        <Text style={styles.info}>📧 {profile.email}</Text>
        <Text style={styles.info}>🏆 Score: {profile.score}</Text>
        <XPProgressBar xp={profile.xp} level={profile.level} />
        <Text style={styles.info}>🔥 Streak: {profile.streakCount || 0} days</Text>
        {profile.lastSubmissionDate && (
          <Text style={styles.info}>
            📅 Last Submission: {new Date(profile.lastSubmissionDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      <View style={styles.badgesBox}>
        <Text style={styles.badgesTitle}>🎖 My Badges</Text>
        {profile.badges?.length > 0 ? (
          profile.badges.map((badgeKey) => (
            <View key={badgeKey} style={styles.badgeItem}>
              <Text style={styles.badgeIcon}>{badgeInfo[badgeKey]?.title || badgeKey}</Text>
              <Text style={styles.badgeText}>{badgeInfo[badgeKey]?.desc || 'Badge unlocked!'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.badgeText}>No badges yet – go earn some!</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  avatarList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  avatarWrapper: {
    padding: 6,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#f4f4f4',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  selectedAvatar: {
    borderColor: '#4CAF50',
    backgroundColor: '#e0ffe0',
  },
  section: {
    marginTop: 30,
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
  },
  badgesBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff7e6',
    borderRadius: 10,
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ff8c00',
  },
  badgeItem: {
    marginBottom: 10,
  },
  badgeIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  badgeText: {
    fontSize: 14,
    color: '#555',
  },
});
