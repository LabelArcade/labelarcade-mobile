import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://labelarcade-backend-production.up.railway.app/api';
const TII_API_KEY = 'kt6ZgJC-DnuFaGNvsw3xUSk9D1NA9hFm'; // 🔐 Use env variable in production

// 🔐 Get stored JWT token
export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// 🔧 Build auth headers
const getAuthHeaders = async (contentType = 'application/json') => {
  const token = await getToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'x-api-key': TII_API_KEY,
  };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
};

// 🎯 Fetch next task
export const fetchNextTask = async () => {
  const headers = await getAuthHeaders(null);
  const res = await fetch(`${API_BASE}/tasks/next`, { headers });

  if (!res.ok) throw new Error('❌ Failed to fetch next task');
  return res.json();
};

// ✅ Submit answer with taskId and time
export const submitAnswer = async (track_id, answer, taskId, timeTakenInSeconds) => {
  const headers = await getAuthHeaders('application/json'); // ✅ Ensure Content-Type is set
  const body = JSON.stringify({
    answer,
    taskId,
    timeTakenInSeconds,
  });

  const res = await fetch(`${API_BASE}/tasks/${track_id}/submit`, {
    method: 'POST',
    headers,
    body,
  });

  if (!res.ok) throw new Error('❌ Failed to submit answer');
  return res.json();
};

// 📜 Get submission history
export const getSubmissionHistory = async () => {
  const headers = await getAuthHeaders(null);
  const res = await fetch(`${API_BASE}/submissions`, { headers });

  if (!res.ok) throw new Error('❌ Failed to fetch submission history');
  return res.json();
};

// 📈 Get average submission time
export const getAverageSubmissionTime = async () => {
  const headers = await getAuthHeaders(null);
  const res = await fetch(`${API_BASE}/submissions/average-time`, { headers });

  if (!res.ok) throw new Error('❌ Failed to fetch average submission time');
  return res.json();
};

// 🏆 Get leaderboard data
export const getLeaderboard = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/submissions/leaderboard`, { headers });

  if (!res.ok) throw new Error('❌ Failed to fetch leaderboard');
  return res.json();
};
