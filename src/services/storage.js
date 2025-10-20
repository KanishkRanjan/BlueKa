import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@blueka_token';
const USER_KEY = '@blueka_user';

export const storage = {
    async getToken() {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (e) {
            console.error('Failed to get token', e);
            return null;
        }
    },

    async setToken(token) {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (e) {
            console.error('Failed to set token', e);
        }
    },

    async getUser() {
        try {
            const user = await AsyncStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error('Failed to get user', e);
            return null;
        }
    },

    async setUser(user) {
        try {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (e) {
            console.error('Failed to set user', e);
        }
    },

    async clearAuth() {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        } catch (e) {
            console.error('Failed to clear auth', e);
        }
    },
};
