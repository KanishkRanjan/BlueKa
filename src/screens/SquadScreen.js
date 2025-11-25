import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import SquadAvatarStack from '../components/SquadAvatarStack';

import { useSquads } from '../hooks/useData';
import { useFocusEffect } from '@react-navigation/native';

export default function SquadScreen({ navigation }) {
    const { squads, loading, fetchSquads } = useSquads();

    useFocusEffect(
        React.useCallback(() => {
            fetchSquads();
        }, [])
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <Text style={{ fontSize: 36, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                    YOUR CREW.
                </Text>
                <Text style={{ fontSize: 18, color: Colors.textLight, marginBottom: 32, fontFamily: 'SpaceGrotesk_500Medium' }}>
                    Better together.
                </Text>

                {squads.length > 0 ? (
                    squads.map((squad) => (
                        <Pressable
                            key={squad.id}
                            onPress={() => navigation.navigate('SquadDetail', { squadId: squad.id })}
                            style={{
                                backgroundColor: Colors.surface,
                                padding: 24,
                                borderRadius: 32,
                                marginBottom: 16,
                                borderWidth: 2,
                                borderColor: Colors.border,
                                shadowColor: Colors.shadow,
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
                                transform: [{ rotate: squad.id % 2 === 0 ? '-1deg' : '1deg' }],
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Text style={{ fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                                    {squad.squad_name}
                                </Text>
                                {/* Active badge logic would go here */}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* Use mock members if not available, or just show count */}
                                    <View style={{ flexDirection: 'row', marginRight: 12 }}>
                                        {/* Since we don't fetch members in list view yet, let's just show a placeholder or count */}
                                        <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: -8, borderWidth: 2, borderColor: Colors.surface }}>
                                            <Text style={{ color: '#FFF', fontSize: 12, fontFamily: 'SpaceGrotesk_700Bold' }}>
                                                {(squad.squad_name || 'S').charAt(0)}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 16, color: Colors.textLight, fontFamily: 'SpaceGrotesk_500Medium' }}>
                                        {squad.current_member_count || 1} members
                                    </Text>
                                </View>
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border }}>
                                    <Feather name="arrow-right" size={20} color={Colors.text} />
                                </View>
                            </View>
                        </Pressable>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: Colors.textLight, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        No squads yet. Create one!
                    </Text>
                )}

                <View style={{ flexDirection: 'row', gap: 16, marginTop: 24 }}>
                    <Pressable
                        onPress={() => navigation.navigate('CreateSquad')}
                        style={{
                            flex: 1,
                            borderWidth: 2,
                            borderColor: Colors.border,
                            borderStyle: 'dashed',
                            borderRadius: 32,
                            padding: 24,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Colors.surface + '80',
                        }}
                    >
                        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                            <Feather name="plus" size={24} color={Colors.primary} />
                        </View>
                        <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, textAlign: 'center' }}>
                            New Squad
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate('SquadSearch')}
                        style={{
                            flex: 1,
                            backgroundColor: Colors.surface,
                            padding: 24,
                            borderRadius: 32,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: Colors.border,
                            borderStyle: 'dashed',
                        }}
                    >
                        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.accent + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                            <Feather name="search" size={24} color={Colors.accent} />
                        </View>
                        <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, textAlign: 'center' }}>
                            Find Squad
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
