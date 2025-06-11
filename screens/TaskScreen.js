import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { fetchNextTask, submitAnswer, getUserProfile } from '../services/api';
import { logoutUser } from '../services/auth';
import StreakCelebration from '../components/StreakCelebration';
import LevelUpCelebration from '../components/LevelUpCelebration';
import ConfettiCannon from 'react-native-confetti-cannon';

// Map avatar string paths to local image requires
const avatarMap = {
  '../assets/avatar1.png': require('../assets/avatar1.png'),
  '../assets/avatar2.png': require('../assets/avatar2.png'),
  '../assets/avatar3.png': require('../assets/avatar3.png'),
  '../assets/avatar4.png': require('../assets/avatar4.png'),
};

export default function TaskScreen({ navigation }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const badgeInfo = {
    first_task: {
      title: '🚀 First Submission!',
      desc: 'You just completed your very first task!',
    },
    streak_3: {
      title: '🔥 3-Day Streak!',
      desc: 'You’ve submitted tasks 3 days in a row!',
    },
    level_5: {
      title: '🏆 Level 5 Achieved!',
      desc: 'You’ve reached Level 5 — amazing work!',
    },
  };

  const extractLabel = (value) => {
    if (typeof value !== 'object' || value === null) return String(value);
    return (
      value.label ||
      value.answer ||
      value.value ||
      value.text ||
      value.VALUE ||
      JSON.stringify(value)
    );
  };

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await fetchNextTask();
      const realTask = Array.isArray(data) ? data[0] : data;
      setTask(realTask);
      setStartTime(Date.now());
    } catch (err) {
      Alert.alert('Error', 'Failed to load task.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (err) {
      console.error('❌ Failed to load profile', err);
    }
  };

  const handleAnswer = async (choiceKey) => {
    try {
      const value = task.task?.choices[choiceKey];
      const label = extractLabel(value);

      const taskId = task.id;
      const trackId = task.track_id;
      const timeTakenInSeconds = Math.floor((Date.now() - startTime) / 1000);

      const response = await submitAnswer(trackId, choiceKey, taskId, timeTakenInSeconds);
      Alert.alert('Answer Submitted', `You selected: ${label}`);

      if (response?.message?.includes('Streak')) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      if (response?.message?.includes('Level Up')) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      if (response?.newBadge) {
        setNewBadge(response.newBadge);
        setShowBadgeModal(true);
      }

      loadTask();
      loadUserProfile();
    } catch (err) {
      Alert.alert('Error', 'Failed to submit answer.');
    }
  };

  useEffect(() => {
    loadTask();
    loadUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading task…</Text>
      </View>
    );
  }

  if (!task) {
    return <Text style={styles.loading}>No task found.</Text>;
  }

  const {
    content: { image } = {},
    task: { text, choices } = {},
  } = task;

  const xp = userProfile?.xp || 0;
  const level = userProfile?.level || 1;
  const score = userProfile?.score || 0;
  const username = userProfile?.username || 'User';
  const streak = userProfile?.streakCount || 0;
  const avatar = userProfile?.avatar || '';

  const xpToNextLevel = 50;
  const progress = xpToNextLevel > 0 ? (xp % xpToNextLevel) / xpToNextLevel : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StreakCelebration trigger={showCelebration} />
      <LevelUpCelebration trigger={showLevelUp} />
      {(showCelebration || showLevelUp || showBadgeModal) && (
        <ConfettiCannon count={100} origin={{ x: 150, y: 0 }} fadeOut />
      )}

      
<View style={styles.profileBox}>
  {avatar && avatarMap[avatar] && (
    <Image source={avatarMap[avatar]} style={styles.avatar} />
  )}
  <Text style={styles.profileText}>👤 {username}</Text>
  <Text style={styles.profileText}>⭐ Level: {level}</Text>
  <Text style={styles.profileText}>⚡ XP: {xp} / {xpToNextLevel}</Text>
  <Text style={styles.profileText}>🥇 Score: {score}</Text>
  {streak > 1 && (
    <Text style={styles.profileText}>🔥 Streak: {streak} days</Text>
  )}
  {showLevelUp && (
    <Text style={[styles.profileText, { color: '#FF9900', fontWeight: 'bold' }]}>🎯 Level Up!</Text>
  )}
  <Progress.Bar
    progress={progress}
    width={null}
    height={10}
    color="#34A853"
    borderRadius={5}
    borderWidth={0.5}
    unfilledColor="#e0e0e0"
  />
</View>


      {image?.url && <Image source={{ uri: image.url }} style={styles.image} />}
      <Text style={styles.question}>{text}</Text>

      {choices &&
        Object.entries(choices).map(([key, value]) => {
          const label = extractLabel(value);
          return (
            <View key={key} style={styles.buttonWrapper}>
              <Button title={label} onPress={() => handleAnswer(key)} />
            </View>
          );
        })}

      <View style={styles.historyButtonWrapper}>
        <Button title="📊 View Submission History" onPress={() => navigation.navigate('Submissions')} color="#007AFF" />
      </View>
      <View style={styles.historyButtonWrapper}>
        <Button title="📈 View Average Time Chart" onPress={() => navigation.navigate('AvgTimeChart')} color="#34A853" />
      </View>
      <View style={styles.historyButtonWrapper}>
        <Button title="🏆 View Leaderboard" onPress={() => navigation.navigate('Leaderboard')} color="#FF9900" />
      </View>
      <View style={styles.historyButtonWrapper}>
        <Button title="🚪 Logout" onPress={() => logoutUser(navigation)} color="#FF3B30" />
      </View>

      {showBadgeModal && (
        <View style={styles.badgeModal}>
          <View style={styles.badgeContent}>
            <Text style={styles.badgeTitle}>{badgeInfo[newBadge]?.title}</Text>
            <Text style={styles.badgeDesc}>{badgeInfo[newBadge]?.desc}</Text>
            <Button title="Awesome!" onPress={() => setShowBadgeModal(false)} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  buttonWrapper: {
    marginVertical: 6,
  },
  historyButtonWrapper: {
    marginTop: 30,
  },
  profileBox: {
    backgroundColor: '#eaf3ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center'
  },
  profileText: {
    fontSize: 16,
    marginBottom: 4,
  },
  badgeModal: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  badgeContent: {
    alignItems: 'center',
  },
  badgeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  badgeDesc: {
    fontSize: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
});
