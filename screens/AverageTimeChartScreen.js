import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { getSubmissionHistory } from '../services/api';

export default function AverageTimeChartScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Session Expired', 'Please login again.');
        navigation.replace('Login');
        return;
      }

      const submissions = await getSubmissionHistory();

      const grouped = {};
      submissions.forEach(({ taskId, timeTakenInSeconds }) => {
        if (!grouped[taskId]) grouped[taskId] = [];
        if (timeTakenInSeconds != null) grouped[taskId].push(timeTakenInSeconds);
      });

      const chartData = Object.entries(grouped).map(([taskId, times]) => {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        return { taskId, avgTime: Number(avg.toFixed(2)) };
      });

      setData(chartData.slice(0, 10)); // Show top 10
    } catch (err) {
      Alert.alert('Error', 'Failed to load chart data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading chart...</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.loading}>
        <Text>No data available to display chart.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📈 Average Time per Task (sec)</Text>
      <BarChart
        data={{
          labels: data.map((d) => `#${d.taskId}`),
          datasets: [{ data: data.map((d) => d.avgTime) }],
        }}
        width={Dimensions.get('window').width - 40}
        height={260}
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: () => `#007AFF`,
          labelColor: () => '#333',
          propsForLabels: { fontSize: 10 },
        }}
        verticalLabelRotation={30}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
});
