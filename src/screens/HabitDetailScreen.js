import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import BackButton from '../components/BackButton';
import StreakFlame from '../components/StreakFlame';
import { useHabitDetails } from '../hooks/useData';

export default function HabitDetailScreen({ route }) {
    const { habitId } = route.params || { habitId: '1' };
    const { habit, loading } = useHabitDetails(habitId);

    if (loading || !habit) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', color: Colors.textLight }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    // Mock history for now as the API might not return it in this exact format yet
    // We would need to fetch completions separately or adjust the API response
    const history = [true, true, false, true, true, true, true];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={{ padding: 24, paddingBottom: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <BackButton />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ padding: 8, backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 2, borderColor: Colors.border }}>
                            <Feather name="edit-2" size={20} color={Colors.text} />
                        </View>
                        <View style={{ padding: 8, backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 2, borderColor: Colors.border }}>
                            <Feather name="trash-2" size={20} color={Colors.primary} />
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <Text style={{ fontSize: 40, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                    {habit.title}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
                    <StreakFlame streak={habit.streak} active={true} />
                    <Text style={{ fontSize: 18, fontFamily: 'SpaceGrotesk_500Medium', color: Colors.textLight, marginLeft: 8 }}>
                        current streak
                    </Text>
                </View>

                <View
                    style={{
                        backgroundColor: Colors.surface,
                        padding: 24,
                        borderRadius: 32,
                        marginBottom: 24,
                        borderWidth: 2,
                        borderColor: Colors.border,
                        transform: [{ rotate: '1deg' }],
                        shadowColor: Colors.shadow,
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                    }}
                >
                    <Text style={{ fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 16 }}>
                        Last 7 Days
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {habit.history.map((completed, index) => (
                            <View key={index} style={{ alignItems: 'center', gap: 8 }}>
                                <View
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 12,
                                        backgroundColor: completed ? Colors.success : Colors.background,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 2,
                                        borderColor: completed ? Colors.success : Colors.border,
                                    }}
                                >
                                    {completed && <Feather name="check" size={16} color={Colors.surface} strokeWidth={4} />}
                                </View>
                                <Text style={{ fontSize: 12, fontFamily: 'SpaceGrotesk_500Medium', color: Colors.textLight }}>
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: Colors.purpleGlow + '15',
                        padding: 24,
                        borderRadius: 32,
                        borderWidth: 2,
                        borderColor: Colors.purpleGlow,
                        transform: [{ rotate: '-1deg' }],
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Feather name="award" size={24} color={Colors.purpleGlow} />
                        <Text style={{ fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.purpleGlow, marginLeft: 12 }}>
                            Next Milestone
                        </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: Colors.text, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        Hit a 14-day streak to unlock the "Consistency King" badge.
                    </Text>
                    <View style={{ height: 8, backgroundColor: Colors.surface, borderRadius: 4, marginTop: 16, overflow: 'hidden' }}>
                        <View style={{ width: '85%', height: '100%', backgroundColor: Colors.purpleGlow }} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
