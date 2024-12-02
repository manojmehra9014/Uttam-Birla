import AsyncStorage from '@react-native-async-storage/async-storage';

// Check if the user is authenticated
export const checkAuthentication = async () => {
    const isLoggedIn = await AsyncStorage.getItem('userLoggedIn');
    return isLoggedIn === 'true';
};

// Set the user's login state
export const setAuthentication = async (status) => {
    await AsyncStorage.setItem('userLoggedIn', status ? 'true' : 'false');
};
