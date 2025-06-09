import AsyncStorage from '@react-native-async-storage/async-storage';

// 🌐 Backend API base URL
const API_BASE = 'https://labelarcade-backend-production.up.railway.app/api';

// 🔐 TII API Key (for dev, move to env for prod)
const TII_API_KEY = 'kt6ZgJC-DnuFaGNvsw3xUSk9D1NA9hFm';

// 🔐 Retrieve stored JWT token
export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// 🧠 Build headers
const getAuthHeaders = async (contentType = 'application/json') => {
  const token = await getToken();

  const headers = {
    'x-api-key': TII_API_KEY,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  return headers;
};

// ✅ Fetch next task from TII
export const fetchNextTask = async () => {
  const headers = await getAuthHeaders(null);
  const res = await fetch(`${API_BASE}/tasks/next`, { headers });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ fetchNextTask error body:', errorText);
    throw new Error('❌ Failed to fetch next task');
  }

  return res.json();
};

// 📤 Submit task response
export const submitAnswer = async (track_id, answer, taskId, timeTakenInSeconds) => {
  const headers = await getAuthHeaders();
  const body = JSON.stringify({ answer, taskId, timeTakenInSeconds });

  const res = await fetch(`${API_BASE}/tasks/${track_id}/submit`, {
    method: 'POST',
    headers,
    body,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ submitAnswer error body:', errorText);
    throw new Error('❌ Failed to submit answer');
  }

  return res.json();
};

// 📜 Get user's submission history
export const getSubmissionHistory = async () => {
  const headers = await getAuthHeaders(null);
  const res = await fetch(`${API_BASE}/submissions`, { headers });

  if (!res.ok) throw new Error('❌ Failed to fetch submission history');
  return res.json();
};

// 📊 Get average submission time
export const getAverageSubmissionTime = async () => {
  const headers = await getAuthHeaders(null);
  const res = await fetch(`${API_BASE}/submissions/average-time`, { headers });

  if (!res.ok) throw new Error('❌ Failed to fetch average submission time');
  return res.json();
};

// 🏆 Get leaderboard
export const getLeaderboard = async () => {
  try {
    const headers = await getAuthHeaders();

    if (__DEV__) {
      console.log('📡 Sending headers to leaderboard:', headers);
    }

    const res = await fetch(`${API_BASE}/leaderboard`, { headers });

    if (__DEV__) {
      console.log('📡 Leaderboard status:', res.status);
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ getLeaderboard error body:', errorText);
      throw new Error('❌ Failed to fetch leaderboard');
    }

    return res.json();
  } catch (error) {
    console.error('❌ getLeaderboard error:', error.message);
    throw error;
  }
};

// 👤 Get user profile ✅ (added now)
export const getUserProfile = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/user/profile`, { headers });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ getUserProfile error body:', errorText);
    throw new Error('❌ Failed to fetch user profile');
  }

  return res.json();
};
