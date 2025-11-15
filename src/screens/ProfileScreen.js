import React from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';

import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../hooks/useData';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();
    const { stats, fetchStats } = useUserStats();

    useFocusEffect(
        React.useCallback(() => {
            fetchStats();
        }, [])
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <View
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 40,
                            backgroundColor: Colors.surface,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 24,
                            borderWidth: 3,
                            borderColor: Colors.text,
                            transform: [{ rotate: '-3deg' }],
                            shadowColor: Colors.shadow,
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.4,
                            shadowRadius: 20,
                        }}
                    >
                        <Text style={{ fontSize: 48, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                            {(user?.full_name || user?.username || 'U').charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 32, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                        {user?.full_name || user?.username || 'User'}
                    </Text>
                    <Text style={{ fontSize: 18, color: Colors.textLight, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        Level 5 Habit Master
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: Colors.surface,
                            padding: 20,
                            borderRadius: 24,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: Colors.border,
                        }}
                    >
                        <Text style={{ fontSize: 32, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.primary, marginBottom: 4 }}>
                            {stats.streak}
                        </Text>
                        <Text style={{ fontSize: 14, color: Colors.textLight, fontFamily: 'SpaceGrotesk_500Medium', textTransform: 'uppercase' }}>Day Streak</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: Colors.surface,
                            padding: 20,
                            borderRadius: 24,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: Colors.border,
                        }}
                    >
                        <Text style={{ fontSize: 32, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.accent, marginBottom: 4 }}>
                            {Math.round(stats.completion_rate)}%
                        </Text>
                        <Text style={{ fontSize: 14, color: Colors.textLight, fontFamily: 'SpaceGrotesk_500Medium', textTransform: 'uppercase' }}>Completion</Text>
                    </View>
                </View>

                <View style={{ gap: 16 }}>
                    <Pressable
                        onPress={() => navigation.navigate('Settings')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.surface,
                            padding: 20,
                            borderRadius: 24,
                            borderWidth: 2,
                            borderColor: Colors.border,
                        }}
                    >
                        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                            <Feather name="settings" size={20} color={Colors.text} />
                        </View>
                        <Text style={{ flex: 1, fontSize: 18, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>Settings</Text>
                        <Feather name="chevron-right" size={20} color={Colors.textLight} />
                    </Pressable>

                    <Pressable
                        onPress={async () => {
                            try {
                                await Share.share({
                                    message: `Check out my progress on BlueKa! I have a ${stats.streak} day streak and ${Math.round(stats.completion_rate)}% completion rate. Join me!`,
                                });
                            } catch (error) {
                                alert(error.message);
                            }
                        }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.surface,
                            padding: 20,
                            borderRadius: 24,
                            borderWidth: 2,
                            borderColor: Colors.border,
                        }}
                    >
                        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                            <Feather name="share-2" size={20} color={Colors.text} />
                        </View>
                        <Text style={{ flex: 1, fontSize: 18, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>Share Profile</Text>
                        <Feather name="chevron-right" size={20} color={Colors.textLight} />
                    </Pressable>
                </View>

                <Pressable onPress={logout} style={{ marginTop: 40, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.primary }}>
                        LOG OUT
                    </Text>
                </Pressable>
            </ScrollView >
        </SafeAreaView >
    );
}
