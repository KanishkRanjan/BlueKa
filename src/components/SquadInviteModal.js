import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Modal, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import api from '../services/api';

export default function SquadInviteModal({ visible, onClose, squadId, onInviteSent }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inviting, setInviting] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        Keyboard.dismiss();
        setLoading(true);
        try {
            const response = await api.get(`/users?username=${query}`);
            if (response.data.success) {
                setResults(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (userId) => {
        setInviting(userId);
        try {
            const response = await api.post(`/squads/${squadId}/invite`, { userId });
            if (response.data.success) {
                onInviteSent();
                alert('Invitation sent!');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to invite user');
        } finally {
            setInviting(null);
        }
    };

    const renderItem = ({ item }) => (
        <View
            style={{
                backgroundColor: Colors.surface,
                padding: 16,
                borderRadius: 20,
                marginBottom: 12,
                borderWidth: 2,
                borderColor: Colors.border,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 2, borderColor: Colors.border }}>
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                        {(item.username || '?').charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                        {item.username}
                    </Text>
                    {item.full_name && (
                        <Text style={{ fontSize: 12, color: Colors.textLight, fontFamily: 'SpaceGrotesk_500Medium' }}>
                            {item.full_name}
                        </Text>
                    )}
                </View>
            </View>
            <Pressable
                onPress={() => handleInvite(item.id)}
                disabled={inviting === item.id}
                style={{
                    backgroundColor: Colors.primary,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    opacity: inviting === item.id ? 0.7 : 1,
                }}
            >
                {inviting === item.id ? (
                    <ActivityIndicator color="#FFF" size="small" />
                ) : (
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', color: '#FFF', fontSize: 12 }}>INVITE</Text>
                )}
            </Pressable>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: Colors.background, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Text style={{ fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                        Invite Members
                    </Text>
                    <Pressable onPress={onClose} style={{ padding: 8 }}>
                        <Feather name="x" size={24} color={Colors.text} />
                    </Pressable>
                </View>

                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
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
                        }}
                        placeholder="Search by username..."
                        placeholderTextColor={Colors.textLight + '80'}
                        value={query}
                        onChangeText={setQuery}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                        autoCapitalize="none"
                    />
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

                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={
                        loading ? (
                            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
                        ) : (
                            query && !loading && (
                                <Text style={{ textAlign: 'center', color: Colors.textLight, marginTop: 40, fontFamily: 'SpaceGrotesk_500Medium' }}>
                                    No users found.
                                </Text>
                            )
                        )
                    }
                />
            </View>
        </Modal>
    );
}
