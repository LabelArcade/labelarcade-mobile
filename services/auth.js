import AsyncStorage from '@react-native-async-storage/async-storage';

export const logoutUser = async (navigation) => {
  try {
    await AsyncStorage.removeItem('token'); // 🔐 Clear stored JWT
    navigation.replace('Login'); // ✅ Safe and reliable
  } catch (err) {
    console.error('❌ Logout failed:', err);
  }
};
