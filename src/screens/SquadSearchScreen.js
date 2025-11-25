import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import BackButton from '../components/BackButton';
import api from '../services/api';
import { useSquads } from '../hooks/useData';

export default function SquadSearchScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [joining, setJoining] = useState(null);
    const { fetchSquads } = useSquads();

    // Fetch initial squads (popular/all) on mount
    React.useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        // Allow empty query to fetch all/popular squads
        Keyboard.dismiss();
        setLoading(true);
        try {
            const response = await api.get(`/squads/search?q=${query}`);
            if (response.data.success) {
                setResults(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (squadId) => {
        setJoining(squadId);
        try {
            const response = await api.post(`/squads/${squadId}/join`);
            if (response.data.success) {
                await fetchSquads();
                navigation.goBack();
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to join squad');
        } finally {
            setJoining(null);
        }
    };

    const handleJoinByCode = async () => {
        if (!inviteCode.trim()) return;
        setJoining('code');
        try {
            const response = await api.post('/squads/join-by-code', { inviteCode });
            if (response.data.success) {
                await fetchSquads();
                navigation.goBack();
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Invalid invite code');
        } finally {
            setJoining(null);
        }
    };

    const renderItem = ({ item }) => (
        <View
            style={{
                backgroundColor: Colors.surface,
                padding: 20,
                borderRadius: 24,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: Colors.border,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <View style={{ flex: 1, marginRight: 16 }}>
                <Text style={{ fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                    {item.squad_name}
                </Text>
                <Text style={{ fontSize: 14, color: Colors.textLight, fontFamily: 'SpaceGrotesk_500Medium' }}>
                    {item.current_member_count} / {item.max_members} members
                </Text>
            </View>
            <Pressable
                onPress={() => handleJoin(item.id)}
                disabled={joining === item.id}
                style={{
                    backgroundColor: Colors.primary,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 16,
                    opacity: joining === item.id ? 0.7 : 1,
                }}
            >
                {joining === item.id ? (
                    <ActivityIndicator color="#FFF" size="small" />
                ) : (
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', color: '#FFF' }}>JOIN</Text>
                )}
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={{ padding: 24, paddingBottom: 0 }}>
                <BackButton />
                <Text style={{ fontSize: 32, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginTop: 16, marginBottom: 8 }}>
                    FIND A SQUAD
                </Text>
                <Text style={{ fontSize: 16, color: Colors.textLight, marginBottom: 24, fontFamily: 'SpaceGrotesk_500Medium' }}>
                    Search for public squads or enter an invite code.
                </Text>
            </View>

            <View style={{ paddingHorizontal: 24, gap: 24 }}>
                {/* Search Section */}
                <View>
                    <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8, marginLeft: 4 }}>
                        SEARCH BY NAME
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1, position: 'relative' }}>
                            <TextInput
                                style={{
                                    width: '100%',
                                    backgroundColor: Colors.surface,
                                    padding: 16,
                                    paddingRight: 48,
                                    borderRadius: 20,
                                    fontSize: 16,
                                    fontFamily: 'SpaceGrotesk_500Medium',
                                    borderWidth: 2,
                                    borderColor: Colors.border,
                                    color: Colors.text,
                                }}
                                placeholder="e.g. Morning Runners"
                                placeholderTextColor={Colors.textLight + '80'}
                                value={query}
                                onChangeText={setQuery}
                                returnKeyType="search"
                                onSubmitEditing={handleSearch}
                            />
                            {query.length > 0 && (
                                <Pressable
                                    onPress={() => setQuery('')}
                                    style={{
                                        position: 'absolute',
                                        right: 16,
                                        top: 16,
                                    }}
                                >
                                    <Feather name="x" size={20} color={Colors.textLight} />
                                </Pressable>
                            )}
                        </View>
                        <Pressable
                            onPress={handleSearch}
                            style={{
                                width: 56,
                                height: 56,
                                backgroundColor: Colors.text,
                                borderRadius: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Feather name="search" size={24} color={Colors.background} />
                        </Pressable>
                    </View>
                </View>

                {/* Invite Code Section */}
                <View>
                    <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8, marginLeft: 4 }}>
                        OR ENTER INVITE CODE
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TextInput
                            style={{
                                flex: 1,
                                backgroundColor: Colors.surface,
                                padding: 16,
                                borderRadius: 20,
                                fontSize: 16,
                                fontFamily: 'SpaceGrotesk_500Medium',
                                borderWidth: 2,
                                borderColor: Colors.border,
                                color: Colors.text,
                                textTransform: 'uppercase',
                            }}
                            placeholder="e.g. A1B2C3"
                            placeholderTextColor={Colors.textLight + '80'}
                            value={inviteCode}
                            onChangeText={setInviteCode}
                            autoCapitalize="characters"
                        />
                        <Pressable
                            onPress={handleJoinByCode}
                            disabled={joining === 'code'}
                            style={{
                                width: 56,
                                height: 56,
                                backgroundColor: Colors.accent,
                                borderRadius: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {joining === 'code' ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <Feather name="arrow-right" size={24} color="#FFF" />
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>

            <FlatList
                data={results}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 24 }}
                ListHeaderComponent={
                    results.length > 0 && (
                        <Text style={{ fontSize: 18, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 16 }}>
                            {query ? 'RESULTS' : 'POPULAR SQUADS'}
                        </Text>
                    )
                }
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
                    ) : (
                        !loading && (
                            <Text style={{ textAlign: 'center', color: Colors.textLight, marginTop: 40, fontFamily: 'SpaceGrotesk_500Medium' }}>
                                {query ? 'No squads found. Try a different name.' : 'No public squads found yet. Create one!'}
                            </Text>
                        )
                    )
                }
            />
        </SafeAreaView>
    );
}
