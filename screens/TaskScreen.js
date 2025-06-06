import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { fetchNextTask, submitAnswer } from '../services/api';

export default function TaskScreen({ navigation }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null); // ⏱️ Track start time

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

const handleAnswer = async (choiceKey) => {
  try {
    const value = task.task?.choices[choiceKey];
    const label = extractLabel(value);

    const taskId = task.id;
    const trackId = task.track_id;
    const timeTakenInSeconds = Math.floor((Date.now() - startTime) / 1000); // ✅ Use stored startTime

    await submitAnswer(trackId, choiceKey, taskId, timeTakenInSeconds);
    Alert.alert('Answer Submitted', `You selected: ${label}`);
    loadTask();
  } catch (err) {
    Alert.alert('Error', 'Failed to submit answer.');
  }
};


  useEffect(() => {
    loadTask();
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>LabelArcade Quiz</Text>

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
        <Button
          title="📊 View Submission History"
          onPress={() => navigation.navigate('Submissions')}
          color="#007AFF"
        />
      </View>

      <View style={styles.historyButtonWrapper}>
        <Button
          title="📈 View Average Time Chart"
          onPress={() => navigation.navigate('AvgTimeChart')}
          color="#34A853"
        />
      </View>

<View style={styles.historyButtonWrapper}>
  <Button
    title="🏆 View Leaderboard"
    onPress={() => navigation.navigate('Leaderboard')}
    color="#FF9900"
  />
</View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
});
