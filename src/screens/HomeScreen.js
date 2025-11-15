import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Animated, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';
import HabitCard from '../components/HabitCard';
import EmptyState from '../components/EmptyState';
import FloatingActionButton from '../components/FloatingActionButton';

import { useAuth } from '../context/AuthContext';
import { useHabits, useCompletions } from '../hooks/useData';
import { useFocusEffect } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen({ navigation }) {
    const { user } = useAuth();
    const { habits, loading, fetchHabits } = useHabits();
    const { toggleCompletion } = useCompletions();
    const [greeting, setGreeting] = useState('Good morning');
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const headerY = React.useRef(new Animated.Value(-50)).current;

    useFocusEffect(
        React.useCallback(() => {
            fetchHabits();
        }, [])
    );

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(headerY, {
                toValue: 0,
                friction: 6,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleToggleHabit = async (id) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // Optimistic update
        // In a real app, we'd need more complex logic to handle the optimistic update correctly with the API response
        // For now, let's just wait for the fetch to refresh
        const result = await toggleCompletion(id);
        if (result.success) {
            fetchHabits();
        } else {
            Alert.alert('Error', result.error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ transform: [{ translateY: headerY }], opacity: fadeAnim, marginBottom: 32 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1, paddingRight: 16 }}>
                            <Text style={{ fontSize: 16, color: Colors.textLight, fontFamily: 'SpaceGrotesk_500Medium', textTransform: 'uppercase', letterSpacing: 1 }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </Text>
                            <Text
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                style={{ fontSize: 36, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginTop: 4 }}
                            >
                                {greeting}, {user?.name?.split(' ')[0] || 'Friend'}.
                            </Text>
                        </View>
                        <View
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 20,
                                backgroundColor: Colors.surface,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: Colors.border,
                                transform: [{ rotate: '6deg' }],
                                shadowColor: Colors.shadow,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 8,
                            }}
                        >
                            <Text style={{ fontSize: 24 }}>⚡️</Text>
                        </View>
                    </View>
                </Animated.View>

                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 20 }}>
                        Your Focus
                    </Text>

                    {habits.length > 0 ? (
                        habits.map((habit, index) => (
                            <Animated.View
                                key={habit.id}
                                style={{
                                    opacity: fadeAnim,
                                    transform: [{
                                        translateY: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50 * (index + 1), 0]
                                        })
                                    }]
                                }}
                            >
                                <HabitCard
                                    title={habit.habit_name}
                                    streak={habit.streak_count}
                                    completed={!!habit.completed}
                                    onPress={() => handleToggleHabit(habit.id)}
                                />
                            </Animated.View>
                        ))
                    ) : (
                        <EmptyState
                            icon="sun"
                            message="No habits yet"
                            subMessage="Tap the + button to start your journey."
                        />
                    )}
                </View>

                <View
                    style={{
                        backgroundColor: Colors.surface,
                        padding: 24,
                        borderRadius: 32,
                        marginTop: 16,
                        transform: [{ rotate: '-1deg' }],
                        borderWidth: 2,
                        borderColor: Colors.border,
                        shadowColor: Colors.shadow,
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <Feather name="users" size={24} color={Colors.primary} />
                        <Text style={{ fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginLeft: 12 }}>
                            Squad Updates
                        </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: Colors.text, lineHeight: 24, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        <Text style={{ color: Colors.primary }}>Sarah</Text> just crushed "Morning Run" 🔥
                    </Text>
                    <Text style={{ fontSize: 16, color: Colors.text, lineHeight: 24, marginTop: 8, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        <Text style={{ color: Colors.accent }}>Alex</Text> is on a 5-day streak!
                    </Text>
                </View>

                <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.8 }}>
                    <Text style={{ fontFamily: 'PatrickHand_400Regular', fontSize: 18, color: Colors.textLight, textAlign: 'center' }}>
                        "Small wins, big vibes."
                    </Text>
                </View>
            </ScrollView>

            <FloatingActionButton onPress={() => navigation.navigate('CreateHabit')} />
        </SafeAreaView>
    );
}
